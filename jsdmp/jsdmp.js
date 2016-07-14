module.exports = {
  generator: function(){

  },
  init: function(args){
    if(args.generator){
      this.generator = generator;
    }
  },
  dispatcher: function(){
    var job = jobq.pop();
    inprogq.push(job);
    socket.emit('job:request', job);
  },
  aggregator: function(){

  },
  socket = null;
};

var jobq = []
var inprogq = []
var completeq = []

var compute_function = function(){

}

var pending_data =
