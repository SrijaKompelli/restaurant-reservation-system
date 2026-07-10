import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [reservations, setReservations] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadReservations = async (date) => {
    setLoading(true);
    try {
      const { data } = await api.get("/reservations", { params: date ? { date } : {} });
      setReservations(data);
    } catch {
      setError("Could not load reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReservations(); }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    loadReservations(dateFilter);
  };

  const handleClearFilter = () => {
    setDateFilter("");
    loadReservations();
  };

  const handleCancel = async (id) => {
    if (!confirm("Cancel this reservation?")) return;
    try {
      await api.patch(`/reservations/${id}/cancel`);
      loadReservations(dateFilter);
    } catch {
      setError("Could not cancel reservation");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page">
        <section className="card">
          <h2>All reservations — Admin</h2>

          <form className="filter-form" onSubmit={handleFilter}>
            <label>Filter by date</label>
            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
            <button type="submit">Filter</button>
            {dateFilter && <button type="button" className="btn-link" onClick={handleClearFilter}>Clear</button>}
          </form>

          {error && <p className="error-text">{error}</p>}

          {loading ? (
            <p>Loading...</p>
          ) : reservations.length === 0 ? (
            <p className="empty-text">No reservations found.</p>
          ) : (
            <table className="table">
              <thead>
                <tr><th>Customer</th><th>Date</th><th>Time</th><th>Guests</th><th>Table</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r._id}>
                    <td>{r.user?.name} <span className="muted">({r.user?.email})</span></td>
                    <td>{r.date}</td>
                    <td>{new Date(r.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                    <td>{r.guests}</td>
                    <td>#{r.table?.tableNumber} ({r.table?.capacity} seats)</td>
                    <td><span className={`status status-${r.status}`}>{r.status}</span></td>
                    <td>
                      {r.status === "confirmed" && (
                        <button className="btn-link" onClick={() => handleCancel(r._id)}>Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}