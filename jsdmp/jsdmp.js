module.exports = {
    generator: function() {

    },
    init: function(args) {
        if (!args.generator) {
            console.log('no generator given to init');
        }
        if (!args.aggregator) {
            console.log('no aggregator given to init');
        }
        if (args.jobq_size) {
            this.jobq_size = args.jobq_size;
        } else {
            this.jobq_size = 10;
        }
        if (!args.compute_function) {
            console.log('no compute_function given to init');
        }
        if (args.step_size) {
            this.step_size = args.step_size;
        }
        this.num_jobs = args.num_jobs;
        this.jobs_sent = 0;
        this.aggregator = args.aggregator;
        this.compute_function = args.compute_function.toString();
        this.generator = args.generator;
    },
    dispatcher: function(client) {
        if (this.jobs_sent !== this.num_jobs) {
            this.generator();
            var job = this.jobq.pop();
            this.inprogq[client.id] = job;
            client.emit('job:new_job', job)
            this.jobs_sent += 1;
            if (this.jobs_sent === this.num_jobs) {
                //last job
                this.last_job_sent = true;
            }
        }
    },
    aggregator: function() {

    },
    compute_function: function() {

    },
    clientDisconnect() {

    },
    completed(){
        if (this.last_job_sent && Object.keys(this.inprogq).length === 0){
            return true;
        }
        else{
            return false;
        }
    },
    last_job_sent: false,
    step_size: null,
    socket: {},
    jobq: [],
    inprogq: {},
};
