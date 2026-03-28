call add_user( 
'nschnab',
'banana',
'Nolen',
'Schnabel',
'admin',
'000-000-0000',
'nschnab@clemson.edu',
2
);

select * from User;

insert into Company (
    company_name,
    company_contract_start,
    company_region,
    company_phone
) values (
	'Clemson University',
    current_date(),
    'US-East',
    '864-656-0000'
);

call submit_application (
	11,
    'Apply to Company Program',
    1,
    @status_code,
    @application_ID
);

select * from Application;
select * from User;
select * from Company;
select * from Login;
select * from PW_Reset;
select * from Points;
select * from Points_History;
select * from Notification_Type;
select * from Notification;
select * from Product;
select * from Order_Item;

insert into Points values (16, 10);

call get_company_list();

call get_points(16);
call modify_points(
	16,
	10,
	4,
	'Test'
);

insert into Notification_Type (
notification_type_method,
notification_type_group
) values (
	"global",
    "admin"
);



call post_notification (
	"PASSWORD_RESET"
);

ALTER TABLE Product ADD COLUMN product_code VARCHAR(100) NULL UNIQUE;