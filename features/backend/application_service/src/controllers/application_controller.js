import * as about_model from '../models/application_model.js';
import { get_company_id_by_name as getCompanyIdFromDB } from '../../../../../shared/lib/storedProcedures.js';

export const post_data = async (req, res) => {
    try {
        const { driver_ID, application_title, company_name } = req.body;

        if (!driver_ID || !application_title || !company_name) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Convert company name to company ID
        let company_ID;
        try {
            company_ID = await getCompanyIdFromDB(company_name);
        } catch (err) {
            return res.status(400).json({ error: `Invalid company: ${err.message}` });
        }

        const result = await about_model.post_application(
            driver_ID, application_title, company_ID
        );

        if (!result) {
            return res.status(500).json({ error: "Failed to create application" });
        }

        res.status(201).json({ 
            message: 'Application submitted successfully',
            user_ID: result.user_ID,
            application_ID: result.application_ID
        });
    } catch (err) {
        console.error('Controller error: ', err.message);
        res.status(500).json({ error: err.message });
    }
};

export const get_company_list = async (req, res) => {
    try {
        const companies = await about_model.get_company_list();
        res.json(companies);
    }
    catch (err) {
        console.error('Controller error: ', err.message);
        res.status(500).json({ error: err.message });
    }
};

export const get_company_id_by_name = async (req, res) => {
    try {
        const { company_name } = req.query;
        if (!company_name) {
            return res.status(400).json({ error: "Missing company_name query parameter" });
        }
        const company_ID = await getCompanyIdFromDB(company_name);
        res.json({ company_ID });
    } catch (err) {
        console.error('Controller error: ', err.message);
        res.status(500).json({ error: err.message });
    }
};