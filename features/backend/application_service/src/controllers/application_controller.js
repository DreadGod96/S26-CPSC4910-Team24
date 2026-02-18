import * as about_model from '../models/application_model.js';

export const post_data = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, application_title, company_ID } = req.body;

        if (!first_name || !last_name || !email || !phone || !application_title || !company_ID) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await about_model.create_user_and_submit_application(
            first_name, 
            last_name, 
            email, 
            phone, 
            application_title, 
            company_ID
        );

        res.status(201).json({ 
            message: 'User created and application submitted successfully',
            user_ID: result.user_ID,
            application_ID: result.application_ID
        });
    } catch (err) {
        console.error('Controller error: ', err.message);
        res.status(500).json({ error: err.message });
    }
};