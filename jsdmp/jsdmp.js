module.exports = {
  generator: function(){

  },
  init: function(args){
    if(args.generator){
      this.generator = generator;
    }
  }
};

var jobq = []
var inprogq = []
var completeq = []
