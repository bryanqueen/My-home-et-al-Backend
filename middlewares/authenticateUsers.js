const User = require('../models/User');
const jwt = require('jsonwebtoken');

const authenticateUser = async (req, res, next) => {
    //Extract Authorization Headers from request object
    const authHeader = req.headers['authorization'];
    
    if(!authHeader){
        return res.status(401).json({error: 'Authorization Header is Missing'});
    }

    //Extract token from Authorization headers
    const token = authHeader.split(' ')[1];

    try {
        //Verify token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        //Find the user by ID stored in the token
        const user = await User.findById(decodedToken.id);

        if(!user){
            return res.status(401).json({error: 'User not found'})
        };

        //Attach the user to the request object
        req.user = user
        console.log(user)

        next()
    } catch (error) {
        console.error(error)
        return res.status(500).json({error: error.message})
    }
};
module.exports = authenticateUser;