import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function CustomerDashboard() {
  const [reservations, setReservations] = useState([]);
  const [form, setForm] = useState({ date: "", time: "", guests: 2 });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/reservations/my");
      setReservations(data);
    } catch {
      setError("Could not load your reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReservations(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const startTime = new Date(`${form.date}T${form.time}`);
      await api.post("/reservations", {
        guests: Number(form.guests),
        date: form.date,
        startTime,
      });
      setMessage("Reservation confirmed!");
      setForm({ date: "", time: "", guests: 2 });
      loadReservations();
    } catch (err) {
      setError(err.response?.data?.message || "Could not book that slot");
    }
  };

  const handleCancel = async (id) => {
    if (!confirm("Cancel this reservation?")) return;
    try {
      await api.patch(`/reservations/${id}/cancel`);
      loadReservations();
    } catch {
      setError("Could not cancel reservation");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page">
        <section className="card">
          <h2>Book a table</h2>
          {message && <p className="success-text">{message}</p>}
          {error && <p className="error-text">{error}</p>}
          <form className="reservation-form" onSubmit={handleSubmit}>
            <label>Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} required />
            <label>Time</label>
            <input type="time" name="time" value={form.time} onChange={handleChange} required />
            <label>Guests</label>
            <input type="number" name="guests" min="1" value={form.guests} onChange={handleChange} required />
            <button type="submit">Reserve table</button>
          </form>
        </section>

        <section className="card">
          <h2>Your reservations</h2>
          {loading ? (
            <p>Loading...</p>
          ) : reservations.length === 0 ? (
            <p className="empty-text">No reservations yet — book one above.</p>
          ) : (
            <table className="table">
              <thead>
                <tr><th>Date</th><th>Time</th><th>Guests</th><th>Table</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r._id}>
                    <td>{r.date}</td>
                    <td>{new Date(r.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                    <td>{r.guests}</td>
                    <td>#{r.table?.tableNumber}</td>
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