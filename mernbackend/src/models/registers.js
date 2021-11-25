const mongoose = require("mongoose");
const  bcrypt  = require("bcryptjs");

const studentSchema =  new mongoose.Schema({
    firstname :{
        type: String,
        required : true
    },
    lastname :{
        type :String,
        required :true
    },
    email :{
        type : String,
        required :true,
        unique: true
    },
    phone :{
        type :Number,
        required :true,
        unique :true
    },
    gender :{
        type :String,
        required :true
    },
    age :{
        type :Number,
    required : true
    },
    password :{
        type :String,
        required : true
    },
    confirmpassword :{
        type :String,
        required : true
    }
});

//hashing password
studentSchema.pre("save", async function(next){
    
    if(this.isModified("password"))
    {
       
        console.log(`the current password ${this.password}`);
        this.password = await bcrypt.hash(this.password,10);
        console.log(`the current password ${this.password}`);
    }

    next();
})


//now we need to create a collection
const Register  = new mongoose.model("Register", studentSchema);

module.exports = Register;
