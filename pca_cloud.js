const express = require ('express');
const path = require('path')
const app = express()
const Multer = require('multer');

 const bodyparser = require ('body-parser');
const { MongoClient } = require('mongodb');
const JWT = require('jsonwebtoken');
const bcryptjs = require('bcryptjs')

const mongoose = require('mongoose');
const mongodb = require('mongodb').client;

app.use(express.static(path.join(__dirname,'public')));

// const fileupload = require('express-fileupload')


 const upload = Multer({ dest:'./images/'})
const User = require('./model/userschema.js');
const  imageurl = require('./model/fileurl.js');
 const USER_TOKEN ="pca_cloud_123456789_auth_token_for_user";
 app.use(express.static('uploads'));

// mongodb+srv://airvic:airvic@brivima.8jjkv.mongodb.net/articles?retryWrites=true&w=majority


var diskstorage = Multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,'images')
  },
  filename: function (req, file, cb) {
    // cb(null, Date.now() + path.extname(file.originalname))
    console.log(file)
    const mimetype = file.mimetype.split('/');
    const filetype = mimetype[1];
    const filename = file.originalname + '.' +filetype;
    cb(nul,filename)
  }
})

 const storage = Multer({storage : diskstorage})


  app.use(bodyparser.json())
  
  app.use(bodyparser.urlencoded({extended : true}))

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
    if(req.method == 'OPTIONS'){
      res.header('Access-Control-Allow-Methods','PUT,POST,GET,PATCH,DELETE');
      return res.status(200).json({})
    }
    next();
  });

  
  // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
  mongoose.connect('mongodb+srv://airvic:airvic_pca_cloud@pca.zfyqb.mongodb.net/users?retryWrites=true&w=majority',{ 
    useNewUrlParser: true,   
    useUnifiedTopology: true}).then(()=>{  
    console.log('mongodb successfully connected')
  }).catch((error)=>{
    console.log('mongodb error : '+ error)
    
    
  })
  // app.get('/',(req,res)=>{
  //   res.sendFile(path.join(__dirname,'public/index.html/dasboard'))
      
  // })
  app.get('/endpoint',(req,res)=>{
    res.send("successful")
      
  })
  
  app.get("/test",(req,res)=>{
    res.json({valid:true})
  })

  // app.get('*',(req,res)=>{
  //   res.sendFile(path.join(__dirname+'/public/index.html'));
  // })

  // app.get('*', function (req, res) {
  //   res.sendFile(path.join(path.join(__dirname, 'public/index.html')));
  // });

app.post('/image',async(req,res)=>{
  const image = await imageurl.find()
 res.json(image)

})
app.post('/activities',async (req,res)=>{
  console.log("route htiited")
  const user  =  await User.find()
  res.json(user)

})

app.post('/signup',async (req,res)=>{
  console.log(req.body)
  const olduser = await User.findOne({username:req.body.username,gmail:req.body.gmail});
  if(!olduser){
   const user = await User.create({
     name:req.body.name,
     email:req.body.gmail,
     password:req.body.password,
     username:req.body.username,
     image:req.body.filefrombucket
   })
   return res.json(false)
  }else{
   res.json(true)
 
  }

})

app.post('/deleteaccount',async(req,res)=>{
  const user = await User.deleteOne({username:req.body.username})

  if(user){
res.json({
  success:true
})
  }else{
    res.json({
      success:false
    })
  }
})
app.post('/saveurl',async(req,res)=>{
  console.log(req.body.url)
  url = req.body.url
  const existed =  await imageurl.findOne({url:req.body.url})
  if(existed){
    res.send(true)
    console.log('file already exist')
  }else{
    const Url = await imageurl.create({
      url:req.body.url
     }).then(()=>{
   res.send(true)
     }).catch(()=>{

      res.send(false)
     })
  }




})
app.post('/deletephoto',async(req,res)=>{
  console.log(req.body.image)
  const deleted = await imageurl.deleteOne({url:req.body.image}).then(res =>{
   res.send(true)
  }).catch(err=>{
  res.send(false)

  

  })


})


app.post('/Login',async (req,res)=>{
  const user = await User.findOne({username:req.body.username,password:req.body.password})

 console.log(req.body)

  // hash_password =  await bcryptjs.hash(req.body.password,10)
  // console.log(hash_password)
 
  if(user){


    //create token and send

    const token = JWT.sign({username:user.username},USER_TOKEN,{
      expiresIn:'24h'
    })
    
   const msg = ({
      success:true,
      username:user.username,
      gmail:user.email,
      image:user.image,
     token:token
    })
      res.end(JSON.stringify(msg))
  }else{


     msg = ({
      success:false

     })
     res.end(JSON.stringify(msg))
    // console.log("no user found with username" + req.body.username)
  }
  
})


const port = process.env.PORT || 3000;
app.listen(port ,()=>{
    console.log("server on port: "+ port);    
})

