const mongoose = require('mongoose')
const DataBaseConnect = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/UsersDataSend') // database automatically Created
    .catch((err) => { console.log(console.error(err)) })
    console.log('db connected')
}



module.exports = DataBaseConnect;

