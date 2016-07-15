var app = angular.module('jsdmp', []);
app.factory('socket', function($rootScope) {
    var socket;
    socket = io.connect("http://localhost:8080");
    // socket = io.connect("localhost:8080");
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
app.controller('DemoCtrl', ['$scope', 'socket', function($scope, socket) {

  $scope.init = function(){
    var timeout = 200;
    var update = function() {
        socket.emit('update', {});
    };
    setInterval(update, timeout);
  }

  socket.on('update', function(data){
    console.log('Got an update');
    console.log(data);
    if(data.current_approximation){
      $scope.current_approximation = data.current_approximation;
    }
    if(data.jobsCompleted){
      $scope.jobsCompleted = data.jobsCompleted;
    }
    if(data.numberOfUsers){
      $scope.numberOfUsers = data.numberOfUsers;
    }
    if(data.error){
      $scope.error = data.error;
    }
    if(data.elapsed_time){
      $scope.elapsed_time = data.elapsed_time;
    }
    if(data.jobRate){
      $scope.jobRate = data.jobRate;
    }
    if(data.completed){
      $scope.completed = true;
    }
  });
}]);

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  return $interpolateProvider.endSymbol(']]');
});
