import "./DashBoard.css";
export default function Dashboard() {
  return (
    /* =========================================
   Will be able to add on a new card for every application. Will also be seperated by applications that have been read.
========================================= */
    <div className="dashboard">
      <div className="welcome">
        Application from driverName
        <span className="subtitle">11/12/2026</span>
        <span className="subtitle">Reason:reason</span>
        <span className="subtitle">email: email</span>
      </div>
    </div>
  );
}
