-- charityevents_db schema for PROG2002 Assessment 2.
-- Past and upcoming are not stored. Compare event_date with the current date in queries.
-- is_suspended = 1 hides an event from the public pages without deleting it.

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
