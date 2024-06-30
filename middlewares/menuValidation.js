import { response } from "express"
import menuSchema from "../models/menuModel.js"
import nedb from "nedb-promises";

const menuDB = new nedb({ filename: 'menu.db'});



const validateMenu = async (req, res, next) => {
    const {error} = menuSchema.validate(req.body)
    
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    } else {
        let _currentmenu = await menuDB.find({})
        if (_currentmenu.some(item => item.id == req.body.id)){
            return res.status(400).send("item id already in use")
        }
    }

    next()
    

}


export default validateMenu
