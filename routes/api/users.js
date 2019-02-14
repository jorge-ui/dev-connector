var express = require('express');
var router = express.Router();

// @route   GET api/users/test
// @info    Test if users route works
// @access  Public
router.get('/test', (req, res) => {
  res.json({msg: "users successful!"});
});

module.exports = router;