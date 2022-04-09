const { User } = require('../Models/userModel');
const ErrorResponse = require('../utils/errorResponse');
const crypto = require('crypto');


exports.signup = async function(req, res, next){
    const { name, emailId, phoneNo, image, password } = req.body;

    try{

        // Checking for already verified user
        const _user = await User.findOne({emailId, verified : true});

        if(_user){
            return next(new ErrorResponse("Entered email is already in use", 409));
        }

        // checking whehter a non verified user exist or not
        const nonVerifiedUser = await User.findOne({emailId, verified : false});
        let user;

        if(!nonVerifiedUser){   
            user = await User.create({
                name,
                emailId,
                phoneNo,
                image,
                password,
                verified : false,
            });
        }else{
            console.log(nonVerifiedUser);
            user = nonVerifiedUser;
            await nonVerifiedUser.save();
        }
    
        res.status(201).json({message : "User created", user});
    }catch(error){
        console.log(error.message);
        next(error);
    }
}

exports.login = async function(req, res, next){
    const { phoneNo, password } = req.body;
    console.log(password);

    try{
        console.log(phoneNo);
        const user = await User.findOne({phoneNo}).select("+password");
        console.log(user);
        if(!user || !user.verified){
            next(new ErrorResponse("No such user found", 404));
        }
        console.log(password);
        const isMatch = await user.matchPasswords(password);
        if(!isMatch){
            next(new ErrorResponse("Invalid Credentials", 401));
        }
        sendToken(user, 200, res);
    }catch(error){
        console.log(error);
        next(error);
    }
}

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({success : true, token, user});
}