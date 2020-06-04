import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import * as signalR from '@microsoft/signalr';
import { ChatMessageCommand, ChatMessageResult } from '@skare/fouly/data';
import { ChatStoreService } from '@skare/fouly/pwa/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, switchMap, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'fouly-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit, OnDestroy, AfterViewInit {
  userScrolled$: Observable<boolean>;
  private followTail = true;
  public ready: Boolean = false;
  public userMsg = new FormControl('');
  private messages: ChatMessageResult[] = [];
  public messages$ = new BehaviorSubject<ChatMessageResult[]>([]);
  public connection: signalR.HubConnection;
  public placeName: string;
  private placeId: string;
  subscriptions = new Subscription();
  @ViewChild('chatHistoryContent') chatHistoryContent: IonContent;
  @ViewChild('sendBtn') sendMsgButton: any;
  constructor(private chatService: ChatStoreService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.placeId = this.route.snapshot.params['placeId'];
    this.placeName = this.route.snapshot.params['placeName'];

    this.chatService.getConnectionSignalR().subscribe(async (info) => {
      await this.start(info);
    });

    this.chatService.getMsgHistory(this.placeId).subscribe((data: ChatMessageResult[]) => {
      this.messages = data;
      this.messages$.next([...data]);
    });
  }

  ngAfterViewInit(): void {
    this.userScrolled$ = this.chatHistoryContent.ionScroll.pipe(
      // tslint:disable-next-line: deprecation
      switchMap(
        (event: any) => event.target.getScrollElement(),
        (event, scrollElement) => [event, scrollElement]
      ),
      map(([event, scrollElement]) => {
        const scrollHeight = scrollElement.scrollHeight - scrollElement.clientHeight;
        const currentScrollDepth = event.detail.scrollTop;
        // Once user scrolls, user needs to press the bottom to follow the tail again.
        if (currentScrollDepth < scrollHeight) {
          this.followTail = false;
          return true;
        }
      }),
      throttleTime(200)
    );
    this.sendMsgButton.el.addEventListener('click', () => {
      this.sendMsg(this.userMsg.value);
    });
  }

  scrollToBottom() {
    this.chatHistoryContent.scrollToBottom(300);
    this.followTail = true;
  }

  sendMsg(newMsg: string) {
    const myMsg = new ChatMessageCommand();
    myMsg.author = 'Anonyme';
    myMsg.msg = newMsg;
    myMsg.time = new Date();
    myMsg.placeId = this.placeId;
    this.chatService.postNewMsg(myMsg);
    this.userMsg.setValue('');
  }

  onNewMsgInChannel(newMsg: ChatMessageResult) {
    if (this.followTail) {
      this.chatHistoryContent.scrollToBottom();
    }
    this.messages.push(newMsg);
    this.messages$.next([...this.messages]);
  }

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

  startSpeechRecognition() {
    // todo..
    // const recognition = new webkitSpeechRecognition();
    // recognition.addEventListener('result', (event) => {
    //   recognition.stop();
    //   this.userMsg.setValue(event.results[0].transcript, { emitModelToViewChange: true });
    // });
    // recognition.start();
  }
  ngOnDestroy() {
    this.connection.stop();
    this.subscriptions.unsubscribe();
  }
}