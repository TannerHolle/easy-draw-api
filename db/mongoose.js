// this file will handle connection logic to the mongoDB database

const mongoose = require('mongoose');


mongoose.Promise = global.Promise;

/** If we are connecting to mongo Atlas in prod */
mongoose.connect('mongodb+srv://admin:EasyDrawAdmin@easydraw.kh14q.mongodb.net/EasyDraw?retryWrites=true&w=majority').then(() =>{
    console.log("connected to MongoDB successfully :)")
  }).catch((e) => {
    console.log("Error while trying to connect to MongoDB")
    console.log(e);
});

/** If we are connecting to mongo Atlas in dev */
// mongoose.connect('mongodb+srv://admin:EasyDrawTestAdmin@easydrawtest.6w7rx.mongodb.net/EasyDrawTest?retryWrites=true&w=majority').then(() =>{
//     console.log("connected to MongoDB successfully :)")
//   }).catch((e) => {
//     console.log("Error while trying to connect to MongoDB")
//     console.log(e);
// });

/** If we are connecting to a mongo db on the local machine: reminder to start mongo in the terminal first*/
// mongoose.connect('mongodb://localhost:27017/EasyDraw', {useNewUrlParser: true}).then(() =>{
//   console.log("connected to MongoDB successfully :)")
// }).catch((e) => {
//   console.log("Error while trying to connect to MongoDB")
//   console.log(e)
// });

// mongoose.set('useCreateIndex', true);
// mongoose.set('useFindAndModify', false);
//more

module.exports = {
  mongoose
};
