const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // Get token from header
  const refreshToken = req.cookies.mern_refresh_token;

  // Check if not token
  if (!refreshToken) {
    return res.status(402).json({ msg: 'No refresh token, refresh authorization denied' });
  }

  // Verify token
  try {
    jwt.verify(refreshToken, config.get('jwtRefreshSecret'), (error, decoded) => {
      if (error) {
        return res.status(402).json({ msg: 'Refresh token is not valid' });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    console.error('something wrong with refresh auth middleware');
    res.status(500).json({ msg: 'Server Error' });
  }
};
