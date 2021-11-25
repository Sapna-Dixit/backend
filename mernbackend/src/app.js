const express = require("express");
const path = require("path");
const app   = express();
require("./db/ conn");
const Register = require("./models/registers");
const {json}   = require("express");

const hbs = require("hbs");
const port  = process.env.PORT || 3000;

const static_path = path.join(__dirname,"../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path  = path.join(__dirname, "../templates/partials")
//console.log(path.join(__dirname,"../public"))

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",template_path);

hbs.registerPartials(partials_path);

// view engine setup
app.set('views', template_path);
app.set('view engine', 'hbs');

app.get("/", (req, res)=>{
    //res.send("Hello!! User")
    res.render("index");
});

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

            if(pass===cpass)
            {
                const registerStudent = new Register({
                    firstname : req.body.firstname,
                    lastname  : req.body.lastname,
                        email  : req.body.email,
                        gender : req.body.gender,
                        phone   : req.body.phone,
                          age :  req.body.age,
                          password :pass,
                          confirmpassword : cpass

                 })
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
app.post("/login", async(req, res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
   
       const useremail = await Register.findOne({email:email});
    //    res.send(useremail.password);
    //    console.log(useremail);
   
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


app.listen(port, ()=>{
    console.log(`server is running at port no ${port}`);
})