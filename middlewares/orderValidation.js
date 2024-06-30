import { response } from "express"
import orderSchema from "../models/orderModel.js"
import nedb from 'nedb-promises';

const validateOrder = async (req, res, next) => {
    const {error} = orderSchema.validate(req)

    const menuDB = new nedb({ filename: 'menu.db'});
    const menu = await menuDB.find({});
    let menuTitles = []
    menu.forEach(element => {
        menuTitles.push(element.title)
    })

    if (error) {
        return res.status(400).json({error: error.details[0].message})
    } else {
        if(req.items.some(e => !menuTitles.includes(e.product))){
            return res.status(400).send("Some products are not in the menu.")
        }
        for (let i = 0; i < req.items.length; i++){
            let item = await menuDB.findOne({title: req.items[i].product})
            if (item != null){
                if(item.price != req.items[i].price){
                    return res.status(400).send("Some product prices do not follow the menu.")
                }
            }
        }

    }

    

    next()

}


export default validateOrder
