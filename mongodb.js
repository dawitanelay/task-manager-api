const mongodb = require('mongodb')
const mongodbclient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID



const connectonUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// connecting to database 

mongodbclient.connect(connectonUrl,{useNewUrlParser:true},(error,client)=>{

if(error)
{
    return console.log('unable to connect')
}

const db = client.db(databaseName)




 // Insert operation 
   db.collection('users').insertMany([{
    

        name:'dawit',
        age :27
    
 },{
  name:'bini',
  age:25,

 }],(error,result)=>{
    if(error)
    {
        return console.log('unable to insert data')
    }
    console.log(result.ops)
  })


  // Insert Many Operation 
  db.collection('tasks').insertMany([
      {
          name:'readingbook',
          complate:true

  },
  {  name:'doingproject',
  complate:false

  },
  {
    name:'masterprogram',
    complate:false
  }],(error,result)=>{
      if(error)
      {
          return console.log('unable to insert')
      }
      console.log(result.ops)
  })





// featching data || Read operation 

db.collection('users').findOne({name:'bini'},(error,result)=>{
    if(error)
    {
        return console.log('unable to find')
    }
    console.log(result)
})

db.collection('users').find({age:27}).toArray((error,result)=>{
    if(error)
    {
        return console.log('unable to find')
    }
    console.log(result)

})


   db.collection('tasks').findOne({_id:new ObjectID("5f403ecce243b8a645c65196")},(error,result)=>{

    if(error)
        {
            return console.log('unable to find')
        }
        console.log(result)



   })


   db.collection('tasks').find({complate:false}).toArray((error,result)=>{

    if(error)
        {
            return console.log('unable to find')
        }
        console.log(result)
   })


   //Update Operation 
     db.collection('users').updateOne({_id:new ObjectID("5f4035cf40c5229e15aa3dc2")},{

        $set:{
            name:'anelay'
        }
     }).then((result)=>{

        console.log('update sucessfully')
     }).catch((error)=>{
         console.log(error)
     })


     db.collection('users').updateMany({age:27},{
         $set:{
             age:26
         }
     }).then((result)=>{
         console.log(result)
     }).catch((error)=>{
         console.log(error)
     })


     // delete Operation 

    db.collection('users').deleteMany({

        age:26

    }).then((result)=>{
        
        console.log(result)

    }).catch((error)=>{
        console.log(error)
    })



})


console.log('test')