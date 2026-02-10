call add_user( 
'nschnab',
'Nolen',
'Schnabel',
'admin',
current_date(),
'000-000-0000',
'nschnab@clemson.edu',
1,
@user_ID
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
	1,
    'Apply to Company Program',
    1,
    @status_code,
    @application_ID
);

select * from Application;