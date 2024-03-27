const express = require("express");
const router = express.Router();
const { login, find, signup, verifyUserLink, sendResetPasswordLink, verifyResetPasswordLink, resetPassword } = require("../controllers/UserController");

/* User API CALLS */

/**
 * POST /api/user/login
 * Purpose: Sign In
 */
router.post('/login', login);

/**
 * POST /api/user/sign-up
 * Purpose: Create a new user
 */
router.post('/sign-up', signup);

/**
 * POST /api/user/verify-user-link
 * Purpose: Verifies User's Sign up Link
 */
router.post('/verify-user-link', verifyUserLink);

/**
 * POST /api/user/send-reset-password-link
 * Purpose: Sends out generated link for reset password
 */
router.post('/send-reset-password-link', sendResetPasswordLink);

/**
 * POST /api/user/verify-reset-password-link
 * Purpose: Verifies User's Reset Pass Link
 */
router.post('/verify-reset-password-link', verifyResetPasswordLink);

/**
 * POST /api/user/reset-password
 * Purpose: Updates User's Password
 */
router.post('/reset-password', resetPassword);

/**
* GET /user/find
* Purpose: Return the info for one user
*/
router.post('/find', find);

module.exports = router;
