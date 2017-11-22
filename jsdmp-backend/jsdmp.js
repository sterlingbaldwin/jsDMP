module.exports = {
    /*
     * socket messages:
     *  outgoing:
     *      job:done -> All jobs are complete
     *      job:new_job_set -> new set of jobs for the client
     *      update -> response to a clients update request
     *  incomming:
     *      disconnect -> a client disconnected
     *      connect -> a new client connected
     *      job:update -> a client is requesting run status update
     *      job:completed -> a client completed its job set
     *      job:request -> client requesting a new job set
     */
    init: function(args) {
        /*
         * Parameters:
         *  generator (function)
         *  aggregator (function)
         *  compute_function (function)
         *  num_jobs (int)
         *  job_size (int)
         */
        if (!args.generator) {
            console.log('no generator given to init');
            this.generator = null;
        } else {
            this.generator = args.generator;
        }
        if (!args.aggregator) {
            console.log('no aggregator given to init');
            this.aggregator = null;
        } else {
            this.aggregator = args.aggregator;
        }
        if (!args.compute_function) {
            console.log('no compute_function given to init');
            this.compute_function = null;
        } else {
            this.compute_function = args.compute_function.toString();
        }
        if (!args.num_jobs) {
            console.log('no num_jobs given to init');
            this.num_jobs = null;
        } else {
            this.num_jobs = args.num_jobs;
        }
        if (args.job_size) {
            this.job_size = args.job_size;
        } else {
            this.job_size = 1;
        }
        this.last_job_sent = false;
        this.jobs_sent = 0;
        this.update_jobs = 0;
        this.numberOfUsers = 0;
        this.inprog = {};
        this.idle_jobs = [];
        this.start_time = null;
        this.stop_time = null;
        this.elapsed_time = null;
        this.done = false;
    },
    dispatch: function(data) {
        if (this.jobs_sent == this.num_jobs){
            this.client.emit('job:done', {});
        } else {
            var jobs = [];
            var job;
            if (!this.inprog[client.id]){
                this.inprog[client.id] = [];
            }
            for (var i = 0; i < this.job_size; i++){
                if(this.idle_jobs.peek()){
                    job = this.idle_jobs.pop();
                } else {
                    job = this.generator(data);
                }
                this.inprog[client.id].push(job);
                jobs.push(job);
            }
            client.emit('job:new_job_set', jobs)
            this.jobs_sent += this.job_size;
            if (this.jobs_sent === this.num_jobs) {
                this.last_job_sent = true;
            }
        }
    },
    generator: function() {},
    aggregator: function() {},
    compute_function: function() {},
    job_complete: function(data){
        // client in scope
        delete this.inprog[client.id];
        if (this.jobs_sent == this.num_jobs){
            this.done = true;
            this.stop_time = new Date();
            this.elapsed_time = (this.stop_time.getTime() - this.start_time.getTime()) / 1000;
        }
    },
    completed: function(){
        if (this.last_job_sent && Object.keys(this.inprog).length === 0){
            return true;
        }
        else {
            return false;
        }
    },
    connected: function(client){
        console.log('client connected');
        this.numberOfUsers += 1;
        if(!this.start_time){
            this.start_time = new Date();
        }
    },
    disconnect: function(id) {
        if(this.inprog[id]){
            for(var i = 0; i < this.inprog[id].length; i++){
                this.idle_jobs.push(this.inprog[id][i]);
            }
            delete this.inprog[id];
        }
        this.numberOfUsers -= 1;
    },
    update: function(data){
        // client in scope
        var update_jobs;
        if(this.update_jobs == 0){
            update_jobs = this.jobs_sent;
        } else {
            this.update_jobs = this.jobs_sent - this.update_jobs;
        }
        
        var elapsed_time = null;
        if(this.done){
            elapsed_time = this.elapsed_time;
        }

        var update_data = {
            completed: this.done,
            jobsCompleted: this.jobs_sent,
            numberOfUsers: this.numberOfUsers,
            elapsed_time: elapsed_time,
        }
        client.emit('update', update_data);
    },
    last_job_sent: false,
    step_size: null,
    job_size: 1,
    socket: {},
    jobq: [],
    inprogq: {},
};
