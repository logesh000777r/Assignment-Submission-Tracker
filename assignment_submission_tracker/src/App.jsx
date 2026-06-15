import React, { useState, useEffect, useMemo } from "react";
import "./App.css";

function App() {
  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem("assignments");
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("All");

  useEffect(() => {
    localStorage.setItem("assignments", JSON.stringify(assignments));
  }, [assignments]);

  const addAssignment = () => {
    if (!title.trim() || !subject.trim() || !dueDate) {
      alert("Please fill all fields");
      return;
    }
    const newAssignment = {
      id: Date.now(),
      title: title.trim(),
      subject: subject.trim(),
      dueDate,
      status: "Pending",
    };
    setAssignments((prev) => [...prev, newAssignment]);
    setTitle("");
    setSubject("");
    setDueDate("");
  };

  const updateStatus = (id, status) =>
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

  const deleteAssignment = (id) =>
    setAssignments((prev) => prev.filter((a) => a.id !== id));

  const subjects = useMemo(
    () => [...new Set(assignments.map((a) => a.subject).filter(Boolean))],
    [assignments]
  );

  const filteredAssignments = assignments
    .filter((a) => filterSubject === "All" || a.subject === filterSubject)
    .filter((a) => a.title.toLowerCase().includes(search.toLowerCase()));

  const counts = useMemo(
    () => ({
      submitted: assignments.filter((a) => a.status === "Submitted").length,
      pending: assignments.filter((a) => a.status === "Pending").length,
      late: assignments.filter((a) => a.status === "Late").length,
      total: assignments.length,
    }),
    [assignments]
  );

  return (
    <div className="app-root container py-5">
      <div className="brand row align-items-center mb-4">
        <div className="col">
          <h1 className="app-title">Assignment Submission Tracker</h1>
          <p className="text-muted small m-0">Track, filter and manage submissions with ease</p>
        </div>
        <div className="col-auto">
          <div className="summary-chip">
            <strong>{counts.total}</strong> total
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="dashboard-card submitted">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">Submitted</h6>
                <h2 className="mb-0">{counts.submitted}</h2>
              </div>
              <div className="status-dot bg-success" />
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="dashboard-card pending">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">Pending</h6>
                <h2 className="mb-0">{counts.pending}</h2>
              </div>
              <div className="status-dot bg-warning" />
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="dashboard-card late">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">Late</h6>
                <h2 className="mb-0">{counts.late}</h2>
              </div>
              <div className="status-dot bg-danger" />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4 mb-4 form-card">
        <h5 className="mb-3">Add Assignment</h5>
        <div className="row g-2 align-items-center">
          <div className="col-md-5">
            <input
              className="form-control"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="col-md-2 d-grid">
            <button className="btn btn-primary" onClick={addAssignment}>
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="row align-items-center mb-3 g-2">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-white"><i className="bi bi-search" /></span>
            <input
              className="form-control"
              placeholder="Search Assignment"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="col-md-6 d-flex justify-content-end">
          <select
            className="form-select w-auto"
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
          >
            <option>All</option>
            {subjects.map((sub) => (
              <option key={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive shadow-sm rounded">
        <table className="table align-middle mb-0">
          <thead className="table-head">
            <tr>
              <th>Title</th>
              <th>Subject</th>
              <th>Due Date</th>
              <th>Status</th>
              <th className="text-end">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredAssignments.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">
                  No Assignments Found
                </td>
              </tr>
            ) : (
              filteredAssignments.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="fw-semibold">{item.title}</div>
                    <div className="small text-muted">ID: {item.id}</div>
                  </td>
                  <td>{item.subject}</td>
                  <td>{item.dueDate}</td>
                  <td style={{ minWidth: 140 }}>
                    <select
                      className={`form-select status-select ${item.status.toLowerCase()}`}
                      value={item.status}
                      onChange={(e) => updateStatus(item.id, e.target.value)}
                    >
                      <option>Pending</option>
                      <option>Submitted</option>
                      <option>Late</option>
                    </select>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => {
                        if (window.confirm("Delete this assignment?")) deleteAssignment(item.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <footer className="mt-4 text-center text-muted small">
        Built for internship project — Assignment Submission Tracker
      </footer>
    </div>
  );
}

export default App;
