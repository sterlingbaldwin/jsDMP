var app = angular.module('jsdmp', []);
app.factory('socket', function($rootScope) {
    var socket;
    socket = io.connect("http://baldwin.codes:8080");
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
  socket.on('update', function(data){
    $scope.current_approximation = data.current_positionaproximation;
    $scope.jobsCompleted = data.jobsCompleted;
    $scope.numberOfUsers = data.numberOfUsers;
    $scope.error = data.error;
    $scope.elapsed_time = data.elapsed_time;
  });
}]);
