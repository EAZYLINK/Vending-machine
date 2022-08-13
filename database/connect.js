const {connect} = require('mongoose');


const connectDB = async(url)=>{
    await connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          })
    console.log('Connected to Database');
    }
    
    module.exports = connectDB;