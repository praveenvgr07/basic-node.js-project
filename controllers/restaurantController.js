const db = require('../config/db');

exports.getAllRestaurants = async (req, res) => {
    try {
        const [restaurants] = await db.query('SELECT * FROM restaurants');
        res.render('home', { restaurants: restaurants, user: req.query.user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.getRestaurantMenu = async (req, res) => {
    try {
        const restaurantId = req.params.id;
        const [restaurant] = await db.query('SELECT * FROM restaurants WHERE id = ?', [restaurantId]);
        const [menuItems] = await db.query('SELECT * FROM menu_items WHERE restaurant_id = ?', [restaurantId]);

        if (restaurant.length === 0) {
            return res.redirect('/home');
        }

        res.render('restaurant', { restaurant: restaurant[0], menuItems: menuItems, user: req.query.user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
