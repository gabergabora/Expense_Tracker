var mongoose = require('mongoose');

var userSchema= new mongoose.Schema({
    userName: {type:String},
    firstName:{type:String},
    lastName:{type:String},
    password:{type:String},
    walletId : {type: mongoose.Schema.Types.ObjectId, ref: 'Wallet'},
});

module.exports= mongoose.model('User',userSchema, 'User');
