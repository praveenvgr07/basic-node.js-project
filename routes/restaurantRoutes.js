const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.get('/', restaurantController.getAllRestaurants);
router.get('/home', restaurantController.getAllRestaurants);
router.get('/restaurant/:id', restaurantController.getRestaurantMenu);

module.exports = router;
