require('dotenv').config();
const express = require("express");
const path = require("path");
const app   = express();
require("./db/ conn");
const Register = require("./models/registers");
const {json}   = require("express");
const auth     = require("./middleware/auth") 

const hbs = require("hbs");
const port  = process.env.PORT || 8000;
const cookieParser = require("cookie-parser");

const static_path = path.join(__dirname,"../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path  = path.join(__dirname, "../templates/partials")

// console.log(path.join(__dirname, "../templates/views"));
//console.log(path.join(__dirname,"../public"))

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));

app.set("view engine","hbs");
app.set("views",template_path);

hbs.registerPartials(partials_path);

// view engine setup
app.set('views', template_path);
app.set('view engine', 'hbs');

console.log(process.env.SECRET_KEY)



app.get("/", (req, res)=>{
    //res.send("Hello!! User")
    res.render("index");
});

app.get("/secret", auth, (req, res)=>{
   
        // console.log(`this is the cookie : ${req.cookies.jwt}`);
       
         res.render("secret");
});

app.get("/logout", auth, async(req, res)=>{
    try{
            console.log(req.user);

           req.user.tokens = req.user.tokens.filter((currElement)=>{
               return currElement.token != req.token;
           })

            res.clearCookie("jwt");

            console.log("logout successfully...!!!");
            req.user.save();
             res.render("login")

    }
    catch(err)
    {
        res.status(500).send(err);
    }

})

app.get("/register", (req, res)=>{
    res.render("register")
});

app.get("/login",(req, res)=>{
    res.render("login");
});

//create a new user  in our database
app.post("/register", async(req, res)=>{
        try{
            // console.log(req.body.firstname);
            // res.send(req.body.firstname);

            const pass = req.body.password;
            const cpass = req.body.confirmpassword;

            if(pass === cpass)
            {
                const registerStudent = new Register({
                    firstname  : req.body.firstname,
                    lastname   : req.body.lastname,
                        email  : req.body.email,
                        gender : req.body.gender,
                        phone  : req.body.phone,
                          age  : req.body.age,
                      password : pass,
               confirmpassword : cpass

                 });

                 console.log("The success part------> "+registerStudent);
                 const token = await registerStudent.generateAuthToken();
                 console.log("the token part ------>",token);

                 res.cookie("jwt", token, {
                     expires : new Date(Date.now()+30000),
                     httpOnly : true,
                 });

                 console.log(`this is the cookie : ${req.cookies.jwt}`)
              //   console.log("Cookie =====>  "+cookie);
                 const registered = await  registerStudent.save();
                 res.status(201).render("index");
            }
            else{
                res.send("password are not matching.")
            }
        }catch(error){
            res.status(400).send(error);
        }
});


//login api
app.post("/login", async(req, res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
   
       const useremail = await Register.findOne({email:email});
    //    res.send(useremail.password);
    //    console.log(useremail);
   
    const token = await useremail.generateAuthToken();
    console.log("the token part ------>",token);

    res.cookie("jwt", token, {
        expires : new Date(Date.now() + 4000),
        httpOnly : true,
        //secure : true
    });

   

       if(useremail.pass === password)
       {
           res.status(201).render("index");
       }else{
           res.status(400).send("incorrect email or password");
       }
      
      
   
    }catch(error)
    {
        res.status(400).send("Invalid login details");
    }
});

// const bcrypt  = require("bcryptjs");
// const securePassword = async(password)=>{
//     const passwordHash = await bcrypt.hash(password, 10);
//     console.log(passwordHash);

//     //const passwordMatch = await bcrypt.compare(password, passwordHash);
   
//     const  passwordMatch = await bcrypt.compare("mongo@123", passwordHash);
   
//     console.log(passwordMatch)
// }

// securePassword("mongo@123");

// const jwt = require("jsonwebtoken");

// const createToken  = async()=>{
//   const token = await  jwt.sign({_id :"619f4ceac8aeef21e0b15b2c"},"studentregistrationwebtoken",
//   {
//       expiresIn : "2 second"
//   });
//     console.log(token);

//     const userVer = await jwt.verify(token, "studentregistrationwebtoken");
//     console.log(userVer);

// };
// createToken();
app.listen(port, ()=>{
    console.log(`server is running at port no ${port}`);
})