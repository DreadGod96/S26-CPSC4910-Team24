
-- USERS
-- 3 Admins, 3 Sponsors, 4 Drivers
INSERT INTO `User`
(user_role, user_join_date, user_username, user_fname, user_lname, user_phone_number, user_email)
VALUES
('ADMIN',   CURDATE(), 'admin1', 'Alice',  'Admin',  '5551110001', 'admin1@team24.com'),
('ADMIN',   CURDATE(), 'admin2', 'Bob',    'Admin',  '5551110002', 'admin2@team24.com'),
('ADMIN',   CURDATE(), 'admin3', 'Cara',   'Admin',  '5551110003', 'admin3@team24.com'),
('SPONSOR', CURDATE(), 'sponsor1', 'Sam', 'Sponsor','5552220001', 'sam@sponsor.com'),
('SPONSOR', CURDATE(), 'sponsor2', 'Sara','Sponsor','5552220002', 'sara@sponsor.com'),
('SPONSOR', CURDATE(), 'sponsor3', 'Steve','Sponsor','5552220003', 'steve@sponsor.com'),
('DRIVER',  CURDATE(), 'driver1', 'Dan',  'Driver', '5553330001', 'dan@driver.com'),
('DRIVER',  CURDATE(), 'driver2', 'Dina', 'Driver', '5553330002', 'dina@driver.com'),
('DRIVER',  CURDATE(), 'driver3', 'Drew', 'Driver', '5553330003', 'drew@driver.com'),
('DRIVER',  CURDATE(), 'driver4', 'Daisy','Driver', '5553330004', 'daisy@driver.com');

-- COMPANIES
INSERT INTO Company
(company_name, company_contract_start, company_region, company_phone, user_ID)
VALUES
('RoadSafe Inc',  CURDATE(), 'East', '8001000001', 4),
('DriveWell LLC', CURDATE(), 'West', '8001000002', 5),
('FleetPro Co',   CURDATE(), 'South','8001000003', 6);

-- Link drivers to companies
UPDATE `User` SET company_ID = 1 WHERE user_ID IN (7,8);
UPDATE `User` SET company_ID = 2 WHERE user_ID IN (9);
UPDATE `User` SET company_ID = 3 WHERE user_ID IN (10);


-- PRODUCTS
INSERT INTO Product
(product_name, product_price, product_desc)
VALUES
('Bluetooth Headset', 49.99, 'Hands-free driving headset'),
('Travel Mug', 19.99, 'Insulated stainless steel mug'),
('Truck GPS', 199.99, 'GPS built for trucks'),
('Seat Cushion', 39.99, 'Ergonomic memory foam cushion'),
('Dash Cam', 129.99, 'HD truck dash cam'),
('Portable Cooler', 89.99, 'Electric truck cooler'),
('Work Gloves', 24.99, 'Heavy-duty gloves'),
('Reflective Jacket', 59.99, 'High visibility jacket'),
('Tool Kit', 149.99, 'Complete roadside tool kit'),
('Fuel Card', 100.00, 'Prepaid fuel card');


-- INVENTORY
INSERT INTO Inventory (product_ID, product_stock)
VALUES
(1,50),(2,100),(3,25),(4,40),(5,30),
(6,20),(7,75),(8,60),(9,15),(10,200);


-- CATALOGS


INSERT INTO Catalog (company_ID, catalog_conversion)
VALUES
(1,0.01),
(2,0.02),
(3,0.015);

-- Each sponsor offers first 5 products
INSERT INTO Catalog_Contains (company_ID, product_ID)
VALUES
(1,1),(1,2),(1,3),(1,4),(1,5),
(2,1),(2,2),(2,3),(2,4),(2,5),
(3,1),(3,2),(3,3),(3,4),(3,5);


-- APPLICATIONS
INSERT INTO Application
(driver_ID, sponsor_ID, application_status, application_reason, application_date)
VALUES
(7,4,'APPROVED','Good driving record',CURDATE()),
(8,4,'APPROVED','Safety compliance',CURDATE()),
(9,5,'APPROVED','On-time delivery',CURDATE()),
(10,6,'PENDING','Under review',CURDATE());


-- POINTS
INSERT INTO Points
(driver_ID, point_date, point_amount, sponsor_ID, points_reason)
VALUES
(7,CURDATE(),500,4,'Safe driving bonus'),
(7,DATE_SUB(CURDATE(), INTERVAL 1 DAY),-100,4,'Late delivery penalty'),
(8,CURDATE(),300,4,'Excellent inspection'),
(9,CURDATE(),450,5,'Accident free month'),
(10,CURDATE(),200,6,'Safety training'),
(7,DATE_SUB(CURDATE(), INTERVAL 2 DAY),250,4,'Fuel efficiency bonus'),
(8,DATE_SUB(CURDATE(), INTERVAL 3 DAY),150,4,'Customer praise'),
(9,DATE_SUB(CURDATE(), INTERVAL 4 DAY),100,5,'Compliance reward'),
(10,DATE_SUB(CURDATE(), INTERVAL 5 DAY),-50,6,'Minor infraction'),
(7,DATE_SUB(CURDATE(), INTERVAL 6 DAY),200,4,'Clean inspection');


-- ORDERS
INSERT INTO `Order`
(user_ID, order_cost, order_date, order_status)
VALUES
(7,200,CURDATE(),'PLACED'),
(8,150,CURDATE(),'SHIPPED'),
(9,100,CURDATE(),'DELIVERED');

