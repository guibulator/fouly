var payload =
  '<toast><visual><binding template="ToastText01"><text id="1">Hello windows application</text></binding></visual></toast>';
notificationHubService.wns.send(null, payload, 'wns/toast', function(error) {
  if (!error) {
    // notification sent
  }
});
