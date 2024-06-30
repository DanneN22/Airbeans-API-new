import { Router } from 'express';
import { nanoid } from 'nanoid';
import { cart } from '../config/data.js';
import nedb from 'nedb-promises';
import validateOrder from '../middlewares/orderValidation.js'
import nodemon from 'nodemon';


//Konfigurations data
let totalyprice = 0;
const database = new nedb({ filename: 'order.db'});
const userDatabase = new nedb({ filename: 'register.db'});
const router = Router();


//Beräknar shoppingcartens totala värde
//Kan tillägga kampanjer.

const bundleDB = new nedb({ filename: 'bundles.db'});

async function searchBundles(_cart) {
    const bundleArr = await bundleDB.find({})
    const approvedbundles = []
    let cartitemnames = []
    _cart.forEach(item => {
        item.items.forEach(x => {
            cartitemnames.push(x.product)
        })
    })
    if (bundleArr != []) {
        bundleArr.forEach(z => {
            let counter = 0
            z.titles.forEach(v => {
                if (cartitemnames.includes(v)){
                    counter++
                }
            })
            if (counter == z.titles.length){
                approvedbundles.push(z)
            }
        })
    }

    if (approvedbundles == []){
        return null
    } else {
        return approvedbundles
    }
}

async function totalPrice(cart) {
    let loop = true
    let _cartinstance = cart.map((x) => x)


    while(loop){
        //Sort by cheapest deals
        let bundles = await searchBundles(_cartinstance)
        if (bundles != null && bundles.length != 0) {
            bundles.sort((a,b) => a.bundlePrice - b.bundlePrice)
            bundles[0].titles.forEach(bundleitem => {
                if(_cartinstance != []){
                    for(let i = 0; i < _cartinstance.length; i++){
                        for(let z = 0; z < _cartinstance[i].items.length; z++){
                            if (_cartinstance[i].items[z].product == bundleitem){
                                _cartinstance[i].items.splice(z,1)
                            }
                        }
                        
                    }
                }
                
            })
            totalyprice += bundles[0].bundlePrice
        } else {
            loop = false
            break
        }
        
    }


    _cartinstance.forEach(e => {
        e.items.forEach(x => {
            totalyprice += x.price * x.quantity
        })
    })

}


function totalCartPrice() {
    //This function is guaranteed to give the cheapest option because all orders have the cheapest bundles
    let price = 0
    cart.forEach(order => {
        price += order.total
    })
    return price
}

// Dokumentation todo
router.get('/', async (req, res) => {
    let _totalPrice = totalCartPrice();
    res.status(200).json({ cart, _totalPrice });
});

// ORDER MENU ITEM
router.post('/', async (req, res) => {

    const order = req.body;

    if (order.userID != null) {

        //Användar kontroll
        const loggedInUser = await userDatabase.findOne({ userID: order.userID });
        if (loggedInUser == null) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }


        //Order format för kontroll
        const addCoffee = {
            userID: order.userID,
            orderID: nanoid(),
            items: order.items,
            total: 0,
            status: "Pending"
        };


        const next = async () => {
            //Data behandling
            cart.push(addCoffee);
            totalyprice = 0
            await database.insert(addCoffee);

            function getDeliveringTime(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            const randomNumber = getDeliveringTime(10, 60);
            console.log(`Your coffee will be delivered in about ${randomNumber} minutes`);
            
            let _orderclone = JSON.parse(JSON.stringify(addCoffee))

            await totalPrice([_orderclone])
            addCoffee.total = totalyprice
            res.status(200).json({
                success: true,
                message: 'Coffee added successfully',
                userID: order.userID,
                order: addCoffee
            });
        }

        //Använder addCoffe istället för req för att underlätta arbete för middleware
        //Formatet är redan gjort i addCoffe variabeln.
        validateOrder(addCoffee, res, next)

    } else {
        return res.status(400).json({ error: 'You must provide a userID' });
    }
});

export default router;
