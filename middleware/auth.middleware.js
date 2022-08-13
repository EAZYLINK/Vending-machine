const { verify, JsonWebTokenError} = require("jsonwebtoken");
const { CustomAPIError } = require("./custom-api-errors");

const userRequired = async(req, res, next)=>{
  try {
    const {authorization} = req.headers;
    if(!authorization){
      return next(CustomAPIError.unauthenticated())
    }

    const token = authorization.split(" ")[1];
    const payload = verify(token, process.env.JWT_SECRET_TOKEN);
    req.userId = payload.indexOf;
    req.userRole = payload.role;
    next()
  } catch (error) {
    let err = error;
    if(error instanceof JsonWebTokenError){
      err = CustomAPIError.badRequest("Invalid or expired Token supplied");
    }

    next(err)
  }
};

const buyerRequired = async(req, res, next)=>{

  try {
    const isBuyer = req.userRole === "buyer";
    if(!isBuyer){
      return next(CustomAPIError.unauthorized("Only buyer is allowed to access this endpoint"));
    }

    next()
  } catch (error) {
    next(error)
  }
};

const sellerRequired = async(req, res, next)=>{

  try {
    const isSeller = req.userRole ==="seller";
    if(!isSeller){
      return next(CustomAPIError.unauthorized());
    }

    next();
  } catch (error) {
    next(error)
  }
    
}

  
  module.exports = {
    userRequired,
    buyerRequired,
    sellerRequired
  }