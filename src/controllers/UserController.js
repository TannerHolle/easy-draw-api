const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require('../../db/models/user.model');
const EmailService = require("../services/EmailService");


/**
 * POST /api/user/login
 * Purpose: Sign In
 */
module.exports.login = (req, res) => {
  let body = req.body;
  let fetchedUser;
  User.findOne({ email: body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth Failed"
        });
      }
      if (!user.isVerified) {
        return res.status(401).json({
          message: "User not verified"
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
        { email: fetchedUser.email, userId: fetchedUser._id },
        'secret_this_should_be_longer',
        { expiresIn: '12h' }
      );
      res.status(200).json({
        token: token,
        expiresIn: 43200,
        userId: fetchedUser._id,
        userName: fetchedUser.name
      })
    })
    .catch(err => {
      res.status(401).json({
        message: "Auth Failed"
      });
    })
}

/**
 * POST /api/user/sign-up
 * Purpose: Create a new user
 */
module.exports.signup = async (req, res) => {
  let body = req.body;

  let user = await User.findOne({ email: body.email });
  if (user) {
    return res.status(401).json({
      type: 'error',
      message: 'User with this email already exists!'
    })
  }

  bcryptjs.hash(body.password, 10)
    .then(hash => {
      let newUser = new User({
        name: body.name,
        company: body.company,
        email: body.email,
        password: hash,
        isVerified: false
      });
      newUser.save()
        .then(user => {
          const token = jwt.sign(
            { _id: user._id, email: user.email },
            process.env.ENCRYPT_KEY);

          const origin = req.headers.origin;
          const link = `${origin}/sign-up/verify?id=${token}`;

          const emailBody = '<div>Hello ' + user.name + ',</div><br>' +
            '<div> Please click on the link below to verify your email: </div>' +
            link;

          EmailService.sendMail({
            email: user.email,
            subject: "Verify Email",
            message: emailBody
          }, (err) => {
            if (err) {
              res.status(401)({
                message: 'Error sending email.'
              });
            } else {
              res.status(200).json({
                type: 'success',
                message: 'Verification Link sent to your email!',
                result: user
              })
            }
          });
        })
        .catch(err => {
          res.status(500).json({
            message: err
          })
        })
    }
    )
}

/**
 * POST /api/user/verify-user-link
 * Purpose: Verifies User's Sign up Link
 */
module.exports.verifyUserLink = async (req, res) => {
  let body = req.body;
  const decipheredUserObject = jwt.decode(body.id)
  let user = await User.findOne({ _id: decipheredUserObject._id, email: decipheredUserObject.email });

  if (user) {
    await User.updateOne({ _id: user._id }, { isVerified: true })
    res.status(200).send({ type: 'success' })
  } else {
    res.status(200).send({ type: 'error', message: 'User Not Found!' });
  }
}

/**
 * POST /api/user/send-reset-password-link
 * Purpose: Sends out generated link for reset password
 */
module.exports.sendResetPasswordLink = async (req, res) => {
  let body = req.body;
  let user = await User.findOne({ email: body.email });
  if (user) {
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.ENCRYPT_KEY);

    const origin = req.headers.origin;
    const link = `${origin}/reset-password/verify?id=${token}`;

    await User.updateOne({ _id: user._id }, { $set: { resetPasswordLink: { token, isValid: true } } });

    const emailBody = '<div>Hello ' + user.name + ',</div><br>' +
      '<div> Please click on the link below to Reset your password: </div>' +
      link;

    EmailService.sendMail({
      email: user.email,
      subject: "Reset Password",
      message: emailBody
    }, (err) => {
      if (err) {
        res.status(401)({
          message: 'Error sending email.'
        });
      } else {
        res.status(200).send({ message: "We have sent you an email to reset your password!" })
      }
    });
  } else {
    res.status(200).send({ message: 'User Not Found!' });
  }
}

/**
 * POST /api/user/verify-reset-password-link
 * Purpose: Verifies User's Reset Pass Link
 */
module.exports.verifyResetPasswordLink = async (req, res) => {
  let body = req.body;
  const decipheredUserObject = jwt.decode(body.id)
  let user = await User.findOne({ _id: decipheredUserObject._id, email: decipheredUserObject.email });

  if (user) {
    if (user.resetPasswordLink && user.resetPasswordLink.token == body.id && user.resetPasswordLink.isValid) {
      await User.updateOne({ _id: user._id }, { "resetPasswordLink.isValid": false })

      res.status(200).send({ type: 'success', email: user.email })
    } else {
      res.status(200).send({ type: 'error', message: 'Invalid Link' });
    }
  } else {
    res.status(200).send({ type: 'error', message: 'User Not Found!' });
  }
}

/**
 * POST /api/user/reset-password
 * Purpose: Updates User's Password
 */
module.exports.resetPassword = (req, res) => {
  let body = req.body;
  bcryptjs.hash(body.password, 10)
    .then(hash => {
      User.findOneAndUpdate({ email: body.email }, { $set: { "password": hash } }, { new: true }, (err, doc) => {
        if (err) {
          res.status(201).json({
            type: 'error',
            message: "Something wrong when updating data!"
          })
          return;
        }

        res.status(201).json({
          type: 'success',
          message: "Password Updated Successfully"
        })
      });
    }
    )
}

/**
* GET /user/find
* Purpose: Return the info for one user
*/
module.exports.find = (req, res) => {
  User.find({ email: req.body.email }).then((user) => {
    console.log(user)
    res.send(user);
  }).catch((e) => {
    res.send(e);
  });
}
