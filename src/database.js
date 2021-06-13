const mongoose = require('mongoose');
let username = "pet-app";
let password = "supersecret";
let database = "pets-db-app";
const uri = "mongodb+srv://" + username + ":" + password + "@cluster0.rd94w.mongodb.net/" + database + "?retryWrites=true&w=majority";
// const uri = "mongodb://localhost/pets-db-app";
mongoose.connect(uri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: true
})
    .then(db => console.log('DB is connected'))
    .catch(err => console.log(err));