import { Router, text } from 'express'
import { loggedInUsers } from '../config/data.js'
import userSchema from '../models/userModel.js'
import { createUser, findUser } from '../services/auth.js'
import validateUser from '../middlewares/userValidation.js'



const router = Router()

//  REGISTER A NEW USER
router.post('/register', validateUser, async (req, res) => {

    const user = await findUser(req.body.username)

    const next = async () => {
        if (user) {
            return res.status(400).json({ error: 'sorry user already exists' })
        }

        const newUser = await createUser(req.body)
        const response = {
            success: true,
            status: 201,
            message: 'user created successfully',
            data: newUser
            
        }
        res.json(response)
    }

    validateUser(req,res,next)
    
})

// LOGIN
router.post('/login', validateUser, async (req, res) => {
    
    const next = async () => {
        const user = await findUser(req.body.username)
        if (!user) {
            
            return res.status(404).json({ error: 'Sorry user dont exists' })
        
        
        } else if (user.password !== req.body.password) {
    
            return res.status(401).json({ error: 'The password is incorrect' })
        }
        if (!loggedInUsers.some(element => element.userID == user.userID)) {
            global.user = user
            loggedInUsers.push(user)
            const response = {
                success: true,
                status: 200,
                message: 'user was logged in successfully',
                data: user
                
            }
            res.json(response)
        } else {
            return res.status(400).json({ error: 'User already logged in' })
        }

    }


    validateUser(req,res,next)

})

router.post('/logout', (req,res) => {

    global.user = null
    let found = false
    loggedInUsers.forEach(function (_user, i) {
        if (_user.userID == req.body.userID){
            loggedInUsers.splice(i, 1)
            const response = {
                success : true,
                status : 200,
                message : "User logged out successfully"
            }
            found = true
            return res.status(200).json(response)
        }
    })
    if (!found) {
        return res.status(400).send("Can not log out a user that is not logged in.")
    }

    
})

export default router