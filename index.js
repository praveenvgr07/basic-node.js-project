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


a.use(r.urlencoded({extended:false}));

 a.post("/form",(req,res)=>{
        console.log(req.body); 
        db.query("select *from node_js where username=? and password=?",[req.body.username,req.body.password],(err,res)=>{
            if(res.length==0){console.log("data not found")};
          console.log(res);
          res.forEach(e => {
                console.log(e.username,"\t",e.password)
          });
        })

 }) ;

 a.post("/register",(req,res)=>{    
    console.log(req.body);
            db.query("insert into node_js values(?,?,?,?)",[req.body.username,req.body.phone_number,req.body.email,req.body.password],(err,res)=>{
           if (err) {
        console.log(err); // print error in console

        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        return res.status(500).json({
            message: "Database error"
        });
    }

    res.json({
        message: "Data inserted successfully"
    });
            });

            });
app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});

