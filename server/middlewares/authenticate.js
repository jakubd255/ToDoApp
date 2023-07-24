const jwt = require("jsonwebtoken");



const authenticate = (req, res, next) => {
    if(!req.headers["authorization"])
        return res.status(401);

    const token = req.headers["authorization"]?.split(" ")[1];
    if(!token)
        return res.status(401);
    
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, data) => {
        if(err)
            return res.status(401);
        
        req.body.user = data.payload;
        next();
    });
}

module.exports = authenticate;