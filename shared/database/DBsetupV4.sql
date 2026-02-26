/*
CHANGE LOG – Optimized Setup Script

1. Cleaned up Points table:
   - Removed redundant user_ID foreign key.
   - driver_ID now represents the affected driver.
   - sponsor_ID represents the sponsor performing the action.

2. Fixed About_Page AUTO_INCREMENT issue:
   - version_num no longer AUTO_INCREMENT.
   - Now manually managed as intended by your insert example.

3. Minor consistency improvements:
   - Ensured clean FK structure.
   - Removed unnecessary commented drop statements.
   - Kept schema identical to your ERD.
*/

/*DROP DATABASE IF EXISTS Team24_DB_PROD;
CREATE DATABASE Team24_DB_PROD;*/
USE Team24_DB_DEV;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS Individual;
DROP TABLE IF EXISTS `Group`;
DROP TABLE IF EXISTS Global;
DROP TABLE IF EXISTS Notification;
DROP TABLE IF EXISTS Notification_Type;
DROP TABLE IF EXISTS Audit_Log;
DROP TABLE IF EXISTS Points;
DROP TABLE IF EXISTS Application;
DROP TABLE IF EXISTS Order_Item;
DROP TABLE IF EXISTS `Order`;
DROP TABLE IF EXISTS Inventory;
DROP TABLE IF EXISTS Catalog_Contains;
DROP TABLE IF EXISTS Catalog;
DROP TABLE IF EXISTS Product;
DROP TABLE IF EXISTS Login;
DROP TABLE IF EXISTS PW_Reset;
DROP TABLE IF EXISTS Company;
DROP TABLE IF EXISTS `User`;
DROP TABLE IF EXISTS About_Page;

SET FOREIGN_KEY_CHECKS = 1;

-- User
-- Stores all users (drivers, sponsors, admin)
CREATE TABLE `User` (
  user_ID           INT NOT NULL AUTO_INCREMENT,
  user_role         VARCHAR(50) NOT NULL,
  user_join_date    DATE NULL,
  user_end_date     DATE NULL,
  company_ID        INT NULL,
  user_username     VARCHAR(100) NOT NULL,
  user_fname        VARCHAR(100) NULL,
  user_lname        VARCHAR(100) NULL,
  user_phone_number VARCHAR(25) NULL,
  user_email        VARCHAR(255) NULL,
  PRIMARY KEY (user_ID),
  UNIQUE (user_username)
);

-- Company
-- Sponsor company(s)
CREATE TABLE Company (
  company_ID             INT NOT NULL AUTO_INCREMENT,
  company_name           VARCHAR(255) NOT NULL,
  company_contract_start DATE NULL,
  company_contract_end   DATE NULL,
  company_region         VARCHAR(100) NULL,
  company_phone          VARCHAR(25) NULL,
  user_ID                INT NULL,
  PRIMARY KEY (company_ID),
  FOREIGN KEY (user_ID)
    REFERENCES `User`(user_ID)
);

ALTER TABLE `User`
  ADD FOREIGN KEY (company_ID)
  REFERENCES Company(company_ID);

-- Product
CREATE TABLE Product (
  product_ID    INT NOT NULL AUTO_INCREMENT,
  product_name  VARCHAR(255) NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  product_desc  TEXT NULL,
  PRIMARY KEY (product_ID)
);

-- Inventory
CREATE TABLE Inventory (
  product_ID    INT NOT NULL,
  product_stock DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (product_ID),
  FOREIGN KEY (product_ID)
    REFERENCES Product(product_ID)
);

-- Catalog
CREATE TABLE Catalog (
  company_ID         INT NOT NULL,
  catalog_conversion DECIMAL(10,4) NOT NULL,
  PRIMARY KEY (company_ID),
  FOREIGN KEY (company_ID)
    REFERENCES Company(company_ID)
);

-- Catalog_Contains
CREATE TABLE Catalog_Contains (
  company_ID INT NOT NULL,
  product_ID INT NOT NULL,
  PRIMARY KEY (company_ID, product_ID),
  FOREIGN KEY (company_ID)
    REFERENCES Catalog(company_ID),
  FOREIGN KEY (product_ID)
    REFERENCES Product(product_ID)
);

-- Application
CREATE TABLE Application (
  application_ID     INT NOT NULL AUTO_INCREMENT,
  driver_ID          INT NOT NULL,
  sponsor_ID         INT NOT NULL,
  application_status VARCHAR(50) NOT NULL,
  application_reason VARCHAR(255) NULL,
  application_date   DATE NULL,
  PRIMARY KEY (application_ID),
  FOREIGN KEY (driver_ID)
    REFERENCES `User`(user_ID),
  FOREIGN KEY (sponsor_ID)
    REFERENCES `User`(user_ID)
);

