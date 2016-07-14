module.exports = {
  generator: function(){

  },
  init: function(args){
    if(!args.generator){
      console.log('no generator given to init');
    }
    if(!args.aggregator){
      console.log('no aggregator given to init');
    }
    if(args.jobq_size){
      this.jobq_size = args.jobq_size;
    }
    if(!args.compute_function){
      console.log('no compute_function given to init');
    }
    if(args.step_size){
      this.step_size = args.step_size;
    }
    this.aggregator = args.aggregator;
    this.compute_function = args.compute_function;
    this.generator = args.generator;

  },
  dispatcher: function(){
    var job = jobq.pop();
    inprogq.push(job);
    socket.emit('job:request', job);
  },
  aggregator: function(){

  },
  compute_function: function(){

  },
  step_size: 1,
  socket: {},
  jobq: [],
  inprogq: [],
  completeq: []
};
