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
  const resou = "arn:aws:s3:::"+req.user.bucketname+"/*";
        var readOnlyAnonUserPolicy = {
          "Id": "Policy1397632521960",
          "Statement": [
            {
              "Sid": "Stmt1397633323327",
              "Action": [
                "s3:GetObject"
              ],
              "Effect": "Allow",
              "Resource": resou,
              "Principal": {
                "AWS": [
                  "*"
                ]
              }
            }
          ]
        }
        
        // create selected bucket resource string for bucket policy
        var bucketResource = "arn:aws:s3:::" + req.user.bucketname + "/*";
        readOnlyAnonUserPolicy.Statement[0].Resource[0] = bucketResource;
        
        // convert policy JSON into string and assign into params
        var bucketPolicyParams = {Bucket: req.user.bucketname, Policy: JSON.stringify(readOnlyAnonUserPolicy)};
        console.log(JSON.stringify(readOnlyAnonUserPolicy));
        // set the new policy on the selected bucket
        s3.putBucketPolicy(bucketPolicyParams, function(err, data) {
          if (err) {
            // display error message
            console.log("Error", err);
          } else {
            console.log("Success", data);
          }
        });

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
        
        res.render('dashboard', {
          key: keys,
          User: req.user
        })
        
      }
   });
 
});

module.exports = router;
