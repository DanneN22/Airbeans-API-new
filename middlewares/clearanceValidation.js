import { response } from "express"
import nedb from 'nedb-promises';
import { loggedInUsers } from "../config/data.js";

const validateAdmin = (req, res, next) => {

    if (global.user != null) {
        if (global.user.admin != true) {
            return res.status(401).send("Permission denied, not admin.")
        } else {
            if (!loggedInUsers.includes(global.user)){
                return res.status(401).send("Permission denied.")
            }
        }
    } else {
        return res.status(401).send("Not logged in")
    }
    


    next()

}


export default validateAdmin
