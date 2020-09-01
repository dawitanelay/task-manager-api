 const express = require('express')
 require('./db/mongoose')
 const userrouter = require('./routes/user')
 const taskrouter = require('./routes/task') 


const app = express()
const hbs = require('hbs')
const path = require('path')                           

const publicDir = path.join(__dirname,'../public')   
const viewDir = path.join(__dirname,'../teamplate/views')
const paritalDir = path.join(__dirname,'../teamplate/partials')          

 console.log('test')
 app.set('view engine', 'hbs')
 app.set('views',viewDir)
 hbs.registerPartials(paritalDir) 

 
 
 const port = process.env.PORT 

 









 app.use(express.json())
 app.use(userrouter)
 app.use(taskrouter)


 
 





app.listen(port,()=>{

    console.log('Server is up on port '+ port)      

})      





  










