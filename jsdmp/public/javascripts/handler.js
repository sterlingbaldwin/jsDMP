var app = angular.module('jsdmp', []);
app.factory('socket', function($rootScope) {
    var socket;
    socket = io.connect("http://baldwin.codes:8080");
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
app.controller('AppView', ['$scope', 'socket', function($scope, socket) {
    $scope.init = function() {
        socket.emit('job:request', {});
    };


    socket.on('update', function(data){
      $scope.current_approximation = data.aproximation;
      $scope.jobsCompleted = data.jobsCompleted;
      $scope.numberOfUsers = data.numberOfUsers;

    });



}]);