INSERT INTO Order_Item (order_ID, product_ID)
VALUES
(1,1),(1,2),
(2,3),
(3,4);


-- LOGIN EVENTS
INSERT INTO Login
(login_date, user_ID, login_status)
VALUES
(CURDATE(),7,'SUCCESS'),
(CURDATE(),8,'SUCCESS'),
(CURDATE(),9,'FAILED'),
(CURDATE(),10,'SUCCESS'),
(CURDATE(),4,'SUCCESS'),
(CURDATE(),5,'SUCCESS'),
(CURDATE(),6,'FAILED'),
(CURDATE(),1,'SUCCESS'),
(CURDATE(),2,'SUCCESS'),
(CURDATE(),3,'SUCCESS');


-- PASSWORD RESETS
INSERT INTO PW_Reset
(pw_reset_date, user_ID, pw_change_type)
VALUES
(CURDATE(),7,'SELF'),
(CURDATE(),8,'ADMIN'),
(CURDATE(),9,'SELF'),
(CURDATE(),10,'SELF'),
(CURDATE(),4,'ADMIN'),
(CURDATE(),5,'SELF'),
(CURDATE(),6,'SELF'),
(CURDATE(),1,'ADMIN'),
(CURDATE(),2,'SELF'),
(CURDATE(),3,'SELF');


-- NOTIFICATION TYPES


INSERT INTO Notification_Type
(notification_type_ID, notification_type_method, notification_type_group)
VALUES
('POINT_CHANGE','EMAIL','DRIVER'),
('ORDER_PLACED','EMAIL','DRIVER'),
('APPLICATION_UPDATE','EMAIL','SPONSOR'),
('SYSTEM_ALERT','SMS','GLOBAL'),
('PASSWORD_RESET','EMAIL','USER'),
('LOGIN_ATTEMPT','EMAIL','USER'),
('ORDER_SHIPPED','EMAIL','DRIVER'),
('ACCOUNT_DROPPED','EMAIL','DRIVER'),
('POINT_DEDUCTION','EMAIL','DRIVER'),
('ADMIN_ALERT','EMAIL','ADMIN');


-- NOTIFICATIONS
INSERT INTO Notification
(notification_type_ID, notification_date)
VALUES
('POINT_CHANGE',CURDATE()),
('ORDER_PLACED',CURDATE()),
('APPLICATION_UPDATE',CURDATE()),
('SYSTEM_ALERT',CURDATE()),
('PASSWORD_RESET',CURDATE()),
('LOGIN_ATTEMPT',CURDATE()),
('ORDER_SHIPPED',CURDATE()),
('ACCOUNT_DROPPED',CURDATE()),
('POINT_DEDUCTION',CURDATE()),
('ADMIN_ALERT',CURDATE());


-- GLOBAL / GROUP / INDIVIDUAL
INSERT INTO Global VALUES ('SYSTEM_ALERT');

INSERT INTO `Group`
(notification_type_ID, user_role)
VALUES
('POINT_CHANGE','DRIVER'),
('ORDER_PLACED','DRIVER'),
('APPLICATION_UPDATE','SPONSOR'),
('ADMIN_ALERT','ADMIN');

INSERT INTO Individual
(notification_type_ID, user_ID)
VALUES
('PASSWORD_RESET',7),
('LOGIN_ATTEMPT',8),
('ORDER_SHIPPED',9),
('ACCOUNT_DROPPED',10);


-- AUDIT LOG
INSERT INTO Audit_Log
(audit_type, audit_date, user_ID, company_ID, audit_reason)
VALUES
('LOGIN',CURDATE(),7,1,'Successful login'),
('POINT_CHANGE',CURDATE(),7,1,'Bonus awarded'),
('ORDER_PLACED',CURDATE(),7,1,'Order submitted'),
('APPLICATION_APPROVED',CURDATE(),8,1,'Approved by sponsor'),
('PASSWORD_RESET',CURDATE(),9,NULL,'User initiated reset'),
('LOGIN_FAILED',CURDATE(),9,NULL,'Incorrect password'),
('ORDER_SHIPPED',CURDATE(),8,1,'Order shipped'),
('POINT_DEDUCTION',CURDATE(),10,3,'Penalty applied'),
('ADMIN_ACTION',CURDATE(),1,NULL,'Manual adjustment'),
('SYSTEM_ALERT',CURDATE(),1,NULL,'System check');


-- ABOUT PAGE
/*
INSERT INTO About_Page
(team_num, version_num, release_date, product_name, product_desc)
VALUES
(24,1,CURDATE(),'Truck Incentive System','Initial release'),
(24,2,CURDATE(),'Truck Incentive System','Sprint 2 updates'),
(24,3,CURDATE(),'Truck Incentive System','Notification improvements'),
(24,4,CURDATE(),'Truck Incentive System','Order system'),
(24,5,CURDATE(),'Truck Incentive System','Audit logging'),
(24,6,CURDATE(),'Truck Incentive System','Inventory tracking'),
(24,7,CURDATE(),'Truck Incentive System','Catalog features'),
(24,8,CURDATE(),'Truck Incentive System','Security updates'),
(24,9,CURDATE(),'Truck Incentive System','Performance improvements'),
(24,10,CURDATE(),'Truck Incentive System','Final sprint');
*/
/*
INSERT INTO About_Page (
  team_num,
  version_num,
  release_date,
  product_name,
  product_desc
)
VALUES (
  24,
  2,
  CURDATE(),
  'Good truck driving incentive program',
  'To make driving fun :) (Will add real desc later)'
);
*/