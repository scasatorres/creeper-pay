const express = require('express');

const router = express.Router();

router.post('/', async (req, res, next) => {
  return res.send(200).json({
    message: 'hi!'
  });
});

module.exports = router;