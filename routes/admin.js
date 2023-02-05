const { response } = require('express');
var express = require('express');
const { Admin } = require('mongodb-legacy');
const userHelpers = require('../helpers/user-helpers');
var router = express.Router();
var userHelper=require('../helpers/user-helpers')
const verifyLogin=(req,res,next)=>{
  if(req.session.adloggedIn){
    next()
  }else{
    res.redirect('/admin/adlogin')
  }
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.session.admin){
    let adminn=req.session.admin
  userHelpers.getAllUsers().then((users)=>{
    
    res.render('admin/view-user',{users,admin:true,adminn})
  })
  }else{
    res.redirect('/admin/adlogin')
  }
  
  
});

router.get('/adlogin',(req,res)=>{
  if(req.session.admin){
    
    res.redirect('/admin')
  }else{
    res.render('admin/login',{adloginErr:req.session.adminLoginErr})
    req.session.adminLoginErr=false
  }
})

router.post('/adlogin',(req,res)=>{
  userHelpers.adminlogin(req.body).then((response)=>{
    if(response.status){
      req.session.admin=response.admin
      req.session.adloggedIn=true
      res.redirect('/admin')
    }else{
      req.session.adminLoginErr="Invalid Email or Password"
      res.redirect('/admin/adlogin')
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.admin=null
  req.session.adloggedIn=false
  res.redirect('/admin/adlogin')
})
router.get('/add-user',verifyLogin,function(req,res){
  let adminn=req.session.admin
  res.render('admin/add-user',{admin:true,adminn})
})
router.post('/add-user',(req,res)=>{
  userHelper.addUser(req.body,(result)=>{
    res.redirect("/admin/")
  })
  
})
router.get('/delete-user/:id',verifyLogin,(req,res)=>{
  let userId=req.params.id
  userHelpers.deleteUser(userId).then((response)=>{
    req.session.user=null
   req.session.loggedIn=false
    res.redirect('/admin')
  }) 
})
router.get('/edit-user/:id',verifyLogin,async (req,res)=>{
  let user=await userHelpers.getUserDetails(req.params.id)
  let adminn=req.session.admin
  res.render('admin/edit-user',{user,admin:true,adminn})
})
router.post('/edit-user/:id',(req,res)=>{
  userHelpers.updateUser(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
  })
})

module.exports = router;
