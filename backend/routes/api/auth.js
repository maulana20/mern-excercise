const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const refreshAuth = require('../../middleware/refreshAuth');
const checkObjectId = require('../../middleware/checkObjectId');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/',
  auth,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/',
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      
      const payload = {
        user: {
          id: user.id
        }
      };
      const token = jwt.sign(payload, config.get('jwtSecret'), { expiresIn: '1m' });
      const refreshToken = jwt.sign(payload, config.get('jwtRefreshSecret'), { expiresIn: '5m' });
      
      res.cookie("mern_token", token);
      res.cookie("mern_refresh_token", refreshToken);
      res.status(200).json({ msg: 'Logged in successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.get('/logout',
  auth,
  async (req, res) => {
    res.clearCookie("mern_token");
    res.clearCookie("mern_refresh_token");
    res.status(200).json({ msg: "Successfully logged out" });
  }
);

router.get("/refresh/:id",
  refreshAuth,
  checkObjectId('id'),
  async (req, res) => {
    try {
      const payload = {
        user: {
          id: req.params.id
        }
      };
      const token = jwt.sign(payload, config.get('jwtSecret'), { expiresIn: '1m' });
      const refreshToken = jwt.sign(payload, config.get('jwtRefreshSecret'), { expiresIn: '5m' });
      
      res.cookie("mern_token", token);
      res.cookie("mern_refresh_token", refreshToken);
      res.status(200).json({ msg: 'Refresh in successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
