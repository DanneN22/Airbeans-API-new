import { response } from "express"
import bundleSchema from "../models/bundleModel.js"
import nedb from 'nedb-promises'

let productnames = []
const menu = new nedb({filename: 'menu.db'})
let products = await menu.find()
products.forEach(element => {
    productnames.push(element.title)
});

const validateBundle = async (req, res, next) => {
    const {error} = bundleSchema.validate(req.body)
    const itemArray = req.body.titles

    if (error) {
        return res.status(400).json({error: error.details[0].message})
    } else {

        if(itemArray.some(e => !productnames.includes(e))) {
            return res.status(400).send("Certain items are not in the menu")
        }
    }

    

    next()

}


export default validateBundle
