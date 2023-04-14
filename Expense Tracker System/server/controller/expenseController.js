const userModel = require('../model/userModel.js');
const walletModel = require('../model/walletModel.js');
const expenseHistoryModel = require('../model/expenseHistory.js');
const randomFunc = require('../functions/random.js');
const categoryModel = require('../model/categoryModel.js');
const tokenFunc = require('../functions/token.js');
const { parse } = require('path');

let response = {
    message : "Successful!"
}


// return user or null
const getUser = async(userName) =>{
    const user = await userModel.findOne({userName : userName}).populate('walletId').exec()
    .catch(err=>{
        return null;
    });
    return user;
}

const getWallet = async(walletId) =>{
    const wallet = await walletModel.findOne({walletId : walletId})
    .catch(err=>{
        return null;
    });
    return wallet;
}

const getExpenseCategories = async() =>{
    const category = await categoryModel.find()
    .catch(err=>{
        return null;
    });
    return category[0].expenses;
}

const getIncomeCategories = async() =>{
    const category = await categoryModel.find()
    .catch(err=>{
        return null;
    });
    return category[0].savings;
}

// return bool
const updateWallet = async(wallet) => {
    await walletModel.updateOne({walletId : wallet.walletId}, wallet)
    .catch(err=>{
        console.log("Error occured!");
        console.log(err);
        return false;
    });
    return true;
}

// return bool
const addUserExpense = async(expenseHistory) =>{
    let expense = await expenseHistoryModel.create(expenseHistory)
    .catch(err=>{
        console.log(err);
        return false;
    });
    return expense;
}

const getAllExpense = async(user) =>{
    const expenseAll = await expenseHistoryModel.find({userName : user}).sort({createdAt: 'desc'})
    .catch(err=>{
        console.log(err);
        return null;
    });
    return expenseAll;
}

const getCategories = async() =>{
    
    const categories = await categoryModel.find({})
    .catch(err=>{
        console.log(err);
        return null;
    });
    return categories;
}

const deleteUserExpense = async(expenseId) => {
    await expenseHistoryModel.deleteOne({expenseId : expenseId})
    .catch(err=>{
        console.log(err);
        return false;
    });
    return true;
}

const countTotalExpenseForCategory = async(user, category) => {
    const expenseAll = await expenseHistoryModel.find({userName : user, category: category})
    .catch(err=>{
        console.log(err);
    });
    let totalExpenseForCategory = 0;
    expenseAll.forEach((element) => {
        if(element.action == "expense"){
            totalExpenseForCategory = totalExpenseForCategory + parseInt(element.amount);
        }
    });
    return totalExpenseForCategory;

}
    const countTotalIncomeForCategory = async(user, category) => {
        const expenseAll = await expenseHistoryModel.find({userName : user, category: category})
        .catch(err=>{
            console.log(err);
        });
        let totalExpenseForCategory = 0;
        
        expenseAll.forEach((element) => {
            if(element.action == "income"){
                totalExpenseForCategory = totalExpenseForCategory + parseInt(element.amount);
            }
        });
    
    return totalExpenseForCategory;
}


