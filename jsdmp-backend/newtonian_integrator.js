module.exports = {
    start_pos: null,    //initial position
    stop_pos: null,     //end position
    step_size: null,    //size of individual trapazoid
    current_pos: null,
    func: null,
    init: function(args){
        /*
         * Parameters:
         *  start_pos (int)
         *  stop_pos (int)
         *  step_size (int)
         *  job_size (int)
         *  current_pos (int)
         *  func (function) the math function to integrate
         */
        if (args.start_pos){
            this.start_pos = args.start_pos;
        } else {
            this.start_pos = 1
        }
        if (args.stop_pos){
            this.stop_pos = args.stop_pos;
        } else {
            this.stop_pos = 100
        }
        if (args.job_size){
            this.job_size = args.job_size;
        } else {
            this.job_size = 10;
        }
        if (args.current_pos){
            this.current_pos = args.current_pos;
        } else {
            this.current_pos = this.start_pos;
        }
        if (args.func){
            this.func = args.func;
        } else {
            this.func = function(i){
                return Math.cos(i / 3) - Math.cos(i / 5) + Math.sin(i / 4) + 80;
            }
        }
        if (args.step_size){
            this.step_size = args.step_size
        } else {
            this.step_size = 0.1;
        }
        this.num_jobs = Math.floor((this.stop_pos - this.start_pos) / this.step_size);
    },
    generator: function(data) {
        /*
         * returns:
         *  job {data -> {start, end}, compute_function -> function}
         */
        var end = this.current_position + this.step_size;
        this.current_position += this.step_size;
        if(end > this.stop_pos){
          end = this.stop_pos;
        }
        var job = {
            data: {
                start: this.current_position,
                end: end
            },
            compute_function: this.compute_function
        };
        return job;
    },
    aggregator: function(data) {
        /* Parameters:
         *  data.result (int)
         */
        this.total += data.result;
    },
    compute_function: function(args) {
        /* Parameters
         *  start (int)
         *  stop (int)
         */
        var total = 0;
        var a = this.func(args.start);
        var b = this.func(args.end);
        return ((a + b) / 2) * (this.end - this.start);
    }
}