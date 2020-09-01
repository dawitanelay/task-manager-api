
const express = require('express')
const router = new express.Router()
const shark = require('sharp')

const multer = require('multer')
const upload = multer({
   
    limits:{
        fileSize:1000000 //1Mb
    },
    fileFilter(req,file,cb)

    { 
          if(!file.originalname.match(/\.(png|jpeg|jpg)$/))
          {
              return cb(new Error('please upload Image'))
          }
            cb(undefined,true)

    }
}) 

const users = require('../db/models/user')
const auth = require('../middleware/auth')

// email 
const {
    sendWelcomeEmail,
    sendCancelationEmail
} = require('../email/account')












router.get('/users',auth,async(req,res)=>{

   
    try {
     const use = await users.find({})
          
          res.status(201).send(use)
         // res.render('users',{title:"all user",name:"all users"})
        
    } catch (error) {
        
     res.status(404).send(error)
    }
 
 })   

 router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})


 router.post('/users/logout',auth,async(req,res)=>{
  
       try {
           req.user.tokens = req.user.tokens.filter((token)=>{

               return token.token != req.token
           })
          await req.user.save()
           res.status(200).send('logout successfully')
       } catch (error) {
           
          res.send(500) 
       }

 }) 
 router.post('/users/logoutAll', auth, async (req, res) => {
    try {
       
           req.user.tokens = [] 
           await req.user.save()
           res.status(200).send('Logout form all devices successfully') 

    } catch (e) {
        res.status(500).send()
    }
})





router.post('/users',async(req,res)=>{

    const newuser = new users(req.body)
     
     try {
         const token = await newuser.generateAuthToken()
         await newuser.save()
         sendWelcomeEmail(newuser.email,newuser.name)
         console.log(newuser.email)
         res.status(200).send({newuser,token})
     } catch (error) {
        res.status(404).send(error)
         
     }

})   







router.post('/users/login', async (req, res) => {
    try {
        const user = await users.findByCredentials(req.body.email, req.body.password)
       // console.log(user)
        const token = await user.generateAuthToken()
       // console.log(token)
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
}) 




  







router.get('/users/:id', async (req, res) => {
const _id = req.params.id

try {
    const user = await users.findById(_id)

    if (!user) {
        return res.status(404).send()
    }

    res.send(user)
} catch (e) {
    res.status(500).send()
}
})



router.patch('/users/me',auth ,async (req, res) => {
    const updates = Object.keys(req.body)
    console.log(updates) 
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
       

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})














router.delete('/user/me',auth,async(req,res)=>{

    try {
          
      await req.user.remove()
      sendCancelationEmail(req.user.email,req.user.name)

          res.status(201).send(req.user)
         
    } catch (error) {
        
         res.status(500).send(error)
    }
}) 



router.post('/user/me/av',auth,upload.single('upload'),async(req,res)=>{
    const buffer = await shark(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
     req.user.profile =buffer
    await req.user.save()

     res.send('upload successfully')
},(error,req,res,next)=>{

      res.status(400).send({error:error.message})
})

router.delete('/user/me/av',auth,async(req,res)=>{
       
      req.user.profile = undefined
     await req.user.save()
    res.send('profiel removed successfully')
})

// get profile 

 router.get('/user/:id/profile',auth,async(req,res)=>
 {
      try {
        const user = await users.findById(req.params.id)
            if(!user||!user.profile)
            {
                throw new Error('no profile')
            }

           res.set('Content-Type','image/png')
           res.send(user.profile)

      } catch (error) {
          

        res.status(400).send(error)
      }
   

 })


module.exports = router  


