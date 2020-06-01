
const express = require('express');
const router = express.Router();

const spawn = require("child_process").spawn;

router.post('/',(req, res) => {
  const filelink = req.body.image;
  var filelist=filelink.split(".com/")
  const filename=filelist.slice(-1)[0];
  bucketname=req.user.bucketname;
  const pythonProcess = spawn('python',["../comp/app.py",bucketname,filename]);
  pythonProcess.stdout.on('data', function(data) {
    console.log(data.toString());
    res.redirect('/');
});
});


module.exports = router;