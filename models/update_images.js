const db = require('../config/db');

const updateImages = async () => {
    try {
        await db.query(`UPDATE restaurants SET image_url = '/image/pizza.png' WHERE name = 'Pizza Hut'`);
        await db.query(`UPDATE restaurants SET image_url = '/image/burger.png' WHERE name = 'Burger King'`);
        await db.query(`UPDATE restaurants SET image_url = '/image/dosa.png' WHERE name = 'Saravana Bhavan'`);

        console.log("Restaurant images updated successfully.");
        process.exit();
    } catch (error) {
        console.error("Error updating images:", error);
        process.exit(1);
    }
};

updateImages();
