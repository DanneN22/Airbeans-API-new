import express from 'express'
import cors from 'cors'
import aboutRouter from './routes/aboutRoute.js'
import authRouter from './routes/authRoute.js'
import historyRouter from './routes/orderHistoryRoute.js'
import orderRouter from './routes/orderRoute.js'
import menuRouter from './routes/menuRoute.js'
import nedb from 'nedb-promises'
import { loggedInUsers, menu } from './config/data.js'


// Start the server
const app = express();
const PORT = 8070;
global.user = null
const db = new nedb({filename: 'register.db'})
const menudb = new nedb({filename: 'menu.db'})

//Vid problem med databas för register.db kan filen tömmas och detta runnas en gång för att få in admin.
/* 
let _admin = await db.findOne({ userID: "ADMIN" });
if (_admin == null){
    await db.insert({userID:"ADMIN",username:"admin",password:"admin",admin:true})
}
*/

//Vid problem med databas kan menu.db tömmas och detta skript runnas en gång
/*menu.forEach(async (item) => {
    await menudb.insert(item)
}) */



//Middlewares
app.use(express.json())
app.use(cors())



//Routes
app.use('/about', aboutRouter)
app.use('/auth', authRouter)
app.use('/history', historyRouter)
app.use('/order', orderRouter)
app.use('/menu', menuRouter)




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


