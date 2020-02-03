const express = require('express');
const router = express.Router();


const getUploadObj = require('../services/file-upload');


//upload requests
router.get('/upload', (req, res) => res.render('upload'));

router.post('/upload', function(req, res) {
  const singleUpload = getUploadObj(req.user.bucketname).single('image');

  singleUpload(req, res, function(err) {

    if (err) {
      return res.status(422).send({errors: [{title: 'File Upload Error', detail: err.message}] });
    }
    res.redirect('/dashboard');
  });
});

module.exports = router;