var app = angular.module('jsDMP', ['btford.socket-io', 'jsDMP.AppCtrl']);

app.factory('mySocket', function(socketFacotry) {
  return socketFactory();
});

app.controller('AppCtrl', function($scope, mySocket) {
  mySocket.emit('Hello Event', { data: 'Hi Team' });
});
