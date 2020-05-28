
const express = require('express');
const router = express.Router();
var sess;
const spawn = require("child_process").spawn;

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
router.get('/', (req, res) => res.render('file-compress'));

router.post('/',(req, res) => {
  const { bucketname, filename } = req.body;
  sess=req.session;
  console.log(sess.email);
  const pythonProcess = spawn('python',["../comp/app.py",bucketname,filename]);
  pythonProcess.stdout.on('data', function(data) {
    console.log(data.toString());
    res.redirect('/');
});
});


module.exports = router;