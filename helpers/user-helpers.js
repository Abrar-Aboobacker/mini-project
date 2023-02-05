var db=require('../config/connection')
var collection=require('../config/collections')
var bcrypt=require('bcrypt')
var objectId =require('mongodb').ObjectId
const { response } = require('express')
const { Admin } = require('mongodb-legacy')

module.exports={
    addUser:async(user,callback)=>{
        user.Password=await bcrypt.hash(user.Password,10)
        db.get().collection(collection.USER_COLLECTION).insertOne(user)
            callback(true)
    },
    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let users= await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let response={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            
            if(user){
                
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        resolve({status:false})
                    }
                })
            }else{
                resolve({status:false})
            }
        })
    },
    deleteUser:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).deleteOne({_id:objectId(userId)}).then((response)=>{
                resolve(true)
            })
        })
    },
    getUserDetails:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(userId)}).then((user)=>{
                resolve(user)
            })
        })
    },
    updateUser:(user,userDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION)
            .updateOne({_id:objectId(user)},{
                $set:{
                    Name:userDetails.Name,
                    Email:userDetails.Email,
                    Age:userDetails.Age,
                    Number:userDetails.Number
                }
            }).then((response)=>{
                resolve()
            })
        })
    },
    adminlogin:(admindata)=>{
        return new Promise(async(resolve,reject)=>{
            let logginStatus=false
            let response={}
            let admin=await db.get().collection(collection.ADMIN_COLLECTION).findOne({Email:admindata.Email})
            if(admin){
                if(admindata.Password === admin.Password){
                    response.admin=admin
                    response.status=true
                    resolve(response)
                }else{
                    resolve({status:false})
                }
            }else{
                resolve({status:false})
            }
        })
    }
    }
    
