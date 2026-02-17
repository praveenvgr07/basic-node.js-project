const r=require("express");
const a=r();
const hbs=require("hbs");
const mysql=require("mysql2");
const Path=require("path");
const env = require("dotenv");
const port=process.env.port||3306
 env.config({
    path: Path.join(__dirname,".env")
  });    

const location=Path.join(__dirname,"./public");

a.listen(port,(req,res)=>{
    console.log("port connected");
});


a.set("view engine","hbs");


a.use(r.static(location));
a.set("views",Path.join(__dirname,"./public/views"));

a.get("/",(req,res)=>{
    res.render("home");
});


a.get("/login",(req,res)=>{
    res.render("login");
});


a.get("/login/register",(req,res)=>{
    res.render("register");
});
a.get("/home",(req,res)=>{
    res.render("home");
});
 
 
const db =mysql.createConnection({
    port:process.env.port,
    host:process.env.host,
    user:process.env.user,
    password:process.env.password,
    database:process.env.database,
});


db.connect((err,res)=>{
    if(err) throw err;
    else console.log("database connected");
});


a.use(r.urlencoded({extended:true}));
a.use(r.json());

a.post("/form", (req, res) => {

    console.log(req.body);

    const { username, password } = req.body;

    const sql = "SELECT * FROM node_js WHERE username = ? AND password = ?";

    db.query(sql, [username, password], (err, result) => {   // ✅ result here

        if (err) {
            console.log(err);
            return res.send("Database error");
        }

        if (result.length === 0) {
            return res.send("Invalid username or password");
        }

        // ✅ Success
        return res.redirect("home");
    });

});


a.post("/register", (req, res) => {
    console.log("Register route hit");
    console.log(req.body);

    const { username, phone_number, email, password } = req.body;

    const sql = `
        INSERT INTO node_js (username, phone_number, email, password)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [username, phone_number, email, password], (err, result) => {

        if (err) {
            console.log("Database error:", err);

            if (err.code === "ER_DUP_ENTRY") {
                return res.send("Username already exists");
            }

            return res.send("Database error");
        }

        // ✅ Redirect after successful registration
        return res.redirect("/login");
    });
});





