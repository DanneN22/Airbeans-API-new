import { Router } from 'express'
import nedb from 'nedb-promises';
import validateMenu from '../middlewares/menuValidation.js';
import validateAdmin from '../middlewares/clearanceValidation.js';
import validateBundle from '../middlewares/bundleValidation.js';

const router = Router()
const menuDB = new nedb({ filename: 'menu.db'});
const bundleDB = new nedb({ filename: 'bundles.db'});


// Get request for all menu items
router.get('/', async (req, res) => { 
    const menu = await menuDB.find({});
    if (menu != null){
      res.status(200).send(menu);
    } else {
      return res.status(400).send('Menu could not be found')
    }
});

// Post new menu item
router.post('/', (req, res) => { 
    const newMenuItem = req.body;
    newMenuItem.createdAt = new Date().toLocaleString()

    
    const next = () => {
      
      const next2 = () => {
        //Add item
        if(newMenuItem) {
          menuDB.insert(newMenuItem)
          res.status(200).json(newMenuItem);
          console.log("added new item")
        } else {
            return res.status(400).send('New menu item could not be created')
        }
      }

      //validate user
      validateAdmin(req,res,next2)
      
    }

    //Validate new item
    validateMenu(req, res, next)

});

// Update an existing item
router.post('/mod/:id', async (req, res) => { 
  const updatedItem = req.body;
  const _id = parseInt(req.params.id)
  let oldItem = await menuDB.findOne({id:_id})
  let menuarr = await menuDB.find({})
  const next = () => {

    if(updatedItem != null) {
      //This makes sure you can not edit the time of creation
      updatedItem.createdAt = oldItem.createdAt
      //adds new modified at field
      updatedItem.modifiedAt = new Date().toLocaleString()
      menuDB.updateOne({id: _id}, updatedItem)
      res.status(200).json(updatedItem);
      console.log("Item updated")
    } else {
      return res.status(400).send('Item could not be updated.')
    }

  }
  if (oldItem != null){
    if(menuarr.some(e => e.id == updatedItem.id)){
      if (updatedItem.id == _id){
        validateAdmin(req,res,next)
      } else {
        return res.status(400).send('This ID is already in use')
      }
    } else {
      validateAdmin(req,res,next)
    }
  } else {
    return res.status(400).send('Item you wanted to edit was not found.')
  }

});


// Add a promo deal bundle
router.post('/promo', async (req, res) => { 
  const promodeal = req.body;
  
  const next = async () => {
    const _insert = await bundleDB.insert(promodeal);
    if (_insert != null){
      res.status(200).json(promodeal);
    } else {
      return res.status(400).send('Could not add promo bundle.')
    }
  }

  validateBundle(req,res,next)

});




// Remove menu item
router.delete('/:id', async (req, res) => {
  const _id = parseInt(req.params.id);
  const menu = await menuDB.findOne({id:_id});

  const next = () => {
    //Makes sure you only delete existing items.
    if (menu != null) {
      menuDB.remove({id:_id})
      res.status(200).send("Deleted element.")
    } else {
      return res.status(400).send("Item does not exist.")
    }

  }
  
  validateAdmin(req,res,next)

})


export default router
