const mongoose = require('mongoose')

const uri = 'mongodb://localhost:27017/AWS-S3';

mongoose.connect(uri);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB eror:'));
db.once('open', () => {

  console.log('Database Connected');

});


const s3 = new mongoose.Schema({
    filename:String,
    url:String
})

const mongoStorage = mongoose.model('file-storage',s3)

exports.mongoStorage = mongoStorage