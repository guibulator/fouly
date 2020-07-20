import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import * as signalR from '@microsoft/signalr';
import { ChatMessageCommand, ChatMessageResult } from '@skare/fouly/data';
import { AuthenticationService, ChatStoreService } from '@skare/fouly/pwa/core';
import { SocialUser } from 'angularx-social-login';
import { BehaviorSubject, fromEvent, Observable, Subscription } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { uuid } from 'uuidv4';
@Component({
  selector: 'fouly-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit, OnDestroy, AfterViewInit {
  userScrolled$: Observable<boolean>;
  followTail = true;
  ready: Boolean = false;
  user$: Observable<SocialUser>;
  messages$ = new BehaviorSubject<ChatMessageResult[]>([]);
  userMsg = new FormControl('');
  connection: signalR.HubConnection;
  placeName: string;

  private hasBeendDestroyed = false;
  private messages: ChatMessageResult[] = [];
  private placeId: string;

  private subscriptions = new Subscription();
  private correlationIds: string[] = [];

  @ViewChild('chatHistoryContent') chatHistoryContent: IonContent;
  @ViewChild('sendBtn') sendMsgButton: any;

  constructor(
    private chatService: ChatStoreService,
    private route: ActivatedRoute,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.placeId = this.route.snapshot.params['placeId'];
    this.placeName = this.route.snapshot.params['placeName'];
    this.user$ = this.authService.currentUser$;
    this.chatService.getConnectionSignalR().subscribe((info) => {
      this.start(info);
    });

    this.chatService.getMsgHistory(this.placeId).subscribe((data: ChatMessageResult[]) => {
      this.messages = data;
      this.messages$.next([...data]);
      setTimeout(() => {
        this.scrollToBottom();
        this.ready = true;
      }, 500);
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
        if (currentScrollDepth < scrollHeight - 15) {
          return true;
        }
        return false;
      }),
      tap((v) => {
        this.followTail = !v;
      })
    );
    this.subscriptions.add(
      fromEvent(this.sendMsgButton.el, 'click').subscribe(() => this.sendMsg(this.userMsg.value))
    );
  }

  scrollToBottom() {
    this.chatHistoryContent.scrollToBottom(300);
    this.followTail = true;
  }

  sendMsg(newMsg: string) {
    this.authService.currentUser$
      .pipe(
        filter((user) => !!user),
        take(1),
        map((user) => {
          if (newMsg === null || newMsg === '' || newMsg.trim() === '') {
            return;
          }

          const myMsg: ChatMessageCommand = {
            correlationId: uuid(),
            author: user.name,
            msg: newMsg,
            time: new Date(),
            placeId: this.placeId,
            userId: user.id
          };

          this.correlationIds.push(myMsg.correlationId);
          this.chatService.postNewMsg(myMsg);

          // optimistic save for new mesage
          this.onNewMsgInChannel(
            {
              author: myMsg.author,
              msg: myMsg.msg,
              time: myMsg.time,
              userId: myMsg.userId,
              placeId: myMsg.placeId
            },
            true
          );
          this.userMsg.setValue('');
        })
      )
      .subscribe();
  }

  onNewMsgInChannel(newMsg: ChatMessageResult, isLocal: boolean = false) {
    if (this.followTail) {
      setTimeout(() => this.chatHistoryContent.scrollToBottom(500), 50);
    }
    // if matching correlation id message in list, this is user's own new message.
    if (!isLocal && newMsg.correlationId && this.correlationIds.indexOf(newMsg.correlationId) > -1)
      return;
    this.messages.push(newMsg);
    this.messages$.next([...this.messages]);
  }

  async start(info: any) {
    if (this.hasBeendDestroyed) return;
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
          newMsg.correlationId = data.correlationId;
          this.onNewMsgInChannel(newMsg);
        }
      });

      this.connection.onclose(function() {
        //console.log('signalr disconnected');
      });

      //this.connection.onreconnecting((err) => console.log('err reconnecting  ', err));

      this.connection.onclose(async () => {
        await this.connection.start();
      });

      await this.connection.start();
      //console.log('connected');
    } catch (err) {
      //console.log('Fatal : ' + err);
      setTimeout(() => this.connection.start(), 15000);
    }
  }

  ngOnDestroy() {
    this.hasBeendDestroyed = true;
    this.connection && this.connection.stop();
    this.subscriptions.unsubscribe();
  }
}
