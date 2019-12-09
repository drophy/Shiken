const jwt = require('jsonwebtoken');
const jwtKey = 'ShikenSuperSecretCode';

function authenticate(req, res, next) {
    let token = req.get('x-auth');
    if (token == undefined) {
        console.log("The token is missing");
        return;
    }

    jwt.verify(token, `${jwtKey}`, (err, decoded) => {
        if (err) { 
            if (err.name == "TokenExpiredError") { 
                console.log("The token has expired"); 
            } else { 
                console.log(err);
            } 
        } else {
            req.query.id = decoded.id;
            req.query.email = decoded.email;
            next(); // executes the next function
        }
    });
};

module.exports = authenticate;
