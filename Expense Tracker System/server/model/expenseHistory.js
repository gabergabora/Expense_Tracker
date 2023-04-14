var mongoose = require('mongoose');

var expenseHistorySchema= new mongoose.Schema({
    expenseId : {type: String},
    userName : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    amount : {type : Number},
    action: {type : String}, // + or -
    category: {type: String},
    note: {type: String} // From User
    },
    { timestamps : true }
);

module.exports= mongoose.model('expenseHistory',expenseHistorySchema, 'ExpenseHistory');
