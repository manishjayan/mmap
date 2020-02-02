const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

aws.config.update({
    secretAccessKey: 'y+rHKynzC9HLTymyAqeVBA8YTCSosMxVOzhvfxab',
    accessKeyId: 'AKIAIL3ERQI6GKJM6DXQ',
    region: 'us-east-2'
})

const s3 = new aws.S3();
 
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'bucket-mmap',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: "Test"});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

module.exports = upload;