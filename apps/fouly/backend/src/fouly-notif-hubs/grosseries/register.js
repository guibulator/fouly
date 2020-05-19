var azure = require('azure');
var notificationHubService = azure.createNotificationHubService(
  'fouly-dev-notif-hub',
  'Endpoint=sb://fouly-dev-notif-hub.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=bVl6tMtr/9DMoUmVFpMuWzJp9CjdaWvH6vkHZLgRMqc='
);
