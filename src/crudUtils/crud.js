const fetchTasks = () => {
    db.collection('tasks').find({ completed: false }).toArray((error, tasks) => {
        if (error) {
            return console.log('Unable to fetch tasks');
        }
        console.log(tasks);
    })
}

const fetchUsers = () => {
    db.collection('users').find({ age: 26 }).count((error, count) => {
        if (error) {
            return console.log('Unable to fetch count');
        }
        console.log(count);
    });
}

const addUser = () => {
    db.collection('users').insertOne({
        _id: id,
        name: 'Vikram',
        age: 26
    }, (error, result) => {
        if (error) {
            return console.log('Unable to insert user');
        }
        console.log(result);
    });
}

const addUsers = () => {
    db.collection('users').insertMany([
        { name: 'Jen', age: 28 },
        { name: 'Gunther', age: 27 }
    ], (error, result) => {
        if (error) {
            return console.log('An error ocured' + error);
        }
        console.log(result);
    });
}
const addTasks = () => {
    db.collection('tasks').insertMany([
        { description: 'Clean the room', completed: true },
        { description: 'Make coffee', completed: false },
        { description: 'Prepare breakfast', completed: true }
    ], (error, result) => {
        if (error) {
            return console.log('An error ocured.', error)
        }
        console.log(result);
    });
}

const fetchUser = () => {
    db.collection('users').findOne({ name: 'Jen', age: 1 }, (error, user) => {
        if (error) {
            return console.log('Unable to fetch user');
        }
        console.log(user);
    });
}



const fetchTask = () => {
    db.collection('tasks').findOne({ _id: new ObjectId('60f6765f8073d0db7a29906f') }, (error, result) => {
        if (error) {
            return console.log('Unable to fetch task');
        }
        console.log(result);
    })
}


    // fetchTasks();
