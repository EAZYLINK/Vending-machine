const UserModel = require("../model/users.model");
const {CustomAPIError} = require("../middleware/custom-api-errors");
const {buildResponse, buildUser} = require("../utils/index")

const update = (req, res, next) =>{


}

const delete_ = async(req, res, next) =>{
   
    
}

const deposit = async(req, res, next) =>{
try {
        const {deposit, _id} = req.body;
        const userId = _id
        if(!userId){
            return next(CustomAPIError.badRequest("Please supply the correct user Id"))
        }
        if(!deposit){
            return next(CustomAPIError.badRequest("Deposit field cannot be empty"))
        
        };

        
    
        const amount = Number(deposit);
    
        if(amount % 5 !==0){
            return next(CustomAPIError.badRequest("The amount must be a multiple of 5"))
        };
    
        const user = await UserModel.findById(userId);
        if(user){
            user.deposit += amount;
        }
    
        user.save();
        res.json(buildResponse("Your account has been credited"))
} catch (error) {
    next(error)
}
}

const resetDeposit = async(req, res, next)=>{
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(req.userId, {default: 0})
        res.json(buildResponse("Your deposit has been reset successfully"))
    } catch (error) {
        next(error)
    }
}

const details = async(req, res, next) =>{

        try {
            const userData = await UserModel.find();
            const data = buildUser(userData);
            res.json(buildResponse("Account fetched successfully", data))
        } catch (error) {
            next(error)
        }
}

module.exports = {
    update,
    delete_,
    deposit,
    resetDeposit,
    details
}