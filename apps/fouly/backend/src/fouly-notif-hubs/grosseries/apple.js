notificationHubService.apns.createTemplateRegistration(
  'deviceToken',
  'tag',
  {
    aps: {
      alert: '$(message)',
      badge: '#(count)',
      sound: 'default'
    }
  },
  function(e, r) {
    if (e) {
      console.log(e);
    } else {
      console.log({
        id: r.RegistrationId,
        deviceToken: r.DeviceToken,
        expires: r.ExpirationTime
      });
    }
  }
);
