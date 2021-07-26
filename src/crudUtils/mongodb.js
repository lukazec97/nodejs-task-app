const { MongoClient, ObjectId } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-managers';

const id = new ObjectId()
// console.log(id);
// console.log(id.getTimestamp());

MongoClient.connect(connectionURL, { useNewUrlParser: true , useUnifiedTopology:true}, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database');
    }
    const db = client.db(databaseName);

    const updateUser = (id) => {
        const updatePromise = db.collection('users').updateOne({ _id: new ObjectId(id) }, {
            $inc: {
                age: 1
            }
        });
        updatePromise.then((result) => {
            console.log(result);
        }).catch((error) => {
            console.log(error);
        })
    };

    // updateUser('60f67ff8dc45a1575ef468e1');

    const updateUsers = () => {
        const updatePromise = db.collection('users').updateMany({ age: 28 }, {
            $set: {
                pets: 'dog'

            }
        });
        updatePromise.then((result) => {
            console.log(result);
        }).catch((error) => {
            console.log(error);
        })
    }

    const deleteMany = (age) => {
        db.collection('users').deleteMany({
            age: age
        }).then((result) => {
            console.log(result);
        }).catch((error) => {
            console.log(error);
        })
    }
    // deleteMany(28);

    const deleteOne = (desc) => {
        db.collection('tasks').deleteOne({
            description:desc
        }).then((result) =>{
            console.log(result);
        }).catch((error)=> {
            console.log(error);
        })

    }
    // deleteOne('Make coffee');
    // updateUsers();

});