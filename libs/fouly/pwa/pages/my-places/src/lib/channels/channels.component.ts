import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { ChatMessageCommand, ChatMessageResult } from '@skare/fouly/data';
import { ChatStoreService } from '@skare/fouly/pwa/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'fouly-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit, AfterViewChecked {
  public ready: Boolean = false;
  public userMsg = new FormControl('');
  public messages: ChatMessageResult[] = [];
  public $messages = new Subject<ChatMessageResult[]>();
  public connection: signalR.HubConnection;
  public placeName: string;
  private placeId: string;

  constructor(private chatService: ChatStoreService, private route: ActivatedRoute) {}

  sendMsg(newMsg: string) {
    const myMsg = new ChatMessageCommand();
    myMsg.author = 'Anonyme';
    myMsg.msg = newMsg;
    myMsg.time = new Date();
    myMsg.placeId = this.placeId;
    this.chatService.postNewMsg(myMsg).subscribe();
    this.userMsg.setValue('');
  }

  ngOnInit() {
    this.placeId = this.route.snapshot.params['placeId'];
    this.placeName = this.route.snapshot.params['placeName'];

    this.chatService.getConnectionSignalR().subscribe(async (info) => {
      // const info = JSON.parse(res);
      await this.start(info);
    });

    this.chatService.getMsgHistory(this.placeId).subscribe((data: ChatMessageResult[]) => {
      this.messages = data;
      this.$messages.next(this.messages);
      // this.scrollDown();
    });
  }

  ngAfterViewChecked() {
    // scrollDown() {   Todo: Fix me, scroll function called before view render
    const objDiv = document.getElementById('chatScrollView');
    if (objDiv) {
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  }

  onNewMsgInChannel(newMsg: ChatMessageResult) {
    this.messages.push(newMsg);
    this.$messages.next(this.messages);
  }

  //Todo : manage resouces on destroy

  async start(info: any) {
    try {
      const options = {
        accessTokenFactory: () => info.accessToken
      };

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(info.url, options)
        .configureLogging(signalR.LogLevel.Information)
        .withAutomaticReconnect()
        .build();

      this.connection.on('onNewMsg', (data) => {
        if (data && data.placeId === this.placeId) {
          console.log('received new msg');
          const newMsg = new ChatMessageResult();
          newMsg.author = data.author;
          newMsg.msg = data.msg;
          newMsg.time = data.time;
          newMsg.placeId = data.placeId;
          this.onNewMsgInChannel(newMsg);
        }
      });

      this.connection.onclose(function() {
        console.log('signalr disconnected');
      });

      this.connection.onreconnecting((err) => console.log('err reconnecting  ', err));

      this.connection.onclose(async () => {
        await this.connection.start();
      });

      await this.connection.start();
      console.log('connected');

      this.ready = true;
    } catch (err) {
      console.log('Fatal : ' + err);
      setTimeout(() => this.connection.start(), 15000);
    }
  }
}
