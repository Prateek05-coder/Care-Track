import React, { useMemo, useState } from 'react';

const Dashboard = ({ patients, fetchPatients }) => {
  // Calculate total patients
  const totalPatients = patients.length;

  // Calculate new patients this month
  const newPatientsThisMonth = useMemo(() => {
    const now = new Date();
    return patients.filter(p => {
      if (!p.createdAt) return false;
      const created = new Date(p.createdAt);
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length;
  }, [patients]);

  // Calculate upcoming appointments
  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    return patients.reduce((count, p) => {
      if (Array.isArray(p.visits)) {
        return count + p.visits.filter(v => new Date(v.date) > now).length;
      }
      return count;
    }, 0);
  }, [patients]);

  // Calculate patients with prescriptions
  const patientsWithPrescriptions = useMemo(() => {
    return patients.filter(p => Array.isArray(p.prescriptions) && p.prescriptions.length > 0).length;
  }, [patients]);

  // Recent Activity: Show the 5 most recent patient additions or edits
  const recentActivity = useMemo(() => {
    // Combine createdAt and updatedAt, sort by most recent, and show top 5
    const activityList = patients
      .map(p => {
        const created = p.createdAt ? new Date(p.createdAt) : null;
        const updated = p.updatedAt ? new Date(p.updatedAt) : null;
        let activityDate = created;
        let activityType = 'Added';
        if (updated && created && updated > created) {
          activityDate = updated;
          activityType = 'Edited';
        }
        return {
          name: `${p.firstName || ''} ${p.lastName || ''}`.trim() || p.name || 'Unnamed Patient',
          activityDate,
          activityType,
        };
      })
      .filter(a => a.activityDate)
      .sort((a, b) => b.activityDate - a.activityDate)
      .slice(0, 5);
    return activityList;
  }, [patients]);

  // Refresh handler
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = async () => {
    setRefreshing(true);
    if (typeof fetchPatients === 'function') {
      await fetchPatients();
    }
    setRefreshing(false);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the CareTrack Patient Management System!</p>
      <p>Here you can manage your patients, view analytics, and adjust settings.</p>
      <div id="dashboardView">
        <div className="analytics-container">
          <div className="analytics-card">
            <h2>Patient Statistics</h2>
            <p>Total Patients: <span id="totalPatients">{totalPatients}</span></p>
            <p>New Patients This Month: <span id="newPatients">{newPatientsThisMonth}</span></p>
            <p>Upcoming Appointments: <span id="upcomingAppointments">{upcomingAppointments}</span></p>
            <p>Patients with Prescriptions: <span id="patientsWithPrescriptions">{patientsWithPrescriptions}</span></p>
            <button
              className="btn btn-primary"
              onClick={handleRefresh}
              disabled={refreshing}
              style={{ marginTop: 16 }}
            >
              {refreshing ? "Refreshing..." : "Refresh Patient Data"}
            </button>
          </div>
          <div className="analytics-card">
            <h2>Recent Activity</h2>
            <div id="recentActivity">
              {recentActivity.length === 0 ? (
                <p>No recent activity</p>
              ) : (
                <ul style={{ paddingLeft: 18 }}>
                  {recentActivity.map((a, idx) => (
                    <li key={idx}>
                      <strong>{a.name}</strong> {a.activityType} on{" "}
                      {a.activityDate.toLocaleDateString()} at {a.activityDate.toLocaleTimeString()}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;