import React, { useState, useEffect } from 'react';
import './AuditLog.css';

const AuditLog = () => {
    const [logs, setLogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [loading, setLoading] = useState(false);

    // Manual CSV Download Logic (No extra libraries needed)
    const downloadCSV = () => {
        const headers = ["Date", "User", "Category", "Action", "Details"];
        const rows = logs.map(log => [
            new Date(log.timestamp).toLocaleString(),
            log.user_email,
            log.category,
            log.action_type,
            log.action_desc
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "TigerPoints_Audit_Log.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="dashboard-page">
            <div className="audit-wrapper">
                {/* Header matches your Welcome banner */}
                <div className="welcome">
                    Audit Trail & System Logs
                    <span className="subtitle">Security Monitoring & Activity Tracking</span>
                </div>

                {/* Filter Section styled like your Cards */}
                <div className="audit-controls-card">
                    <div className="control-group">
                        <label className="card-sub">Search Activity</label>
                        <input 
                            type="text" 
                            className="audit-input"
                            placeholder="Search by email or action..." 
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="control-group">
                        <label className="card-sub">Filter Category</label>
                        <select className="audit-select" onChange={(e) => setFilterCategory(e.target.value)}>
                            <option value="all">All Activities</option>
                            <option value="LOGIN">Login Attempts</option>
                            <option value="POINTS">Point Changes</option>
                            <option value="PASSWORD">Password Changes</option>
                            <option value="APPLICATION">Driver Applications</option>
                        </select>
                    </div>
                    <button className="download-btn" onClick={downloadCSV}>
                        Download CSV Report
                    </button>
                </div>

                {/* Data Table Area */}
                <div className="table-container">
                    <table className="audit-table">
                        <thead>
                            <tr>
                                <th>Date & Time</th>
                                <th>User</th>
                                <th>Category</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Sample row to show styling */}
                            <tr>
                                <td className="font-verdana">04/05/2026 15:30</td>
                                <td className="card-label">admin@clemson.edu</td>
                                <td><span className="badge category-badge">PASSWORD</span></td>
                                <td className="card-sub">Manual password reset for user ID 48</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AuditLog;