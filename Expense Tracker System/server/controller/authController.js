const userModel = require('../model/userModel.js');
const walletModel = require('../model/walletModel.js');
const randomFunc = require('../functions/random.js');
const tokenFunc = require('../functions/token.js');
module. exports= {
    loginUser: async function(req,res){
        const { userName, password } = req.body;
        let response = {
            message : "Login Successful"
        }
        const user = await userModel.findOne({userName : userName}) 
        .catch(err=>{
            response.message = "Some error occured. Please try again later"
            return res.status(500).send(response);
        });
        if( user.password != password){
            response.message = "Invalid User credentials!";
            return res.status(403).send(response);
        }
        usertoken  = tokenFunc.setToekn(userName);
        response.user = user;
        response.usertoken = usertoken;
        
        res.status(200).send(response);

    },
    registerUser :  async function(req,res){
        const { userName, password, firstName, lastName } = req.body;
        let response = {
            message : "Register Successful"
        }

        let isRegistered = true;
        

        const newWallet = {
            "walletId" : userName + "_wallet_"+randomFunc.randomIntFromInterval().toString(),
            "availableFund" : 0,
            "totalSavings": 0,
            "totalExpense": 0
        };

        const newUser = {
            "userName": userName,
            "firstName": firstName,
            "lastName" : lastName,
            "password": password,
            "walletId" : null
        };
        walletModel.create(newWallet).then((result) => {
        })
        .catch((err =>{
            response.message = "Some error occured. Please try again later";
            return res.status(403).send(response);

        }))
        
        const wallet = await walletModel.findOne({walletId : newWallet.walletId});
        newUser.walletId = wallet
        const user = await userModel.create(newUser).then((result) => { 
            response.message = "User Created Successfully";
            }).catch(err =>{
                console.log(err);
                isRegistered = false;
                response.message = "Some error occured. Please try again later";
                return res.status(500).send(response);
            
        })

        usertoken  = tokenFunc.setToekn(userName);
        response.user = newUser;
        response.usertoken = usertoken;
        res.status(200).send(response);
    },
    getUserProfile :  async function(req,res){
        let response = {
            message : "Successful!"
        }
        const usertoken = req.headers.usertoken;
        const userName = tokenFunc.verifyToken(usertoken);
        if(!userName){
            response.message = "Please login first";
            return res.status(403).send(response);
            
        }
        
        const user = await userModel.findOne({userName : userName}).populate('walletId').exec()
        .catch(err=>{
            console.log(err);
            response.message = "Some error occured. Please try again later"
            res.status(500).send(response);
        });
        response.profile = user;
        res.status(200).send(response);
        
    }
    
    
}

