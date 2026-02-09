use Team24_DB_DEV;

drop procedure if exists add_user;
delimiter $$
create procedure add_user(
	in input_username varchar(30),
	in input_user_fname varchar(30),
	in input_user_lname varchar(30),
	in input_user_role varchar(30),
	in input_user_join_date date,
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
        input_user_join_date,
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