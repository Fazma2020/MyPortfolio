//Server Side

//importing express 
const express = require('express');

//Use express in app
const app = express();

//port number for server
const port= process.env.PORT || 3000;

const authRoute= require('./routes/auth-route.js');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require("nodemailer");

mongoose.connect("mongodb+srv://fnuazma:Portfolio2023%40@portfoliocluster.niuncnc.mongodb.net/MyPortfolioDatabase",{useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((error) => {
    console.log("Error connecting to the database:", error);
  });

  // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());
app.use(cors());
app.use('/auth', authRoute);

app.get('/', (req,res)=> {
    res.send("Hi, GET is Successful");
}

)

app.post('/sendEmail',(req,res)=>{
  let user = req.body;
  SendEmail(user,info=>{
    console.log("Email was successfully Sent");
    res.send(info);
  });
}
);

async function SendEmail(user, callback){
  //did some research
  //Transporter, using google Gmail’s SMTP server is a free service offered by Google
  let transporter =nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
      user:'portfolioazma@gmail.com',
      pass:'hifwlcpywmacjyyz',
    }
  });
  let mailOptions={
    from: '"Team Azma" <portfolioazma@gmail.com>',
    to: user.email,
    subject: "Thank you for visiting Azma's Portfolio",
    html: user.body
  };
  try {
    let info = await transporter.sendMail(mailOptions);
    callback(info);
  } catch (error) {
    console.error("Mail Not sent", error);
    callback(error);
  }
}



app.listen(port, ()=>{
console.log('Hello, I am your server', port)
}
)