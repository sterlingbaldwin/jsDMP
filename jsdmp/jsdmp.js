module.exports = {
  generator: function(){

  },
  init: function(args){
    if(args.generator){
      this.generator = generator;
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
