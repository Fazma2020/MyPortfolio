//User Authentication Role Based Access

const router = require('express').Router();
const User =require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const verification = require('../middleware/Verification');
const RegistrationKey= 'IAMADMIN89';
const {v4 : uuidv4} = require("uuid");


router.post('/ValidEmail', (req, res) => {
   
    User.findOne({ email: req.body.email }).exec()
      .then((user) => {
        if (!user) {
          return res.json({ success: false, message: "Invalid Email" });
        } else {
            return res.json({ success: true, message: "Valid Email" });
        }
      })
      .catch(err => {
        res.json({ success: false, message: "Authentication Failed" });
      });
  });


//For post requests from client to server, serve sends back res
router.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.json({ success: false, message: "Hashing Failed" });
        } else {
            const uniqueID= uuidv4();
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash,
                role: req.body.role,
                uniqueID: uniqueID,
                //arsh just love azma thora thora, but azma love arsh zyada zyada

            });

            user.save()
                .then(() => {
                    res.json({ success: true, message: "Account Created" });
                })
                .catch((err) => {
                    if (err.code === 11000) {
                        return res.json({ success: false, message: "Email Already Exists!" });
                    }
                    res.json({ success: false, message: "Account Creation Failed" });
                });
        }
    });
});

router.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }).exec()
      .then((user) => {
        if (!user) {
          return res.json({ success: false, message: "Invalid Email" });
        } else {
          bcrypt.compare(req.body.password, user.password, (err, success) => {
            if (success) {
               
              const payload = {
                userId: user._id,
                role: user.role,
              };
             
              const token = jwt.sign(payload, 'PortfolioAzmaSecure');
              
              return res.json({ success: true, token: token, message: "Successfully logged in" });
            } else {
              return res.json({ success: false, message: "Invalid Password" });
            }
          });
        }
      })
      .catch(err => {
        res.json({ success: false, message: "Authentication Failed" });
      });
  });

  
  router.get('/profile', verification, (req, res) => {
    console.log(req);
    const userId = req.user.userId;
    User.findById(userId).exec()
        .then((response) => {
            res.json({ success: true, data: response });
        })
        .catch(err => {
            res.json({ success: false, message: "Can't find user" });
        });
});
router.get('/getUserById', (req, res) => {
    const userId = req.userId;
    User.findById(userId).exec()
        .then((response) => {
            res.json({ success: true, data: response });
        })
        .catch(err => {
            res.json({ success: false, message: "Can't find user" });
        });
});


router.get('/User/:uniqueID', async (req, res) => {
    
   const {uniqueID}=req.params
  
    try {
        let user =await User.findOne({uniqueID });
      
  
      if (!user) {
        return res.json({ error: 'No user found' });
      }
      else{
        
        return res.json(user);
      }
  
      
    } catch (error) {
      res.status.json({success:false, message:"Error Getting user" });
    }
  });


router.post('/UpdateProfile', (req, res) => {

    const { name, email, password, role, uniqueID } = req.body;
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.json({ success: false, message: "Hashing Failed" });}
        else{
            
    
    User.findOneAndUpdate({uniqueID : uniqueID }, { name: name, email: email, role: role, password:hash }, { new: true })
        .then(successUpdate => {
            if (!successUpdate) {
                return res.json({ success: false, message: "User not found" });
            }
            return res.json({ success: true, message: "User Details updated successfully", data: successUpdate });
        })
        .catch(err => {
            console.error(err);
            return res.json({ success: false, message: "Error updating user details" });
        });
    }
});
});

router.post('/ResetPassword', (req, res) => {

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.json({ success: false, message: "Hashing Failed" });}
        else{
            
    console.log(hash);
    User.findOneAndUpdate({email : req.body.email }, { password:hash }, { new: true })
        .then(successUpdate => {
            if (!successUpdate) {
                return res.json({ success: false, message: "User not found" });
            }
            return res.json({ success: true, message: "Password Reset Successful", data: successUpdate });
        })
        .catch(err => {
            console.error(err);
            return res.json({ success: false, message: "Error updating user details" });
        });
    }
});
});

router.post('/signupAdmin', (req, res) => {

    if(req.body.adminkey== RegistrationKey){
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return res.json({ success: false, message: "Hashing Failed" });
            } else {
                const uniqueID= uuidv4();
                const user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                    role: 'admin',
                    uniqueID: uniqueID,

                });
    
                user.save()
                    .then(() => {
                        res.json({ success: true, message: "Admin Account Created" });
                    })
                    .catch((err) => {
                        if (err.code === 11000) {
                            return res.json({ success: false, message: "Email Already Exists!" });
                        }
                        res.json({ success: false, message: "Admin Account Creation Failed" });
                    });
            }
        });
    }
    else{
        //console.log("wrong key");
        return res.json({ success: false, message: "Invalid Admin Key, Please contact your administrator for correct Key" });
    }
   
});

router.get('/AllUsers', async (req, res) => {
   
        try {
          const users = await User.find();
          res.json(users);
        } catch (error) {
          res.json({ error: 'Cannot get all users' });
        }
      });
      

   

      router.post('/RemoveUser', (req, res) => {
             
        const { uniqueID } = req.body;
        console.log(req.body.uniqueID);
        User.findOneAndDelete({ uniqueID: uniqueID })
        .then(deletedUser => {
            if (!deletedUser) {
                return res.status(404).json({ success: false, message: "User not found", uniqueID });
            }
            return res.json({ success: true, message: "User Deleted Successfully", deletedUser });
        })
        .catch(error => {
            return res.status(500).json({ success: false, message: "Error Deleting User", error: error });
        });
        
   
    });
    



module.exports = router;