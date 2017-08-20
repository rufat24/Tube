var express = require('express');
var path= require('path');
var mysql=require('mysql');
var bodyParser= require('body-parser');
var app=express();
var ffmpeg = require('fluent-ffmpeg');
var fs = require('fs');

var views={};
var connection=mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'popcorn'
});
connection.connect(function(error){
	if(!!error){
		console.log("Error"+ error);
	}
	else{
		console.log("Connected");
	}
});

app.use(express.static(__dirname));


app.listen(8080, function () {
  console.log('App listening on port 8080!');

});

ffmpeg.setFfmpegPath(path.join(__dirname, '/ffmpeg/bin/ffmpeg.exe'));
ffmpeg.setFfprobePath(path.join(__dirname, '/ffmpeg/bin/ffprobe.exe'));

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname + '/index.html'));
});
app.use(bodyParser.json());
app.post("/view", function(req,res){
	views[parseInt(req.body.ind)]++;
	console.log(parseInt(req.body.ind));
})

app.post('/watchVideo',function(req,res){

});


app.get('/getVideos',function(req,res){
	data=connection.query("select * from videos",function(err,result){
  res.send(JSON.stringify(result));
 });
});
//get the thumbnails for all videos in this directory
app.get('/smokeweed',function(req,res){
  var ab="";
  fs.readdir('./videos', (err, files) => {
    files.forEach(file => {
    ab=file.toString();
    ac=ab.substring(0,ab.indexOf('.'));
    console.log(file);
    insertVideo(ab,ac);
    getSnap(ac);
  });
  });

});
app.get('/smokeweed1',function(req,res){
  var ab="";
  fs.readdir('./videos', (err, files) => {
    files.forEach(file => {
    ab=file.toString();
    ac=ab.substring(0,ab.indexOf('.'));
    getSnap(ac);
  });
  });

});
function insertVideo(a,ac){
  fs.stat('./videos/'+a, (err, stats) => {
    a=stats.atime.toISOString().substring(0,10);
    console.log("insert into videos (name,date) values ('"+ac+"',"+a+"')");
    connection.query("insert into videos (name,date) values ('"+ac+"','"+a+"')");
  });
}
//function to generate the thumbnails from the video
function getSnap(a){
  new ffmpeg(path.join(__dirname, '/videos/'+a+'.mp4')).takeScreenshots({
      count: 5,
      filename: a+'.png',
      size: '200x125'
    }, path.join(__dirname,'/thumbnails/'+a), function(err) {
    console.log('screenshots were saved')
  });
}
