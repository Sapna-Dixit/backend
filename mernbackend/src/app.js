const express = require("express");
const path = require("path");
const app   = express();
require("./db/ conn")
const hbs = require("hbs");
const port  = process.env.PORT || 3000;

const static_path = path.join(__dirname,"../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path  = path.join(__dirname, "../templates/partials")
//console.log(path.join(__dirname,"../public"))


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
})
app.listen(port, ()=>{
    console.log(`server is running at port no ${port}`);
})