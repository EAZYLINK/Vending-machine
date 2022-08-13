const { CustomAPIError } = require("../middleware/custom-api-errors")
const productModel = require("../model/products.model")

const getProducts = async(req, res, next)=>{

    try {
       const products = await productModel.find({}).populate("seller") 
   res.status(201).json({msg: "Product fetched successfully", products})
    } catch (error) {
        next(error)
    }
}

const createProduct=async(req, res, next)=>{
 try {
     const {cost = 0, amountAvailable, productName} = req.body
     if(!amountAvailable || !productName){
         return next(CustomAPIError.badRequest("Amount available or Product name missing"))
         const newProduct = await productModel.create({
             cost,
             amountAvailable,
             productName,
             seller: req.userId
         });

res.status(201).json({msg: "product created successfully"})
     }
 } catch (error) {
     next(error)
 }
}

const editProduct = async(req, res, next)=>{

    try {
        const {productId} = req.params;
        const product = req.body;
        const productToUpdate = await productModel.findById(productId)
        if(!productToUpdate){
            return next(CustomAPIError.notFound())
        }

        if(req.userId!== productToUpdate.seller){
            return next(CustomAPIError.unauthorized("You cannot update this product"))
        }
        const updatedProduct = await productModel.findByIdAndUpdate(productId, product)
    } catch (error) {
        next(error)
    }
}

const deleteProduct = ()=>{

}

module.exports = {
    getProducts,
    editProduct,
    deleteProduct,
    createProduct
}