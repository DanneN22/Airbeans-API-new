import { Router } from 'express';
import { findOrdersByUserId } from '../services/orderService.js';
import { findUserById } from '../services/auth.js';

const router = Router();

router.get('/orders/:userID', async (req, res) => {

    const uid = req.params.userID;
    console.log(uid)
    const user = await findUserById(uid);
    if (user == null) {
        return res.status(404).json({ error: 'User not found' });
    }
    try {
        const orders = await findOrdersByUserId(uid);
        res.status(200).json({
            message: 'Orders retrieved successfully',
            data: {
                user: uid,
                orders: orders,
            },
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve orders' });
    }    

});

export default router;
