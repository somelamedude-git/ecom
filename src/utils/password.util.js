const bcrypt = require('bcrypt');
const { BaseUser } = require('../models/user.models');

 const hashPasswords = async (password)=>{
    const saltRounds = 10;
    try{
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}

const comaprePassword = async (password, email) => {
    const user = BaseUser.findOne(email);
    if(!user)
        return false
    return bcrypt.compare(password, user.password);
}

module.exports = { 
    hashPasswords,
    comaprePassword
 };