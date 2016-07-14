var app = angular.module('jsDMP', ['btford.socket-io', 'AppCtrl']);

app.factory('mySocket', function(socketFacotry) {
    var mySocket = socketFactory();
});

app.controller('AppCtrl', function($scope, mySocket) {
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
});
