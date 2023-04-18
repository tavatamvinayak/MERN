const mongoose = require('mongoose');

const Notes = new Schema({
    
    userId : {
        type:mongoose.Schema.Types.ObjectId,
        ref : "User",
        required:true
    },
    title : { type :String ,required:true  },
    description : { type :String , required:true },

  

})

module.exports = mongoose.model('Notes' , Notes); // database Collection automatically created name is Login