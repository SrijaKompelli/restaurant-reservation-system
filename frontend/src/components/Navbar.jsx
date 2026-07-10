import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <span className="brand">Table Reserve</span>
      {user && (
        <div className="nav-right">
          <span className="nav-user">{user.name} · {user.role}</span>
          <button className="btn-link" onClick={handleLogout}>Log out</button>
        </div>
      )}
    </nav>
  );
}