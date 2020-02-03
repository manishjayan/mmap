const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const mybucket ='bucket-mmap'


aws.config.update({
    secretAccessKey: 'o/A9CMXv8ybgz8i6mkelmmu+0MHd6qf3MmeI0Z63',
    accessKeyId: 'AKIASJKSEDZACSG7TEZF',
    region: 'us-east-2'
})


const s3 = new aws.S3();
 
const getUploadObj = function(bucketname){
  return multer({
    storage: multerS3({
      s3: s3,
      bucket: bucketname,
      metadata: function (req, file, cb) {
        cb(null, {fieldName: "Test"});
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString())
      }
    })
  })
}

module.exports = getUploadObj;