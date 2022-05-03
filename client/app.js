// https://www.youtube.com/watch?v=FAMWIoKvfRs&t=401s 2:53:)

App ={

    contracts:{},

    init: async () => {
        console.log('Loaded')
        await App.loadEtherium()
        await App.loadAccount()
        await App.loadContracts()
        await App.render()
        await App.renderTasks()
    }, 

    loadEtherium: async () => {
        if (window.ethereum){
            console.log('Ethereum is available')
            App.web3Provider = window.ethereum
            await window.ethereum.request({method: "eth_requestAccounts"})
        }
        else if(window.web3){
            web3 = new Web3 (window.web3.currentProvider)
        }
        else{
            console.log('Ethereum is not available, please install MetaMask')
        }
    },

    loadAccount: async () => {
        const accounts = await window.ethereum.request({method: "eth_requestAccounts"})
        App.account = accounts[0]
        console.log('App Account: ', App.account)
    },

    loadContracts: async () => {
        const res = await fetch("TasksContract.json")
        const tasksContractJSON = await res.json()
        
        App.contracts.tasksContract = TruffleContract(tasksContractJSON)

        App.contracts.tasksContract.setProvider(App.web3Provider)

        App.tasksContract = await App.contracts.tasksContract.deployed()
    },

    render: async () => {
        document.getElementById('account').innerText = App.account
    },

    renderTasks: async () => {
        const taskCounter = await App.tasksContract.tasksCounter()
        // const taskCounter = await App.tasksContract.getTasksCounter({from: App.account})
        const taskCounterNumber = taskCounter.toNumber()
        // console.log('taskCounter: ', taskCounterNumber)

        let html = ''

        for (let i = 1; i <= taskCounterNumber; i++) {
            const task = await App.tasksContract.tasks(i)
            const taskId = task[0].toNumber()
            const taskTitle = task[1]
            const taskDescription = task[2]
            const taskDone = task[3]
            const taskCreated = task[4]

            let taskElement = `
                <div class="card rounded-0 mb-2 bg-dark">
                    <div class="card-header d-flex justify-content-between align-center">
                        <h5 class="card-title text-light">${taskTitle}</h5>
                        <div class="form-check form-switch">
                            <input class="form-check-input" data-id="${taskId}" type="checkbox" onchange="App.toggleDone(this)" 
                                ${taskDone === true && "checked"}
                            />
                            
                        </div>
                    </div>
                    <div class="card-body">
                        <p class="card-text text-light">${taskDescription}</p>
                        <p class="text-muted">Created at ${new Date(taskCreated * 1000).toLocaleString()}</p>
                    </div>
                </div>
            `
            html += taskElement     
        }
        document.querySelector('#TaskList').innerHTML = html;
    },

    createTask: async (title,description) => {
        const result = await App.tasksContract.createTask(title,description, {
            from: App.account
        })
        const taskEvent = result.logs[0].args;
        // console.log(taskEvent)
        window.location.reload();
    }, 

    toggleDone: async (element) => {
        const taskId = element.dataset.id;
        await App.tasksContract.toggleDone(taskId, {
          from: App.account,
        });
        window.location.reload();
      }

};

// App.init();