require('dotenv').config();
const express = require('express');
const connectDB = require('./database/connect');
const { notFound, errorHandler } = require('./middleware/error');
const authRouter = require('./routes/auth.route');
const productRouter = require('./routes/products.route');
const userRouter = require('./routes/users.route');
const {userRequired} = require('./middleware/auth.middleware')

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/users", userRequired, userRouter)
app.all("*", notFound);
app.use(errorHandler);



const PORT = 8000;
const start = async()=>{
    try {
    await   connectDB(process.env.MONGO_URI)
        app.listen(PORT, ()=>{
            console.log(`Server running on http://localhost:${PORT}`);
        })
    } catch (error) {
        console.log(error.message);
    }
}

start();