CREATE TABLE Product (
  id UUID PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL
);

INSERT INTO Product (id, name, description) VALUES (uuid_generate_v4(), 'Pink Strawberry', 'A fluffy strawberry cupcake with strawberry buttercream frosting and chocolate syrup.');
INSERT INTO Product (id, name, description) VALUES (uuid_generate_v4(), 'Marshmallow', 'A super chocolatey cupcake base with a soft marshmallowy buttercream topping.');
INSERT INTO Product (id, name, description) VALUES (uuid_generate_v4(), 'Dark Chocolate', 'Belgian chocolate cake with sweet chocolate frosting and cheery.');
INSERT INTO Product (id, name, description) VALUES (uuid_generate_v4(), 'Salty Caramel', 'Caramel cake with a buttery caramel cream cheese frosting topped with fleur de sel.');
INSERT INTO Product (id, name, description) VALUES (uuid_generate_v4(), 'Gluten Free Velvet', 'A gluten free twist on our classic red velvet, topped off with cream cheese.');
INSERT INTO Product (id, name, description) VALUES (uuid_generate_v4(), 'Lemon Lavender', 'Lemon cupcake with a delicate lavender buttercream frosting.');
INSERT INTO Product (id, name, description) VALUES (uuid_generate_v4(), 'Blueberry Cheesecake', 'Blueberry cupcake filled with a dollop of cheesecake filling, topped with blueberry compote and graham cracker crumbles.');
INSERT INTO Product (id, name, description) VALUES (uuid_generate_v4(), 'Peanut Butter Cup', 'A rich chocolate cupcake with a creamy peanut butter frosting and drizzled with melted chocolate.');
INSERT INTO Product (id, name, description) VALUES (uuid_generate_v4(), 'Pumpkin Spice', 'Pumpkin cupcake with a cream cheese frosting and a sprinkle of cinnamon and nutmeg.');
INSERT INTO Product (id, name, description) VALUES (uuid_generate_v4(), 'Hazelnut Mocha', 'Hazelnut flavored cupcake with a coffee infused frosting and drizzled with chocolate syrup.');
INSERT INTO Product (id, name, description) VALUES (uuid_generate_v4(), 'Coffee and Donuts', 'A light coffee flavored cupcake with a glaze similar to a powdered donut and topped with rainbow sprinkles.');
INSERT INTO Product (id, name, description) VALUES (uuid_generate_v4(), 'Black and White', 'Half of the cupcake is chocolate and the other half is vanilla, topped with a swirl of chocolate and vanilla frosting.');
INSERT INTO Product (id, name, description) VALUES (uuid_generate_v4(), 'Carrot Cake', 'A classic carrot cake with a sweet cream cheese frosting and topped with chopped walnuts.');
INSERT INTO Product (id, name, description) VALUES (uuid_generate_v4(), 'Red Raspberry', 'Raspberry flavored cupcake with a raspberry buttercream frosting and topped with a raspberry glaze.');
INSERT INTO Product (id, name, description) VALUES (uuid_generate_v4(), 'Churro', 'A cinnamon flavored cupcake with a warm caramel glaze and topped with cinnamon sugar.');
INSERT INTO Product (id, name, description) VALUES (uuid_generate_v4(), "S'mores", 'Chocolate cupcake with a graham cracker crust, filled with a marshmallow cream, and topped with a torched meringue.');
INSERT INTO Product (id, name, description) VALUES (uuid_generate_v4(), 'Apple Pie', 'Apple flavored cupcake with a warm cinnamon sugar filling and topped with a buttery crumble topping.');
INSERT INTO Product (id, name, description)
VALUES (uuid_generate_v4(), 'Gingerbread', 'Gingerbread flavored cupcake with a cream cheese frosting and a sprinkle of cinnamon and nutmeg.');
INSERT INTO Product (id, name, description)
VALUES (uuid_generate_v4(), 'Coconut Cream', 'Coconut flavored cupcake with a coconut cream frosting and sprinkled with shredded coconut.');
INSERT INTO Product (id, name, description)
VALUES (uuid_generate_v4(), 'Mocha Latte', 'Coffee flavored cupcake with a mocha buttercream frosting and drizzled with chocolate syrup.');


