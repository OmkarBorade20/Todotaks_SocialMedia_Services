const decrypt=require('bcryptjs')


module.exports.validatePassword=async function(password,encryptPassword)
{
     return decrypt.compare(password,encryptPassword);
}


module.exports.encryptPassword=async function(password)
{
    return decrypt.hash(password,8) 
}