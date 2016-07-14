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
    } else {
      this.jobq_size = 10;
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
    while(this.jobq.length < this.jobq_size){
      this.generator();
    }

  },
  dispatcher: function(){
    var job = jobq.pop();
    this.inprogq.push(job);
    this.socket.emit('job:new_job', job);
    this.generator();
  },
  aggregator: function(){

  },
  compute_function: function(){

  },
  step_size: null,
  socket: {},
  jobq: [],
  inprogq: [],
  completeq: []
};
