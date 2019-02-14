var express = require('express');
var router = express.Router();

// @route   GET api/posts/test
// @info    Test if posts route works
// @access  Public
router.get('/test', (req, res) => {
  res.json({msg: "posts successful!"});
});

module.exports = router;