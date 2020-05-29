import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { ChatMessageCommand, ChatMessageResult } from '@skare/fouly/data';
import { Subject } from 'rxjs';
import { ChannelService } from './channel.service';

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

  constructor(private channelService: ChannelService, private route: ActivatedRoute) {}

  sendMsg(newMsg: string) {
    const myMsg = new ChatMessageCommand();
    myMsg.author = '';
    myMsg.text = newMsg;
    myMsg.time = new Date();
    myMsg.placeId = this.placeId;
    this.channelService.saveNewMsg(myMsg).subscribe(() => console.log('Saved'));
    this.userMsg.setValue('');
  }

  ngOnInit() {
    this.placeId = this.route.snapshot.params['placeId'];
    this.placeName = this.route.snapshot.params['placeName'];

    this.channelService.getConnection().subscribe(async (res) => {
      const info = JSON.parse(res);
      await this.start(info);
    });

    this.channelService.getLastMsg(this.placeId).subscribe((data: ChatMessageResult[]) => {
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
        const myMsg = new ChatMessageResult();
        myMsg.author = data.author;
        myMsg.text = data.msg;
        myMsg.time = data.time;
        this.onNewMsgInChannel(myMsg);
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