CREATE TABLE ProductImage (
  id UUID PRIMARY KEY NOT NULL,
  product_id UUID REFERENCES Product(id),
  image_url VARCHAR(255) NOT NULL
);

CREATE TABLE ProductSpecification (
  id UUID PRIMARY KEY NOT NULL,
  product_id UUID REFERENCES Product(id),
  size VARCHAR(50),
  flavor VARCHAR(50),
  weight NUMERIC(3,2),
  combo_quantity SMALLINT,
  frosting VARCHAR(50),
  ingredients TEXT,
  shelf_life SMALLINT,
  packaging VARCHAR(50),
  availability VARCHAR(50)
);

CREATE TABLE ProductPrice (
  id UUID PRIMARY KEY NOT NULL,
  product_id UUID REFERENCES Product(id),
  price NUMERIC(10, 2) NOT NULL,
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0
);

CREATE TABLE ProductAvailability (
  id UUID PRIMARY KEY NOT NULL,
  product_id UUID REFERENCES Product(id),
  in_stock BOOLEAN NOT NULL,
  total_quantity SMALLINT NOT NULL,
  sold_quantity SMALLINT NOT NULL,
  delivery_time INTERVAL NOT NULL
);

CREATE TABLE ProductRating (
  id UUID PRIMARY KEY NOT NULL,
  product_id UUID REFERENCES Product(id),
  rating SMALLINT NOT NULL
);

CREATE TABLE ProductReview (
  id UUID PRIMARY KEY NOT NULL,
  product_id UUID REFERENCES Product(id),
  review TEXT NOT NULL
);

-- Inserts

INSERT INTO Product (id, name, description)
VALUES ('d5c84923-ebc5-4e67-b068-be7e3397c73b', 'Pink Strawberry', 'A fluffy strawberry cupcake with strawberry buttercream frosting and chocolate syrup.');

INSERT INTO ProductImage (id, product_id, image_url)
VALUES ('e43f0aac-96a1-4c5e-afc2-2ed7abf6876d', 'd5c84923-ebc5-4e67-b068-be7e3397c73b', 'https://www.example.com/images/pink-strawberry.jpg');

INSERT INTO ProductSpecification (id, product_id, specification_key, specification_value)
VALUES 
  ('b6b1ab6d-8ca0-4c69-97d7-056f837ad932', 'd5c84923-ebc5-4e67-b068-be7e3397c73b', 'Flavor', 'Strawberry'),
  ('dc57d2b1-a5e5-4f12-b3c9-9ebc0f5d4e4a', 'd5c84923-ebc5-4e67-b068-be7e3397c73b', 'Frosting', 'Strawberry Buttercream'),
  ('d1c51ac0-9f56-4d87-aabf-b5c5c8a5b1a5', 'd5c84923-ebc5-4e67-b068-be7e3397c73b', 'Topping', 'Chocolate Syrup');

INSERT INTO ProductPrice (id, product_id, price, discount)
VALUES ('c9eab126-6a3f-4ddd-96dc-b6a3b7d90b6a', 'd5c84923-ebc5-4e67-b068-be7e3397c73b', 5.99, 0.00);

INSERT INTO ProductAvailability (id, product_id, in_stock, total_quantity, sold_quantity, delivery_time)
VALUES ('7cfe8bec-0bb7-4b0f-b7d1-d80681556e0c', 'd5c84923-ebc5-4e67-b068-be7e3397c73b', true, 50, 20, '1 day');

INSERT INTO ProductRating (id, product_id, rating)
VALUES 
  ('9f3478e6-4557-41e8-a2a7-1c44e1a5949d', 'd5c84923-ebc5-4e67-b068-be7e3397c73b', 5),
  ('3e3e2383-d345-4097-8dc1-af58dd0c3514', 'd5c84923-ebc5-4e67-b068-be7e3397c73b', 4);

--

