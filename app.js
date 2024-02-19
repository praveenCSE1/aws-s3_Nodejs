const aws = require('aws-sdk')
const fs = require('fs')
const multer = require('multer')
const path = require('path')
const express = require('express')
const {mongoStorage} = require('./db')
require('dotenv').config()


const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKey = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const app = express();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
  
      //upload file in uploads folder in local memory
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); 
    }
  });

const upload = multer({ storage });

const s3 = new aws.S3({
    region,
    accessKeyId:accessKey,
    secretAccessKey
})

 function uploadFile(file){

    const fileStream = fs.createReadStream(file.path)
    const uploadParams = {
        Bucket: bucketName,
        Body:fileStream,
        Key:file.filename
    }

    return s3.upload(uploadParams).promise()
}


app.post('/upload',upload.single('file'),async (req,res)=>{
   try{
   
   
    const result = await uploadFile(req.file).then(data=>{

      const result = new mongoStorage({

        filename:req.file.filename,
        url:data.Location
      })
 
    const saved = result.save().then(data=>{
      console.log(data)

      res.json({message:'File uploaded Successfully',file:data})
    });
    })
   }
   catch(err){
    console.log(err)
    res.json({Error:err})
   }
})



app.get('/display/:filename', (req, res) => {
  const filename = req.params.filename;
  const params = {
      Bucket: bucketName,
      Key: filename
  };

  s3.getObject(params)
      .createReadStream()
      .on('error', (err) => {
          console.error(err);
          res.status(500).send('Error retrieving file from S3');
      })
      .pipe(res);
});



app.listen(4000,()=>{
    console.log('http://localhost:4000')
})