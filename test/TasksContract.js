 const TasksContract = artifacts.require("TasksContract")

 contract("TasksContract", () =>{

    before(async () => {
        this.taskContract = await TasksContract.deployed();
    })

    it('migrate deployed succesfully', async () => {
        const address = this.taskContract.address
        assert.notEqual(address, null);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, undefined);
        assert.notEqual(address, '');
    });

    // it('get Tasks List', async () => {
    //     const counter = await this.taskContract.tasksCounter();
    //     const task = await this.taskContract.tasks(counter.toNumber());
    //     assert.equal(counter.toNumber(), task.id.toNumber());
    //     assert.equal(task.title, "My first example task");
    //     assert.equal(task.description, "This is my first task :)");
    //     assert.equal(task.done, false);
    //     assert.equal(tasksCounter, 1);
    // });

    it("task created succesfully", async () => {
        const result = await this.taskContract.createTask("My test example task", "test task :)");
        const taskEvent = result.logs[0].args;
        const counter = await this.taskContract.tasksCounter();

        assert.equal(taskEvent.id.toNumber(), 2); 
        assert.equal(taskEvent.id.toNumber(), counter.toNumber()); 
        assert.equal(taskEvent.title, "My test example task");
        assert.equal(taskEvent.description, "test task :)");
        assert.equal(taskEvent.done, false);
    
    })

    it('task toggle done', async () => {
        const result = await this.taskContract.toggleDone(1);
        const taskEvent = result.logs[0].args;
        const task = await this.taskContract.tasks(1);

        const result2 = await this.taskContract.toggleDone(1);
        const taskEvent2 = result2.logs[0].args;

        assert.equal(taskEvent.done, true);
        assert.equal(task.done, true);
        assert.equal(taskEvent.id, 1)
        assert.equal(taskEvent2.done, false);
    });

    it('Toggle Check', async () => {
        const old_task = await this.taskContract.tasks(0);
        const old_done = old_task.done;
        await this.taskContract.toggleDone(0);
        const new_task = await this.taskContract.tasks(0);
        const new_done = new_task.done;
        await this.taskContract.toggleDone(0);
        const last_task = await this.taskContract.tasks(0);
        const last_done = last_task.done;
        // const new_new_task = await this.taskContract.tasks(0);
        // const new_new_done = new_new_task.done;
        assert.equal(old_done, old_done);
        assert.notEqual(old_done, new_done);
        assert.equal(old_done, last_done);
    });

    


    // it("testt", async () => {
    //     const tasksCounter = await this.taskContract.tasksCounter();
    //     const task = await this.taskContract.tasks(tasksCounter);
    
    //     assert.equal(task.id.toNumber(), tasksCounter.toNumber());
    //     assert.equal(task.title, "my first task");
    //     assert.equal(task.description, "my first description");
    //     assert.equal(task.done, false);
    //     assert.equal(tasksCounter, 1);
    //   });
 });