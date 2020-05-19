import { Injectable } from '@angular/core';
import { Plugins, PushNotification, PushNotificationToken } from '@capacitor/core';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { EventType, Notification, Registration } from './events';

declare let PushNotification;
const { PushNotifications } = Plugins;
const config = {
  hubName: 'fouly-dev-notif-hub',
  hubConnectionString:
    'Endpoint=sb://fouly-dev-notif-hub.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=bVl6tMtr/9DMoUmVFpMuWzJp9CjdaWvH6vkHZLgRMqc='
};

@Injectable({
  providedIn: 'root'
})
export class AzureNotificationHubsService {
  public pushEvents: (Registration | Notification)[] = [];
  private eventsSubject = new Subject<any>();
  // constructor(private alertCtrl: AlertController, private platform: Platform) {
  // this.platform.ready().then(() => this.starter());
  constructor() {
    // this.onDeviceReady();
  }

  tests() {
    console.log('test call azure notif service');
  }

  request() {
    PushNotifications.requestPermission().then((result) => {
      if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });
  }
  onDeviceReady() {
    console.log('AzureNotificationHubsService: Platform ready');

    if (config.hubName && config.hubConnectionString) {
      // Initialize the Push Service
      const push = PushNotification.init({
        // Initialize the ANH Cordova plugin, this is required to use ANH
        // Pass in our configuration values
        notificationHubPath: config.hubName,
        connectionString: config.hubConnectionString,
        // Set some other stuff the plugin wants
        android: { sound: true },
        ios: { alert: 'true', badge: true, sound: 'false' }
      });

      push.on('registration', (data) => {
        // Registration event for the ANH Cordova plugin (Capacitor has its own)
        console.log('AzureNotificationHubsService: Registration');
        // Copy the event data into a Registration object
        const registration: Registration = _.clone(data);
        // Populate the object type
        registration.type = EventType.registration;
        // Set the title (registrations won't have one)
        registration.title = 'Registration';
        // Set the created date
        registration.received = new Date(Date.now());
        // Add the event to the events array
        this.saveData(registration);
        this.eventsSubject.next('anh: data-change');

        // Tell the user
        // this.alertCtrl
        //   .create({
        //     header: registration.title,
        //     message: 'Registration completed successfully',
        //     buttons: ['OK']
        //   })
        //   .then((alert) => alert.present());
      });

      PushNotifications.addListener('registration', (token: PushNotificationToken) => {
        // this alert should never fire because we're not using the Capacitor plugin's
        // registration method for anything, we're doing it through Notification Hubs
        console.log('Registration (Capacitor)');
        // this.alertCtrl
        //   .create({
        //     // @ts-ignore
        //     header: 'Registration (Capacitor)',
        //     message: `Push registration success (token: ${token.value})`,
        //     buttons: ['OK']
        //   })
        //   .then((alert) => alert.present());
      });

      PushNotifications.addListener(
        'pushNotificationReceived',
        (pushNotification: PushNotification) => {
          console.log('AzureNotificationHubsService: pushNotificationReceived');
          console.dir(pushNotification);
          // Populate the object type
          // @ts-ignore
          pushNotification.type = EventType.notification;
          // Set the created date
          // @ts-ignore
          pushNotification.received = new Date(Date.now());
          // convert the notification's data object into a string
          pushNotification.data = JSON.stringify(pushNotification.data);
          // Add the event to the events array
          this.saveData(pushNotification as Notification);
          this.eventsSubject.next('anh: data-change');

          // Tell the user
          // this.alertCtrl
          //   .create({
          //     // @ts-ignore
          //     header: 'Notification',
          //     message: pushNotification.data,
          //     buttons: ['OK']
          //   })
          //   .then((alert) => alert.present());
        }
      );
    } else {
      // Tell the user this won't work until they fix the config.
      console.log('Invalid config else...');
      // this.alertCtrl
      //   .create({
      //     header: 'Invalid Configuration',
      //     // tslint:disable-next-line:max-line-length
      //     message:
      //       "Please populate the project's <strong>src/app/config.ts</strong> file with settings from your Azure Notification Hubs configuration.",
      //     buttons: ["OK, I'm sorry!"]
      //   })
      //   .then((alert) => alert.present());
    }
  }

  // saveData(data: Registration | Notification) {
  saveData(data: Registration | Notification) {
    console.log('AzureNotificationHubsService: saveData()');
    this.pushEvents.push(data);
    console.dir(this.pushEvents);
  }
}
