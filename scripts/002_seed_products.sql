-- Insert sample products into the database
INSERT INTO products (name, category, image_url, new_price, old_price, description) VALUES
-- Women's products
('Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse', 'women', '/src/Components/Assets/product_1.png', 50.00, 80.50, 'Elegant striped blouse with flutter sleeves and peplum hem'),
('Floral Print Wrap Dress', 'women', '/src/Components/Assets/product_2.png', 85.00, 120.50, 'Beautiful floral wrap dress perfect for any occasion'),
('Classic White Button-Down Shirt', 'women', '/src/Components/Assets/product_3.png', 60.00, 100.50, 'Timeless white shirt for professional look'),
('Elegant Evening Gown', 'women', '/src/Components/Assets/product_4.png', 100.00, 150.00, 'Stunning evening gown for special events'),
('Casual Summer Top', 'women', '/src/Components/Assets/product_5.png', 85.00, 120.50, 'Light and breezy summer top'),
('Striped Casual Blouse', 'women', '/src/Components/Assets/product_6.png', 85.00, 120.50, 'Comfortable striped blouse for everyday wear'),
('Bohemian Style Dress', 'women', '/src/Components/Assets/product_7.png', 85.00, 120.50, 'Free-spirited bohemian dress'),
('Professional Blazer', 'women', '/src/Components/Assets/product_8.png', 85.00, 120.50, 'Tailored blazer for business settings'),
('Flowy Maxi Dress', 'women', '/src/Components/Assets/product_9.png', 85.00, 120.50, 'Elegant flowy maxi dress'),
('Knitted Sweater', 'women', '/src/Components/Assets/product_10.png', 85.00, 120.50, 'Cozy knitted sweater for winter'),
('Trendy Crop Top', 'women', '/src/Components/Assets/product_11.png', 85.00, 120.50, 'Modern crop top for casual outings'),
('Designer Blouse', 'women', '/src/Components/Assets/product_12.png', 85.00, 120.50, 'Premium designer blouse'),

-- Men's products
('Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket', 'men', '/src/Components/Assets/product_13.png', 85.00, 120.50, 'Stylish bomber jacket for modern men'),
('Classic Denim Jacket', 'men', '/src/Components/Assets/product_14.png', 85.00, 120.50, 'Timeless denim jacket'),
('Casual Cotton T-Shirt', 'men', '/src/Components/Assets/product_15.png', 85.00, 120.50, 'Comfortable everyday t-shirt'),
('Formal Dress Shirt', 'men', '/src/Components/Assets/product_16.png', 85.00, 120.50, 'Elegant dress shirt for formal occasions'),
('Leather Jacket', 'men', '/src/Components/Assets/product_17.png', 85.00, 120.50, 'Premium leather jacket'),
('Hooded Sweatshirt', 'men', '/src/Components/Assets/product_18.png', 85.00, 120.50, 'Warm and comfortable hoodie'),
('Slim Fit Jeans', 'men', '/src/Components/Assets/product_19.png', 85.00, 120.50, 'Modern slim fit jeans'),
('Sports Jacket', 'men', '/src/Components/Assets/product_20.png', 85.00, 120.50, 'Athletic sports jacket'),
('Polo Shirt', 'men', '/src/Components/Assets/product_21.png', 85.00, 120.50, 'Classic polo shirt'),
('Winter Coat', 'men', '/src/Components/Assets/product_22.png', 85.00, 120.50, 'Warm winter coat'),
('Cargo Pants', 'men', '/src/Components/Assets/product_23.png', 85.00, 120.50, 'Practical cargo pants'),
('Varsity Jacket', 'men', '/src/Components/Assets/product_24.png', 85.00, 120.50, 'Retro varsity jacket'),

-- Kids products
('Boys Orange Colourblocked Hooded Sweatshirt', 'kid', '/src/Components/Assets/product_25.png', 85.00, 120.50, 'Vibrant hooded sweatshirt for active kids'),
('Kids Denim Jacket', 'kid', '/src/Components/Assets/product_26.png', 85.00, 120.50, 'Cute denim jacket for kids'),
('Colorful T-Shirt', 'kid', '/src/Components/Assets/product_27.png', 85.00, 120.50, 'Fun and colorful t-shirt'),
('Kids Winter Jacket', 'kid', '/src/Components/Assets/product_28.png', 85.00, 120.50, 'Warm jacket for cold days'),
('Striped Polo', 'kid', '/src/Components/Assets/product_29.png', 85.00, 120.50, 'Stylish striped polo'),
('Casual Shorts Set', 'kid', '/src/Components/Assets/product_30.png', 85.00, 120.50, 'Comfortable shorts set'),
('Sports Tracksuit', 'kid', '/src/Components/Assets/product_31.png', 85.00, 120.50, 'Athletic tracksuit for kids'),
('Graphic Print Tee', 'kid', '/src/Components/Assets/product_32.png', 85.00, 120.50, 'Cool graphic print t-shirt'),
('Kids Bomber Jacket', 'kid', '/src/Components/Assets/product_33.png', 85.00, 120.50, 'Trendy bomber jacket'),
('Fleece Hoodie', 'kid', '/src/Components/Assets/product_34.png', 85.00, 120.50, 'Soft fleece hoodie'),
('Denim Shorts', 'kid', '/src/Components/Assets/product_35.png', 85.00, 120.50, 'Comfortable denim shorts'),
('Kids Windbreaker', 'kid', '/src/Components/Assets/product_36.png', 85.00, 120.50, 'Lightweight windbreaker')
ON CONFLICT DO NOTHING;
