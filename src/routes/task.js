const express = require('express')
const router = new express.Router()
const tasks = require('../db/models/tasks')
const auth = require('../middleware/auth')
const { populate } = require('../db/models/tasks')



router.post('/task', auth, async(req, res) => 
{
    const newtask = new tasks({
        ...req.body,
        owner:req.user._id
    })

  try {
         await newtask.save()
         res.status(201).send(newtask)
      
  } catch (error) {
      
      res.status(404).send(error)
  }
     
})  





router.get('/task', auth,async (req, res) => {
     const match ={}
     const sort ={}
    if(req.query.complated)
    {
        match.complated = req.query.complated==='true'
    }
    if(req.query.sortBy)
    {
        const sortquary = req.query.sortBy.split(':')
        sort[sortquary[0]] = sortquary[1] ==='asc' ? 1:-1
        console.log(sort) 
    }

    try {
        //const task = await tasks.find({owner:req.user._id})
        await req.user.populate({
            path:'vtask',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip :parseInt(req.query.skip),
                sort 
            }

        }).execPopulate()
        res.send(req.user.vtask)
       
    } catch (e) {
        res.status(500).send()
    }
})    


router.get('/task/:id',auth ,async (req, res) => {
    const _id = req.params.id

    try {
        const task = await tasks.findOne({_id,owner:req.user._id})

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})




router.patch('/task/:id',auth,async(req,res)=>
{    
      const update = Object.keys(req.body) 
      const allowed = ["complated" ,"description"]
      const isvalid = update.every((update)=>
      {
           return allowed.includes(update)

      })
      if(!isvalid)
      {
           res.status(400).send({error:'invalid update'})
      }



     try {
          const task = await tasks.findOne({_id:req.params.id,owner:req.user._id}) 
            
        
            //const task = await tasks.findByIdAndUpdate(req.params.id,req.body,{new: true, runValidators:true})
         if(!task)
         {
           return   res.status(400).send()
         }

         update.forEach((update)=>task[update]=req.body[update])
         await task.save()

         res.status(201).send(task)

     } catch (error) {
         
         res.status(400).send(error)

     }


})  



router.delete('/task/:id',auth,async(req,res)=>{


     try {
        const task = await tasks.findOneAndDelete({_id:req.params.id,owner:req.user._id}) 
         if(!task)
         {
              res.status(400).send()
         }
         res.status(201).send(task)
         
     } catch (error) {
          
         res.status(500).send()
         
     }

})  







module.exports = router


