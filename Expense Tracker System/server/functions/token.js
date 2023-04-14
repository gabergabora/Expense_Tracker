
require("dotenv").config();

const jwt = require("jsonwebtoken");

const config = process.env;


const setToekn =  (userName) => { // min and max included 
    const token = jwt.sign(
        { 
            userName: userName 
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
    );
    return token;
}

const verifyToken = (token) => {
    let user = null;
    
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        console.log(decoded);
        user =  decoded.userName;
    } catch (err) {
        
    }
    return user;
}




module.exports = { setToekn, verifyToken };