-- Points
CREATE TABLE Points (
  driver_ID     INT NOT NULL,
  point_date    DATE NOT NULL,
  point_amount  DECIMAL(10,2) NOT NULL,
  sponsor_ID    INT NOT NULL,
  points_reason VARCHAR(255) NOT NULL,
  PRIMARY KEY (driver_ID, point_date),
  FOREIGN KEY (driver_ID)
    REFERENCES `User`(user_ID),
  FOREIGN KEY (sponsor_ID)
    REFERENCES `User`(user_ID)
);

-- Order
CREATE TABLE `Order` (
  order_ID     INT NOT NULL AUTO_INCREMENT,
  user_ID      INT NOT NULL,
  order_cost   DECIMAL(10,2) NOT NULL,
  order_date   DATE NOT NULL,
  order_status VARCHAR(50) NOT NULL,
  PRIMARY KEY (order_ID),
  FOREIGN KEY (user_ID)
    REFERENCES `User`(user_ID)
);

-- Order_Item
CREATE TABLE Order_Item (
  order_ID   INT NOT NULL,
  product_ID INT NOT NULL,
  PRIMARY KEY (order_ID, product_ID),
  FOREIGN KEY (order_ID)
    REFERENCES `Order`(order_ID),
  FOREIGN KEY (product_ID)
    REFERENCES Product(product_ID)
);

-- Login
CREATE TABLE Login (
  login_ID     INT NOT NULL AUTO_INCREMENT,
  password_hash  VARCHAR(255) NOT NULL,
  login_date   DATE NOT NULL,
  user_ID      INT NOT NULL,
  login_status VARCHAR(50) NOT NULL,
  PRIMARY KEY (login_ID),
  FOREIGN KEY (user_ID)
    REFERENCES `User`(user_ID)
);

-- PW_Reset
CREATE TABLE PW_Reset (
  pw_reset_ID    INT NOT NULL AUTO_INCREMENT,
  pw_reset_date  DATE NOT NULL,
  user_ID        INT NOT NULL,
  pw_change_type VARCHAR(50) NOT NULL,
  PRIMARY KEY (pw_reset_ID),
  FOREIGN KEY (user_ID)
    REFERENCES `User`(user_ID)
);

-- Notification_Type
CREATE TABLE Notification_Type (
  notification_type_ID     VARCHAR(50) NOT NULL,
  notification_type_method VARCHAR(50) NOT NULL,
  notification_type_group  VARCHAR(50) NOT NULL,
  PRIMARY KEY (notification_type_ID)
);

-- Notification
CREATE TABLE Notification (
  notification_ID      INT NOT NULL AUTO_INCREMENT,
  notification_type_ID VARCHAR(50) NOT NULL,
  notification_date    DATE NOT NULL,
  PRIMARY KEY (notification_ID),
  FOREIGN KEY (notification_type_ID)
    REFERENCES Notification_Type(notification_type_ID)
);

-- Global
CREATE TABLE Global (
  notification_type_ID VARCHAR(50) NOT NULL,
  PRIMARY KEY (notification_type_ID),
  FOREIGN KEY (notification_type_ID)
    REFERENCES Notification_Type(notification_type_ID)
);

-- Group
CREATE TABLE `Group` (
  notification_type_ID VARCHAR(50) NOT NULL,
  user_role            VARCHAR(50) NOT NULL,
  PRIMARY KEY (notification_type_ID),
  FOREIGN KEY (notification_type_ID)
    REFERENCES Notification_Type(notification_type_ID)
);

-- Individual
CREATE TABLE Individual (
  notification_type_ID VARCHAR(50) NOT NULL,
  user_ID              INT NOT NULL,
  PRIMARY KEY (notification_type_ID),
  FOREIGN KEY (notification_type_ID)
    REFERENCES Notification_Type(notification_type_ID),
  FOREIGN KEY (user_ID)
    REFERENCES `User`(user_ID)
);

-- Audit_Log
CREATE TABLE Audit_Log (
  audit_ID     INT NOT NULL AUTO_INCREMENT,
  audit_type   VARCHAR(50) NOT NULL,
  audit_date   DATE NOT NULL,
  user_ID      INT NOT NULL,
  company_ID   INT NULL,
  audit_reason VARCHAR(255) NULL,
  PRIMARY KEY (audit_ID),
  FOREIGN KEY (user_ID)
    REFERENCES `User`(user_ID),
  FOREIGN KEY (company_ID)
    REFERENCES Company(company_ID)
);

-- About_Page
CREATE TABLE About_Page (
  team_num     INT NOT NULL,
  version_num  INT NOT NULL,
  release_date DATE NOT NULL,
  product_name VARCHAR(255) NULL,
  product_desc VARCHAR(255) NULL,
  PRIMARY KEY (version_num)
);
