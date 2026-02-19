use Team24_DB_DEV;

drop procedure if exists add_user;
delimiter $$
create procedure add_user(
	in input_username varchar(30),
	in input_user_fname varchar(30),
	in input_user_lname varchar(30),
	in input_user_role varchar(30),
	in input_user_phone varchar(30),
	in input_user_email varchar(30),
	in input_company_ID int,
	out out_user_ID int)
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
    set out_user_ID = LAST_INSERT_ID();
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
    select sponsor_ID into input_sponsor_id from Company where company_ID = input_company_ID limit 1;
    
	insert into Application (
		driver_ID,
        sponsor_ID,
        application_status,
        application_date,
        application_title
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