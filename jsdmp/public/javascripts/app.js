var app = angular.module('jsDMP', ['btford.socket-io', 'jsDMP.AppCtrl']);

app.factory('mySocket', function(socketFacotry) {
  return socketFactory();
});

app.controller('AppCtrl', function($scope, mySocket) {
  $scope.init = function() {
    mySocket.emit('Hello Event', { data: 'Hi Team' });
  };
// Computes job, when done returns the result
  $scope.compute = function(job){
    var data = job.data;
    return output = job.function(data);
  };
});
