const jwt = require('jsonwebtoken');

const secretkey = "PortfolioAzmaSecure"; 

module.exports =(req,res,next)=>{
    try{
     const token = req.headers.authorization.split(' ')[1];
     
     const decode = jwt.verify(token, "PortfolioAzmaSecure");
     req.user = decode;
     req.role= decode.role;
     
     
     next();}
     catch(err){
        res.json({success:false, message: "Authorization not Successful"})
     }

}
