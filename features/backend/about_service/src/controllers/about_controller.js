import * as about_model from '../models/about_model.js';

//move data from sql query into a new object for use with the router
export const get_data_row = async (req, res) => {
    try {
        const data_fields = about_model.get_about_data();

        if (!data_fields) { 
            return res.status(404).json('There are no entries');
        }

        res.status(200).json(data_fields);
    } catch (err) {
        console.error('Controller error: ', err.message);
        res.status(500).json({ error: "Error pulling data from RDS" });
    }
};
