const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const aws = require('aws-sdk')
const awskey = require('../config/aws.json')

aws.config.update({
  secretAccessKey: awskey.secretAccessKey,
  accessKeyId: awskey.accessKeyId,
  region: awskey.region
})
const s3 = new aws.S3();

const spawn = require("child_process").spawn;

router.get('/', ensureAuthenticated,(req, res) => { 
  const params = {
    Bucket: req.user.bucketname,
   };
   const end = null;
   let keys=[];
   let temp;
   s3.listObjects(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else{ 
        for (var i = 0; i < data.Contents.length; i++) {
          const key = data.Contents[i].Key;
          if (key.substring(0, 19) != end) {
            temp="https://"+req.user.bucketname+".s3.us-east-2.amazonaws.com/"+key;
            keys.push(temp);
         } else {
            break;   // break the loop if end arrived
         }    //See above code for the structure of data.Contents
        }
        
        res.render('file-compress', {
          key: keys,
          User: req.user
        })
        
      }
   });
});

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