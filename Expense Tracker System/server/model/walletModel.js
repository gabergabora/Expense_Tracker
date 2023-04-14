var mongoose = require('mongoose');

var walletSchema= new mongoose.Schema({
    walletId : {type: String},
    availableFund : {type : Number},
    totalSavings: {type: Number},
    totalExpense: {type: Number}
});

module.exports= mongoose.model('Wallet',walletSchema, 'Wallet');
