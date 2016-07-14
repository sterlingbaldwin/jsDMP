$(function() {
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    var connection = new WebSocket('ws://127.0.0.1:1337');

    // Requests job on connect
    function requestJob() {
        connection.send('get-job')
    }

  

    // tells the backend to dorp the job when computed
    function reportBackend(){

    }

    function sendOutput(){

    }

    connection.onopen = function() {
        console.log('connection ready');
        requestJob();
        //request job()
        //computejob()
    }; //ask for resources and


    connection.onerror = function(error) {
        console.log('connection error');
    };

    connection.onmessage = function(message) {
        // try to decode json (I assume that each message from server is json)
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }
        console.log('got a message');
        console.log(message);
    };
});
