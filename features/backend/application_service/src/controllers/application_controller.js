import * as about_model from '../models/application_model.js';

//move data from sql query into a new object for use with the router
export const post_data = async (req, res) => {
    try {
        const { driver_ID, application_title, company_ID } = req.body;
        const data_fields = await about_model.post_application(driver_ID, application_title, company_ID);

        if (!data_fields) { 
            return res.status(404).json({ message: 'Error in application controller' });
        }

        res.status(200).json(data_fields);
    } catch (err) {
        console.error('Controller error: ', err.message);
        res.status(500).json({ error: "Error pulling data from RDS" });
    }
};
