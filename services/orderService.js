import nedb from 'nedb-promises';

const database = new nedb({ filename: 'order.db'});

async function findOrdersByUserId(userId) {
    return await database.find({ userID: userId });
}

export  { findOrdersByUserId };
