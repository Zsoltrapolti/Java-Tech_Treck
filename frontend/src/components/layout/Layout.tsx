import { Outlet, useNavigate } from "react-router-dom";
import { logout } from "../../api/backend";
import { useAuth } from "../form/AuthContext";

export default function Layout() {
    const { role } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="app-container">
            <nav className="navbar">
                <h1>Krumpi Management</h1>
                <div className="nav-links">
                    {/* Role-based navigation links */}
                   {role === "USER" && (
                       <>
                           <button onClick={() => navigate("/products")}>All Menu</button>
                           <button onClick={() => navigate("/my-products")}>My Selection</button>
                       </>
                   )}
                    {(role === "EMPLOYEE" || role === "ADMIN") && <button onClick={() => navigate("/stock")}>Stock</button>}
                    {role === "ADMIN" && <button onClick={() => navigate("/employees")}>Employees</button>}
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </nav>
            <main className="content">
                <Outlet />
            </main>
        </div>
    );
}

