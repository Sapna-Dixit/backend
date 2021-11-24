const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/studentRegistration",{
    useNewUrlParser :true,
    useUnifiedTopology :true,

}).then(()=>{
    console.log("Connection established successfully ...!!!");
}).catch((e)=>{
    console.log("no connection");
})