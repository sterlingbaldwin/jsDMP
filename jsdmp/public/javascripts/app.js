var app = angular.module('jsdmp', ['AppCtrl']);
app.factory('socket', function($rootScope) {
    var socket;
    socket = io.connect("http://localhost:8080");
    return {
      on: function(eventName, callback) {
        return socket.on(eventName, function() {
          var args;
          args = arguments;
          return $rootScope.$apply(function() {
            return callback.apply(socket, args);
          });
        });
      },
      emit: function(eventName, data, callback) {
        return socket.emit(eventName, data, function() {
          var args;
          args = arguments;
          return $rootScope.$apply(function() {
            return callback.apply(socket, args);
          });
        });
      }
    };
  });
app.controller('AppCtrl', ['$scope', 'socket', function($scope, socket) {
    $scope.init = function() {
        mySocket.emit('job:request', {});
        mySocket.on('job:new_job', $scope.compute);
    };
    // Computes job, when done returns the result
    $scope.compute = function(job) {
        console.log('job', job)
        var data = job.data;
        var output = job.function(data);
        mySocket.emit('job:completed', {
            result: output
        });
    };
}]);
