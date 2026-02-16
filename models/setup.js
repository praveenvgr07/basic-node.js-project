const db = require('../config/db');

const createTables = async () => {
    try {
        const usersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        const restaurantsTable = `
            CREATE TABLE IF NOT EXISTS restaurants (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                cuisine VARCHAR(255),
                rating DECIMAL(2,1) DEFAULT 0.0,
                image_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        const menuItemsTable = `
            CREATE TABLE IF NOT EXISTS menu_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                restaurant_id INT,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL,
                is_veg BOOLEAN DEFAULT TRUE,
                image_url VARCHAR(255),
                FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
            )
        `;

        const ordersTable = `
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                restaurant_id INT,
                status ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'pending',
                total_amount DECIMAL(10,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
            )
        `;

        const orderItemsTable = `
            CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT,
                menu_item_id INT,
                quantity INT NOT NULL DEFAULT 1,
                price DECIMAL(10,2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
            )
        `;

        await db.query(usersTable);
        await db.query(restaurantsTable);
        await db.query(menuItemsTable);
        await db.query(ordersTable);
        await db.query(orderItemsTable);

        console.log("All tables created successfully.");

        // Seed Users (optional, maybe check if empty first)

        // Seed Restaurants
        const [restaurants] = await db.query('SELECT * FROM restaurants');
        if (restaurants.length === 0) {
            const seedRestaurants = [
                ['Pizza Hut', 'Italian, Pizzas', 4.2, '/image/pizza.png'],
                ['Burger King', 'American, Burgers', 4.0, '/image/burger.png'],
                ['Saravana Bhavan', 'South Indian, Veg', 4.5, '/image/dosa.png']
            ];
            await db.query('INSERT INTO restaurants (name, cuisine, rating, image_url) VALUES ?', [seedRestaurants]);
            console.log("Seeded restaurants.");

            // Get inserted restaurants to seed menu items
            const [newRestaurants] = await db.query('SELECT * FROM restaurants');
            const menuItems = [];

            newRestaurants.forEach(res => {
                if (res.name === 'Pizza Hut') {
                    menuItems.push([res.id, 'Margherita Pizza', 'Classic cheese pizza', 299.00, true, '']);
                    menuItems.push([res.id, 'Pepperoni Pizza', 'Spicy pepperoni', 399.00, false, '']);
                } else if (res.name === 'Burger King') {
                    menuItems.push([res.id, 'Whopper', 'Flame grilled beef burger', 199.00, false, '']);
                    menuItems.push([res.id, 'Veg Whopper', 'Flame grilled veg burger', 179.00, true, '']);
                } else if (res.name === 'Saravana Bhavan') {
                    menuItems.push([res.id, 'Masala Dosa', 'Crispy dosa with potato masala', 120.00, true, '']);
                    menuItems.push([res.id, 'Idli', 'Steamed rice cakes', 60.00, true, '']);
                }
            });

            await db.query('INSERT INTO menu_items (restaurant_id, name, description, price, is_veg, image_url) VALUES ?', [menuItems]);
            console.log("Seeded menu items.");
        }

    } catch (error) {
        console.error("Error creating tables:", error);
    } finally {
        process.exit();
    }
};

createTables();
