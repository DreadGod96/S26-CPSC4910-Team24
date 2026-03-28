drop procedure if exists add_user;
delimiter $$
create procedure add_user(
	in input_username varchar(30),
    in input_password varchar(255),
	in input_user_fname varchar(30),
	in input_user_lname varchar(30),
	in input_user_role varchar(30),
	in input_user_phone varchar(30),
	in input_user_email varchar(30),
	in input_company_ID int)
begin
	insert into User (
		user_role,
        user_join_date,
        company_ID,
        user_username,
        user_fname,
        user_lname,
        user_phone_number,
        user_email
    ) values (
		input_user_role,
        current_date(),
        input_company_ID,
        input_username,
        input_user_fname,
        input_user_lname,
        input_user_phone,
        input_user_email
    );
    
    insert into Login (
		login_date,
        user_ID,
        password_hash,
        login_status
    ) values (
		current_date(),
		LAST_INSERT_ID(),
        input_password,
        'SUCCESS'
    );
end $$
delimiter ;

-- Submit Application
-- Input: driver ID, application title, company id
-- Adds a record to the applications table with the drivers id and attach a sponsor to the application
-- Return: 1 OK, 2 Invalid driver_ID, 3 invalid company_ID
drop procedure if exists submit_application;
delimiter $$
create procedure submit_application(
	in input_driver_id int,
    in input_application_title varchar(30),
    in input_company_ID int,
    out status_code int,
    out out_application_ID int
) submit_app: begin
	-- declare sponsor temp var
	declare input_sponsor_id int;
    
    -- Verification Vars
    declare driver_exists int;
    declare sponsor_exists int;
    declare company_exists int;
    
	-- set initial status code assume it works
    set status_code = 1;
    
	-- test company
    select count(*)
    into company_exists
    from Company
    where company_ID = input_company_id;
    if company_exists = 0 then
		set status_code = 4;
        leave submit_app;
	end if;
    
	-- test driver
    select count(*)
    into driver_exists
    from User
    where user_ID = input_driver_id and user_role like 'dr%';
    if driver_exists = 0 then
		set status_code = 2;
        leave submit_app;
	end if;
    
    -- Get sponsor id from company table
    select user_ID into input_sponsor_id from Company where company_ID = input_company_ID limit 1;
    
	insert into Application (
		driver_ID,
        sponsor_ID,
        application_status,
        application_date,
        application_name
    ) values (
		input_driver_id,
        input_sponsor_ID,
        'Submitted',
        current_date(),
        input_application_title
    );
    set out_application_ID = LAST_INSERT_ID();
end $$
delimiter ;

DELIMITER $$
DROP PROCEDURE IF EXISTS get_company_list$$
CREATE PROCEDURE get_company_list()
BEGIN
    SELECT company_name FROM Company;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS get_company_id_by_name$$
CREATE PROCEDURE get_company_id_by_name(
	in input_company_name varchar(30)
)
BEGIN
    SELECT company_ID FROM Company where company_name like input_company_name limit 1;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS get_points$$
CREATE PROCEDURE get_points(
	in input_driver_ID int
)
begin
	select * from Points where driver_ID = input_driver_ID;
end$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS modify_points$$
CREATE PROCEDURE modify_points(
	in input_driver_ID int,
    in input_point_amount decimal,
    in input_sponsor_ID int,
    in input_points_reason varchar(30)
)
begin
	insert into Points_History (
		driver_ID,
		point_date,
		point_amount,
		sponsor_ID,
		points_reason
    )values(
		input_driver_ID,
		current_time(),
		input_point_amount,
		input_sponsor_ID,
		input_points_reason
    );
end$$
DELIMITER ;


DELIMITER $$
drop trigger if exists trg_points_history_update;
CREATE TRIGGER trg_points_history_update
AFTER INSERT ON Points_History
FOR EACH ROW
BEGIN
    UPDATE Points
    SET point_amount = point_amount + NEW.point_amount
    WHERE driver_ID = NEW.driver_ID;
END$$
DELIMITER ;


DELIMITER $$
DROP PROCEDURE IF EXISTS post_notification;
CREATE PROCEDURE post_notification(
	in input_notification_type_ID varchar(50)
)begin
	insert into Notification (
    notification_type_ID, 
    notification_date
    ) values (
    input_notification_type_ID, 
    current_date()
    );
end $$
DELIMITER ;
-- ─────────────────────────────────────────────────────────────────────────────
-- Dominos Catalog Sync & Order Recording
-- Run the ALTER TABLE once to add product_code to Product.
-- The three procedures below handle syncing and order recording.
-- ─────────────────────────────────────────────────────────────────────────────

-- upsert_product
-- Called once per item during a catalog sync.
-- Inserts new products; updates name, price, and description if the code already exists.
DROP PROCEDURE IF EXISTS upsert_product;
DELIMITER $$
CREATE PROCEDURE upsert_product(
    IN in_code  VARCHAR(100),
    IN in_name  VARCHAR(255),
    IN in_price DECIMAL(10,2),
    IN in_desc  TEXT
)
BEGIN
    INSERT INTO Product (product_code, product_name, product_price, product_desc)
    VALUES (in_code, in_name, in_price, in_desc)
    ON DUPLICATE KEY UPDATE
        product_name  = VALUES(product_name),
        product_price = VALUES(product_price),
        product_desc  = VALUES(product_desc);
END$$
DELIMITER ;

-- create_order
-- Inserts a row into the Order table and returns the new order_ID via OUT parameter.
DROP PROCEDURE IF EXISTS create_order;
DELIMITER $$
CREATE PROCEDURE create_order(
    IN  in_user_ID INT,
    IN  in_cost    DECIMAL(10,2),
    IN  in_status  VARCHAR(50),
    OUT out_order_ID INT
)
BEGIN
    INSERT INTO `Order` (user_ID, order_cost, order_date, order_status)
    VALUES (in_user_ID, in_cost, CURRENT_DATE(), in_status);
    SET out_order_ID = LAST_INSERT_ID();
END$$
DELIMITER ;

-- add_order_item
-- Resolves a Dominos product_code to its product_ID and inserts into Order_Item.
-- Silently skips if the product_code is not found in Product (no sync yet).
DROP PROCEDURE IF EXISTS add_order_item;
DELIMITER $$
CREATE PROCEDURE add_order_item(
    IN in_order_ID    INT,
    IN in_product_code VARCHAR(100)
)
BEGIN
    DECLARE v_product_ID INT DEFAULT NULL;

    SELECT product_ID INTO v_product_ID
    FROM Product
    WHERE product_code = in_product_code
    LIMIT 1;

    IF v_product_ID IS NOT NULL THEN
        INSERT IGNORE INTO Order_Item (order_ID, product_ID)
        VALUES (in_order_ID, v_product_ID);
    END IF;
END$$
DELIMITER ;
