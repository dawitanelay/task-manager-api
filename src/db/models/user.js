const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs') 
const jwt = require('jsonwebtoken') 
const tasks = require('./tasks')


const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        trim:true,
 
 },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0)
            throw new Error('Age must be postive number')
 
        }
 
 },
     password:
     {
         type:String,
         required:true,
         trim:true,
         minlength:7,
         validate(value)
         {
             if(value.toLowerCase().includes('password'))
             {
                 throw new Error('invalid email')
             }
         }
 
 
     },
  tokens:[{
   token:{
       type:String,
       required:true
   }
  }],

  profile:
  {
      type:Buffer
  },
 
  

    email:
    {
      type:String,
      required:true,
      trim:true,
      unique:true,
      lowercase:true,
      validate(value)
      {
          if(!validator.isEmail(value))
          {
             throw new Error('Invalid Email')
          }
 
      }
 
      
 
    }
 },{
     timestamps:true
 })







 userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    

     if(!user)
     {
        throw 'Unable to login'
     }

    const isMatch = await bcrypt.compare(password, user.password) 

    if (!isMatch) {
        
        throw 'Unable to login'
    }


    return user
}


 userSchema.virtual('vtask', {
    ref: 'task',
    localField: '_id',
    foreignField: 'owner'
})



  userSchema.methods.generateAuthToken = async function() 
  {
       const user = this
       const token = jwt.sign({_id:user._id.toString()},process.env.JWS_SECRATE)
       user.tokens = user.tokens.concat({token})
       await user.save()

  return token

  } 

  userSchema.methods.toJSON = function() 
  {
      const user = this
       const userobject = user.toObject()
     
         delete userobject.password
         delete userobject.tokens
         delete userobject.profile
       

         return userobject

  } 




 userSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
 //  console.log('before saving to the database ')

    next()

}) 

userSchema.pre('remove',async function(next) {
  const user = this
     
    await tasks.deleteMany({owner:user._id})
   

  next()

})

const User= mongoose.model('User',userSchema)








  



module.exports= User  
 

