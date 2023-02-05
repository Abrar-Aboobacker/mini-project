const { response } = require('express');
var express = require('express');
var router = express.Router();
const userHelpers=require('../helpers/user-helpers');


let products=[
  {
    name:"Nike",
    category:"FootBall",
    description:"Play intense matches or train with this Nike Strike Football and enhance your game.",
    image:"https://rukminim1.flixcart.com/image/416/416/ball/d/x/r/300-22-strike-1-sc2729-073-football-nike-original-imaerw45jz7z2eqy.jpeg?q=70"
  },

  {
    name:"PUMA",
    category:"FootBall",
    description:"Playmakers, get ready to Drive Them Crazy with the FUTURE 1.4 – the boot for the most creative player on the pitch.",
    image:"https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/106989/03/sv01/fnd/IND/fmt/png/FUTURE-1.4-FG/AG-Football-Boots-Men"
  },

  {
    name:"Lenovo",
    category:"Laptop",
    description:"ThinkBook 14 35.56cms - 11th Gen Intel i5",
    image:"https://www.lenovo.com/medias/ThinkBook-14-Gen-2-Intel-hero.png?context=bWFzdGVyfHJvb3R8NjYwMDh8aW1hZ2UvcG5nfGg2NC9oZjYvMTMwMzMyMzY0NjM2NDYucG5nfDdlZWU5OGJlYzllYWI0OTM2NDcyMjMwYzA4ZmY3OWRjZDFkNTI4NjgxNWJhOGRmNmZlYTE3OWUzODhmOWQyZjM"
  },

  {
    name:"BoAt",
    category:"Smart Watch",
    description:"boAt Xtend/Xtend RTL Smartwatch with Alexa Built-in, 1.69” HD Display, Stress Monitor,5 ATM & 7 Days Battery(Sandy Cream)",
    image:"https://m.media-amazon.com/images/I/61gscZYmaoL._SY355_.jpg"
  },

  {
    name:"Logitech",
    category:"Mouse",
    description:"Logitech G102 Light Sync Gaming Mouse with Customizable RGB Lighting, 6 Programmable Buttons, Gaming Grade Sensor",
    image:"https://m.media-amazon.com/images/I/61UxfXTUyvL._SX679_.jpg"
  },

  
]
/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.user){
    let user=req.session.user
  userHelpers.getAllUsers().then((users)=>{
    res.render('user/index', { products,user,usser:true});
  })
  }else{
    res.redirect('/login')
  }
  
  
});

router.get('/login',(req,res)=>{
  if(req.session.user){
    res.redirect('/')
  }else{
    res.render('user/login',{"loginErr":req.session.userLoginErr})
    req.session.userLoginErr=false
  }
  
})
router.get('/signup',(req,res)=>{
  if(req.session.user){
    res.redirect('/')
  }else{
    res.render('user/signup')
  }
  
})
router.post('/signup',(req,res)=>{
  userHelpers.addUser(req.body,(result)=>{
    res.redirect('/login')
  })
   
})
router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.user=response.user
      req.session.loggedIn=true
      res.redirect('/')
    }else{
      req.session.userLoginErr="Invalid username or password"
      res.redirect('/login')
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.user=null
  req.session.loggedIn=false
  res.redirect('/login')

})
module.exports = router;
