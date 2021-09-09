const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async(req, res, next) => {
    try{
        // Extracting JWT token from HTTP header, decoding, and finding the user.
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token});

        // In the case the user isn't found.
        if (!user){
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    }
    catch (err){
        // In the case there's no matching JWT token.
        res.status(401).send({error: "Please authenticate"});
    }
}

module.exports = auth;