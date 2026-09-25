CREATE DATABASE IF NOT EXISTS charityevents_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE charityevents_db;

DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS organisations;

CREATE TABLE organisations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  mission VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  address VARCHAR(255) NOT NULL
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  organisation_id INT NOT NULL,
  category_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  purpose VARCHAR(255) NOT NULL,
  short_description VARCHAR(255) NOT NULL,
  full_description TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location VARCHAR(120) NOT NULL,
  venue VARCHAR(200) NOT NULL,
  ticket_price DECIMAL(8,2) NOT NULL DEFAULT 0.00,
  goal_amount DECIMAL(10,2) NOT NULL,
  progress_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  image_url VARCHAR(255) NOT NULL,
  is_suspended TINYINT(1) NOT NULL DEFAULT 0,
  CONSTRAINT fk_events_organisation
    FOREIGN KEY (organisation_id) REFERENCES organisations (id),
  CONSTRAINT fk_events_category
    FOREIGN KEY (category_id) REFERENCES categories (id)
);

INSERT INTO organisations (name, mission, description, email, phone, address)
VALUES (
  'Harbour Light Community Fund',
  'Helping Brisbane neighbours find housing, meals, and a fair start at school.',
  'Harbour Light Community Fund is a local charity that raises money for emergency housing, community meals, and school supplies. This website lists the fund''s public events so people in Brisbane can read the details and register their interest.',
  'hello@harbourlight.example',
  '07 3000 2140',
  '12 River Terrace, South Brisbane QLD 4101'
);

INSERT INTO categories (name) VALUES
  ('Fun run'),
  ('Gala'),
  ('Auction'),
  ('Concert');

INSERT INTO events (
  organisation_id, category_id, name, purpose, short_description, full_description,
  event_date, event_time, location, venue, ticket_price, goal_amount, progress_amount,
  image_url, is_suspended
) VALUES
(
  1, 1, 'River Run for Shelter',
  'Raise funds for emergency housing.',
  'A 5 km run along the river raising money for emergency housing.',
  'Join a 5 km community run at South Bank. Registration is a donation toward short-term housing for families who need a safe place to stay. Walkers are welcome, and water stations are provided on the path.',
  '2026-10-12', '07:00:00', 'Brisbane', 'South Bank Parklands',
  25.00, 15000.00, 6400.00, '/images/river-run.jpg', 0
),
(
  1, 2, 'Spring Gala Dinner',
  'Fund a year of community meals.',
  'A seated dinner with guest speakers supporting the community meals program.',
  'An evening dinner for supporters of the meals program. The ticket covers the meal and a donation. Speakers from the charity will share how the funds are used, and there is no live auction at this event.',
  '2026-11-06', '18:30:00', 'South Brisbane', 'Brisbane City Hall',
  120.00, 40000.00, 18500.00, '/images/spring-gala.jpg', 0
),
(
  1, 3, 'Silent Auction for School Books',
  'Buy books and stationery for local students.',
  'A free-entry silent auction of donated items, with all proceeds buying school books.',
  'Browse donated art, experiences, and household items, then leave a written bid. Entry is free. Every dollar raised buys books and stationery for students who are starting the school year without them.',
  '2026-10-24', '17:00:00', 'West End', 'West End Community Hall',
  0.00, 8000.00, 2100.00, '/images/book-auction.jpg', 0
),
(
  1, 4, 'Harbour Lights Concert',
  'Raise money for emergency accommodation.',
  'An evening concert by local musicians supporting emergency accommodation.',
  'Local bands play a ticketed concert and the surplus goes to emergency accommodation. Doors open one hour before the start. This is a seated and standing venue with a small bar run by volunteers.',
  '2026-12-05', '19:00:00', 'Fortitude Valley', 'The Tivoli',
  45.00, 20000.00, 7200.00, '/images/harbour-lights.jpg', 0
),
(
  1, 1, 'Breakfast Run for Meals',
  'Pay for a month of community breakfasts.',
  'An early 3 km run followed by a shared breakfast for the meals program.',
  'A short run for all ages, then a simple breakfast in the park. The ticket price funds community breakfasts through the next month. Children accompanied by an adult can take part at no extra charge.',
  '2026-10-18', '06:30:00', 'Kangaroo Point', 'Kangaroo Point Cliffs Park',
  15.00, 6000.00, 1800.00, '/images/breakfast-run.jpg', 0
),
(
  1, 2, 'Midwinter Gala',
  'Raise funds for winter housing support.',
  'A past gala dinner held in June to support winter housing.',
  'This dinner has already taken place. It is kept in the database so the site can treat it as a past event and leave it off the list of current and upcoming events.',
  '2026-06-20', '18:00:00', 'Brisbane', 'Brisbane City Hall',
  110.00, 35000.00, 35000.00, '/images/midwinter-gala.jpg', 0
),
(
  1, 4, 'Unapproved Street Concert',
  'A concert that did not meet the charity event policy.',
  'This concert was suspended and must not appear on the public event list.',
  'The event date is still in the future, but the organisation suspended it because it did not meet the event policy. The home page and search page must hide it.',
  '2026-10-30', '20:00:00', 'Brisbane', 'Queen Street Mall',
  20.00, 5000.00, 0.00, '/images/suspended-concert.jpg', 1
),
(
  1, 3, 'New Farm Art Auction',
  'Sell donated art to fund school supplies.',
  'A live auction of donated artworks, with the proceeds buying school supplies.',
  'Artists and supporters donated paintings and prints. A volunteer auctioneer leads the bidding. Ticket holders receive a printed catalogue when they arrive.',
  '2026-11-15', '14:00:00', 'New Farm', 'New Farm Park Bandshell',
  10.00, 12000.00, 3400.00, '/images/art-auction.jpg', 0
),
(
  1, 4, 'Riverside Family Concert',
  'Fund weekend meals for families.',
  'A daytime family concert on the river raising money for weekend meals.',
  'A relaxed afternoon concert for families. Children are welcome. Ticket sales pay for weekend food boxes for households that need extra support.',
  '2026-11-22', '16:00:00', 'South Bank', 'Rainforest Green, South Bank',
  20.00, 9000.00, 2600.00, '/images/family-concert.jpg', 0
),
(
  1, 1, 'Twilight Fun Run',
  'Support the emergency housing fund before the end of the year.',
  'A 5 km evening run through Paddington for the housing fund.',
  'The route is lit and marshalled. Runners and walkers start together. The event closes the year''s public running series for the housing fund.',
  '2026-12-13', '17:30:00', 'Paddington', 'Suncorp Stadium forecourt',
  30.00, 10000.00, 900.00, '/images/twilight-run.jpg', 0
);
