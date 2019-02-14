var express = require('express');
var router = express.Router();

// @route   GET api/profiles/test
// @info    Test if profiles route works
// @access  Public
router.get('/test', (req, res) => {
  res.json({msg: "profiles successful!"});
});

module.exports = router;