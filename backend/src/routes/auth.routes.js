const userControllers = require('../controllers/userControllers');
const express = require('express');
require('dotenv').config({ path: '../.env' });
const { fetchUserData } = require('../APIs/fetchProfile')
const { verifyJWT,  looseVerification} = require('../middlewares/auth.middleware');
const { isLoggedIn } = require('../APIs/checkLoginStatus');
const { fetchLength } = require('../APIs/cartAndWishCount'); // Who wants to fetch the whole data when all i require are these babies? #GoldDigger
const { sendForgotMail } = require('../APIs/password.api');
const router = express.Router();

router.get('/auth/google', (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=profile email`;
  res.redirect(url);
});

router.post('/login', userControllers.manualLogin); // For manual login, yahi use krna hai

// router.get('/auth/google/callback', userControllers.googleLogin);
router.get('/verifyLogin', looseVerification, isLoggedIn); // To check if a user is logged in
router.post('/register', userControllers.createUser); // A welcome mattress for our beloved very low in number non existant/ent? (i am kind of dyslexic) users
router.get('/getCWL', looseVerification, fetchLength); //CWL: Cart Wish Length , enjoy my acronyms please
router.get('/profile', verifyJWT, fetchUserData); 
router.patch('/editProfile', verifyJWT, userControllers.updateUser);
router.post('/logout', verifyJWT, userControllers.logoutUser);
router.post('/send-forgot-mail', sendForgotMail);
// router.delete('/delete_account/:id', verifyJWT, userControllers.deleteUser);

// router.patch('/ban_user/:id', verifyJWT, userControllers.banUser);

// router.patch('/unban_user/:id',verifyJWT, userControllers.unbanUser);


module.exports = router;