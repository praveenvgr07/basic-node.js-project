const db = require('../config/db');

exports.placeOrder = async (req, res) => {
    try {
        const { restaurant_id, items, total_amount, username } = req.body;

        // Find user id by username
        const [users] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        const userId = users[0].id;

        // Create Order
        const [orderResult] = await db.query('INSERT INTO orders (user_id, restaurant_id, total_amount, status) VALUES (?, ?, ?, ?)',
            [userId, restaurant_id, total_amount, 'confirmed']);

        const orderId = orderResult.insertId;

        // Create Order Items
        const orderItemsValues = items.map(item => [orderId, item.id, item.quantity, item.price]);
        await db.query('INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES ?', [orderItemsValues]);

        res.json({ success: true, orderId: orderId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const username = req.query.user;
        if (!username) {
            return res.redirect('/login');
        }

        const [users] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
        if (users.length === 0) return res.redirect('/login');
        const userId = users[0].id;

        const [orders] = await db.query(`
            SELECT orders.id, orders.total_amount, orders.status, orders.created_at, restaurants.name as restaurant_name 
            FROM orders 
            JOIN restaurants ON orders.restaurant_id = restaurants.id 
            WHERE orders.user_id = ? 
            ORDER BY orders.created_at DESC
        `, [userId]);

        res.render('orders', { orders: orders, user: username });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
