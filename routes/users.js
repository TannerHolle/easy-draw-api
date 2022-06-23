const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User } = require('../db/models/user.model')

const router = express.Router();


/* User API CALLS */

/**
 * POST /api/user/login
 * Purpose: Sign In
 */
 router.post('/login', (req, res) => {
    let body = req.body;
    let fetchedUser;
    User.findOne({email: body.email})
      .then(user => {
        if (!user) {
          return res.status(401).json({
            message: "Auth Failed"
          });
        }
        fetchedUser = user;
        return bcryptjs.compare(body.password, user.password);
      })
      .then(result => {
        if (!result) {
          return res.status(401).json({
            message: "Auth Failed"
          });
        }
        const token = jwt.sign(
          {email: fetchedUser.email, userId: fetchedUser._id},
          'secret_this_should_be_longer', 
          {expiresIn: '1h'}
        );
        res.status(200).json({
          token:token,
          expiresIn: 3600,
          userId: fetchedUser._id,
          userName: fetchedUser.name
        })
      })
      .catch(err => {
        return res.status(401).json({
          message: "Auth Failed"
        });
      })
  });
  
  /**
   * POST /api/user/sign-up
   * Purpose: Create a new user
   */
   router.post('/sign-up', (req, res) => {
    let body = req.body;
  
    bcryptjs.hash(body.password, 10)
    .then(hash => {
        let newUser = new User({
          name: body.name,
          company: body.company,
          email: body.email,
          password: hash,
          securityAnswer: body.answer
        });
        console.log(newUser)
        newUser.save()
          .then(result => {
            res.status(201).json({
              message: 'User Created',
              result: result
            })
          })
          .catch(err => {
            res.status(500).json({
              error: err
            })
          })
      }
    )
  });
  
  /**
   * POST /api/user/reset-password
   * Purpose: Create a new user
   */
   router.post('/reset-password', (req, res) => {
    let body = req.body;
    console.log(JSON.stringify(body.email))
    let hash1 = bcryptjs.hash(body.password, 10)
    console.log("hash1" + JSON.stringify(hash1))
    bcryptjs.hash(body.password, 10)
    .then(hash => {
        console.log(hash)
        console.log(body.email)
        User.findOneAndUpdate({email: body.email}, {$set: {"password": hash}}, {new: true}, (err, doc) => {
          if (err) {
              console.log("Something wrong when updating data!");
          }
      
          console.log(doc);
      });
      }
    ).then(createdInvoice => {
      res.status(201).json({
        message: "Created Invoice Successfully"
      })
});
  });

  /**
 * GET /user/find
 * Purpose: Return the info for one user
 */
  router.post('/find',  (req, res) => {
    User.find({email: req.body.email}).then((user) => {
      console.log(user)
      res.send(user);
    }).catch((e) => {
      res.send(e);
    });
  });

  module.exports = router;
