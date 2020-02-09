const express = require('express');
const router = express.Router();
const aws = require('aws-sdk')
const awskey = require('../config/aws.json')

aws.config.update({
  secretAccessKey: awskey.secretAccessKey,
  accessKeyId: awskey.accessKeyId,
  region: awskey.region
})
const s3 = new aws.S3();
 

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated,(req, res) => {
  const params = {
    Bucket: req.user.bucketname,
   };
   const end = null;
   const keys=[];
   s3.listObjects(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else{ 
        for (var i = 0; i < data.Contents.length; i++) {
          const key = data.Contents[i].Key;
          if (key.substring(0, 19) != end) {
            keys=key;
         } else {
            break;   // break the loop if end arrived
         }    //See above code for the structure of data.Contents
        }
        req.keys=keys;
        console.log(req.keys);
      }
   });
   res.render('dashboard', {
    key: req.keys,
    User: req.user
  })
});

module.exports = router;
