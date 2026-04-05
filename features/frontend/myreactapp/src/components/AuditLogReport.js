import React, { useState, useEffect } from 'react';
import { CSVLink } from "react-csv"; // Standard library for CSV downloads

const AuditLogReport = ({ userRole, sponsorId }) => {
    const [logs, setLogs] = useState([]);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        category: 'all',
        targetSponsor: sponsorId || 'all' // Admin can toggle this
    });

    // Fetch logic

    return (
        <div className="report-container">
            <div className="report-header">
                <h2>{userRole === 'ADMIN' ? 'Global' : 'Sponsor'} Audit Log</h2>
                <CSVLink data={logs} filename="audit_log.csv" className="download-btn">
                    Download CSV
                </CSVLink>
            </div>

            <div className="filter-bar">
                <input type="date" onChange={(e) => setFilters({...filters, startDate: e.target.value})} />
                <input type="date" onChange={(e) => setFilters({...filters, endDate: e.target.value})} />
                <select onChange={(e) => setFilters({...filters, category: e.target.value})}>
                    <option value="all">All Categories</option>
                    <option value="APPLICATION">Driver Applications</option>
                    <option value="POINTS">Point Changes</option>
                    <option value="PASSWORD">Password Changes</option>
                    <option value="LOGIN">Login Attempts</option>
                </select>
            </div>

            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>User</th>
                        <th>Category</th>
                        <th>Status/Value</th>
                        <th>Reason</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Map through logs here */}
                </tbody>
            </table>
        </div>
    );
};