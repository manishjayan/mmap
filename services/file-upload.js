const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const awskey = require('../config/aws.json')

aws.config.update({
  secretAccessKey: awskey.secretAccessKey,
  accessKeyId: awskey.accessKeyId,
  region: awskey.region
})


const s3 = new aws.S3();

const getUploadObj = function(bucketname){        
  return multer({
    storage: multerS3({
      s3: s3,
      bucket: bucketname,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: function (req, file, cb) {
        cb(null, {fieldName: "Test"});
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString()+".jpg");
      }
    })
  })
}

module.exports = getUploadObj;
