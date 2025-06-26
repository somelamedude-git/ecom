const userControllers = require('../controllers/userControllers');
const express = require('express');
require('dotenv').config({ path: '../.env' });
const router = express.Router();

router.get('/auth/google', (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=profile email`;
  res.redirect(url);
});

router.post('/login', userControllers.manualLogin);

router.get('/auth/google/callback', userControllers.googleLogin);

router.post('/register', userControllers.createUser);

router.delete('/delete_account/:id', userControllers.deleteUser);

router.get('/verify-email/:id', userControllers.verifyUser);

router.patch('/ban_user/:id', userControllers.banUser)

router.patch('/unban_user/:id', userControllers.unbanUser)

module.exports = {
    router
}