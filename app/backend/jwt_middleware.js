const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const headerToken = authHeader && authHeader.split(' ')[1];
  const cookieToken = req.cookies?.jwt;
  const token = cookieToken || headerToken;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err){
         res.sendStatus(403)
         
    } 
    req.user = user; // attach decoded payload
    next(); // allows to continue
  });
}

module.exports = authenticateToken;