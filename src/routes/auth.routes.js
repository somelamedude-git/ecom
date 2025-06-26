const { googleLogin, manualLogin} = require('../controllers/auth.controller');
const express = require('express');
require('dotenv').config({ path: '../.env' });
const router = express.Router();

router.get('/auth/google', (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=profile email`;
  res.redirect(url);
});

router.get('/auth/google/callback', googleLogin);

router.post('/register', createUser);

router.delete('/delete_account/:id', deleteUser);

router.get('/verify-email/:id', verifyUser);

module.exports = {
    router
}