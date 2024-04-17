const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const authenticateAdmin = async (req, res, next) => {
    //Extract the authorization header from the request
    const authHeader = req.headers['authorization'];

    if(!authHeader){
        return res.status(401).json({error: 'Authorization header missing'});
    }

    //Extract the token from the authorization header
    const token = authHeader.split('')[1];

    try {
        //Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        //Find the admin by ID stored in the token
        const admin = await Admin.findById(decodedToken.id);

        if(!admin){
            return res.status(401).json({error: 'Admin not found'})
        }

        //Attach the admin to the request object
        req.admin = admin;

        //Call the next middleware
        next()
    } catch (error) {
        return res.status(500).json({error: 'Ooops!! an error occured, please try agin'})
    }
};
module.exports = authenticateAdmin;