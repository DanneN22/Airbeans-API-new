import nedb from 'nedb-promises'
import { nanoid } from 'nanoid'
import {loggedInUsers} from '../config/data.js'


const database = new nedb({filename: 'register.db'});

// Add new user
async function createUser(user){
  const newUserId = nanoid(5)
  const newUser = {userID: newUserId, username: user.username, password: user.password, admin: false}
  const newInsertedUser = await database.insert(newUser)
  return newInsertedUser
}

const findUser = async (username) =>{
  const user = await database.findOne({username : username})
  return user
}

const findUserById = async (userId) =>{
  return await database.findOne({ userID: userId });
}

export { createUser, findUser, findUserById }