module. exports= {
    addExpense: async function(req,res){ 
        const {amount, action, category, note} = req.body;
        const usertoken = req.headers.usertoken;
        const userName = tokenFunc.verifyToken(usertoken);
        if(!userName){
            response.message = "Please login first";
            return res.status(403).send(response);
            
        }else
        {
            const user = await getUser(userName);
            if(user == null){
                response.message = "Some error occured. Please try again later"
                return res.status(500).send(response);
                
            }
            let wallet = user.walletId;
            
            if(action == "income"){
                wallet.availableFund +=  parseInt(amount);
                wallet.totalSavings += parseInt(amount);
            }else if(action == "expense"){
                wallet.availableFund -=  parseInt(amount);
                wallet.totalExpense += parseInt(amount);
            }

            
            let expenseHistory = {
                "userName" : user,
                "expenseId" : "expesne_" + randomFunc.randomIntFromInterval().toString(),
                "amount" : amount,
                "action": action, // + or -
                "category": category,
                "note": note
            }
            
            const expenseHistoryAdded = await addUserExpense(expenseHistory);
            if(!expenseHistoryAdded){
                response.message = "Some error occured while adding expesne.  Please try again later"
                return res.status(500).send(response);

            }
            const walletUpdated = await updateWallet(wallet);

            if(walletUpdated && expenseHistoryAdded){
                response.lastTransaction = expenseHistoryAdded
                response.message = "Expense Added Successfully"
                return res.status(200).send(response);

            }else if(!walletUpdated && expenseHistoryAdded){
                deleteUserExpense(expenseHistory.expenseId);
                response.message = "Some error occured while updating wallet.  Please try again later"
                return res.status(500).send(response);

            }        
            
            response.message = "Some error occured while updating wallet.  Please try again later"
            res.status(500).send(response);
            
        
        }
    },
    getAllExpense: async function(req,res){ 
        const usertoken = req.headers.usertoken;
        const userName = tokenFunc.verifyToken(usertoken);
        if(!userName){
            response.message = "Please login first";
            return res.status(403).send(response); 
        }
        const user = await getUser(userName);
        if(user == null){
            response.message = "Some error occured. Please try again later"
            return res.status(500).send(response);
        }
        const allExpenses = await getAllExpense(user);
        if(allExpenses != null){
            response.message = "Expense found Successfully";
            response.allUserExpense = allExpenses;
            response.wallet = user.walletId;
            return res.status(200).send(response);
        }
        response.message = "Some error occured while updating wallet.  Please try again later"
        res.status(500).send(response);
    },
    getAllCategory: async function(req, res){
        const usertoken = req.headers.usertoken;
        const userName = tokenFunc.verifyToken(usertoken);
        if(!userName){
            response.message = "Please login first";
            return res.status(403).send(response); 
        }
        const user = await getUser(userName);
        if(user == null){
            response.message = "Some error occured. Please try again later"
            return res.status(500).send(response);
        }
        const allCategory = await getCategories();
        if(allCategory != null){
            response.message = "Categories found Successfully";
            response.categories = allCategory;
            // response.userName = userName;
            return res.status(200).send(response);
        }
        response.message = "Some error occured while updating wallet.  Please try again later"
        res.status(500).send(response);
    },
    calculateCategoryTotal: async function(req, res){
        console.log(req.headers)
        const usertoken = req.headers.usertoken;
        const userName = tokenFunc.verifyToken(usertoken);
        if(!userName){
            response.message = "Please login first";
            return res.status(403).send(response);
        }
        const user = await getUser(userName);
        if(user == null){
            response.message = "Some error occured. Please try again later"
            return res.status(500).send(response);

        }

        const allExpenseCategories = await getExpenseCategories();
        if(allExpenseCategories == null){
            response.message = "Some error occured. Please try again later"
            return res.status(500).send(response);

        }
    
        let expensesAll = {incomes: {}, expenses: {}};
        try {
            for (const element of allExpenseCategories){
                expensesAll["expenses"][element] = await countTotalExpenseForCategory(user, element);
            }
        } catch (error) {
            response.message = "Some error occured. Please try again later"
            return res.status(500).send(response);
        } finally {
            
        }

        const allIncomeCategories = await getIncomeCategories();
        if(allIncomeCategories == null){
            response.message = "Some error occured. Please try again later"
            return res.status(500).send(response);

        }
    
        try {
            for (const element of allIncomeCategories){
                expensesAll["incomes"][element] = await countTotalIncomeForCategory(user, element);
            }
        } catch (error) {
            response.message = "Some error occured. Please try again later"
            return res.status(500).send(response);
        }
        console.log(expensesAll)
            response.message = "Successful"
            response.categoriesTotal = expensesAll;
            return res.status(200).send(response);

    },
    deleteExpense: async function(req,res){
        const usertoken = req.headers.usertoken;
        const userName = tokenFunc.verifyToken(usertoken);
        if(!userName){
            response.message = "Please login first";
            return res.status(403).send(response); 
        }
        const user = await getUser(userName);
        if(user == null){
            response.message = "Some error occured. Please try again later"
            return res.status(500).send(response);
        }
        if(deleteUserExpense(req.params.id)){
            return res.status(200).send(response);
        }else{
            return res.status(500).send(response);
        }
    }
}