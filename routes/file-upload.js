const express = require('express');
const router = express.Router();

const upload = require('../services/file-upload');

const singleUpload = upload.single('image');
//upload requests
router.get('/upload', (req, res) => res.render('upload'));

router.post('/upload', function(req, res) {

  singleUpload(req, res, function(err) {

    if (err) {
      return res.status(422).send({errors: [{title: 'File Upload Error', detail: err.message}] });
    }

    return res.json({'imageUrl': req.file.location});
  });
});

module.exports = router;