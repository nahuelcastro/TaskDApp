// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract TasksContract{

    uint256 public tasksCounter = 0;

    constructor(){
        createTask("My first example task", "This is my first task :)");
    }

    event TaskCreated(
        uint256 id,
        string title,
        string description,
        bool done,
        uint256 createdAt
    );

    event TaskToggleDone(
        uint256 id,
        bool done
    );

    struct Task{
        uint256 id;
        string title;
        string description;
        bool done;
        uint256 createdAt;
    }

    mapping (uint256 => Task) public tasks;

    function createTask(string memory _title, string memory _description) public {
        tasksCounter++;
        // taskCounter2++;
        tasks[tasksCounter] = Task(tasksCounter, _title, _description, false, block.timestamp);
        emit TaskCreated(tasksCounter, _title, _description, false, block.timestamp);
    }

    function toggleDone(uint _id) public {
        tasks[_id].done = !tasks[_id].done;
        emit TaskToggleDone(_id, tasks[_id].done);
    }

    function getTasksCounter() public view returns (uint counter){
        counter = tasksCounter;
    }

}
