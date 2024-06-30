import Joi from 'joi'

const userSchema = Joi.object({
   userID: Joi.string(),
   username: Joi.string().alphanum().min(5).max(30).required(),
   password : Joi.string().min(5).required(),
   admin: Joi.bool() 
})

export default userSchema