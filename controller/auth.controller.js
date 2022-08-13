const {sign, cookie} = require('jsonwebtoken');
const {hashSync, compareSync} = require("bcryptjs");
const UserModel = require("../model/users.model")
const {buildResponse, buildUser} = require("../utils/index");
const { CustomAPIError } = require('../middleware/custom-api-errors');


const register = async(req, res, next)=>{
try {
    const {username, password, role= "buyer",  deposit=0} = req.body;
  
  if(!username || !password){
    return next(CustomAPIError.customError("Username and/or password is missing. Please try again", 400))
  };

  const oldUser = await UserModel.findOne({username});
  if(oldUser){

    return next(CustomAPIError.customError("User with the supplied username already exist...", 409))
  }
    const hashPassword = hashSync(password, 12);
  const newUser = await UserModel.create({
    username,
    role,
    password:hashPassword
  });

  const data = buildUser(newUser.toObject());
    res.json(buildResponse('Account created successfully', data, "account"))
} catch (error) {
  next(error)  
}
}

const login = async(req, res, next)=>{
  try {
    const {username, password} = req.body;
    const user = await UserModel.findOne({username});
    if(!user){
      return next(CustomAPIError.notFound("Sorry, No Account with that username"));
    }

    if(!password){
      return next(CustomAPIError.customError("Sorry, you entered an invalid password"));
    }
    const validPassword = compareSync(password, user.password);
    if(!validPassword){
      const err = new Error("Sorry, Invalide password for this user")
      err.status = 400
      next(err)
      return;
    }

    const key = process.env.JWT_SECRET_TOKEN;
    const payload= {id:user._id, role:user.role};
    const token = await sign(payload, key, {expiresIn: "1hr"});
    const refreshToken = await sign(payload, key, {expiresIn: "7d"})
   user.refreshToken = refreshToken;
   await user.save();

   const queryObject = {username:user.username, token, role:user.role};
    res.json(buildResponse("Account logged in successfully", queryObject, "user", {token}))
  } catch (error) {
    next(error)
  }
}

const logout = async(req, res, next)=>{
  try {
    if (req.session) {
      // delete session object
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }

    res.json(buildResponse("Logout successful"))
  } catch (error) {
    next(error);
  }
}



module.exports ={
    register,
    login,
    logout
}