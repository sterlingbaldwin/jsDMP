module.exports = {
  generator: function(){

  },
  init: function(args){
    if(args.generator){
      this.generator = args.generator;
    }
    if(args.aggregator){
      this.aggregator = args.aggregator;
    }
    if(args.jobq_size){
      this.jobq_size = args.jobq_size;
    }
  },
  dispatcher: function(){

  },
  aggregator: function(){

  },

};

var jobq = []
var inprogq = []
var completeq = []

var compute_function = function(){

}

var pending_data =
