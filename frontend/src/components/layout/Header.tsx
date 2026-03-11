import { useNavigate } from "react-router-dom";
import { logout } from "../../api/backend";

import {
    HeaderContainer,
    HeaderTitle,
    NavContainer,
    NavButton,
    LogoutButtonHeader
} from "../../ui/Header.styles";
import { useAuth } from "../form/AuthContext.tsx";

export function Header() {
    const navigate = useNavigate();
    const { role } = useAuth();

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <HeaderContainer>
            <HeaderTitle>Krumpi Management System</HeaderTitle>

            <NavContainer>
            {/* --- USER LINKS --- */}
                {role === "USER" && (
                    <>
                        <NavButton to="/products">Menu</NavButton>
                        <NavButton to="/my-products">My Items</NavButton>
                        <NavButton to="/my-orders">History Payments</NavButton>
                        <NavButton to="/my-invoices">My Invoices</NavButton>
                    </>
                )}

                {/* --- RUTE COMUNE (EMPLOYEE & ADMIN) --- */}
                {(role === "EMPLOYEE" || role === "ADMIN") && (
                    <>
                        <NavButton to="/stock">Stock</NavButton>
                        <NavButton to="/orders">All Orders</NavButton>
                        <NavButton to="/client-balance">Clients Balance</NavButton>
                    </>
                )}

                {/* --- EMPLOYEE ONLY LINKS --- */}
                {(role === "EMPLOYEE") && (
                    <>
                        <NavButton to="/my-leaves">My Leaves</NavButton>
                        <NavButton to="/assign-clients">Manage Clients</NavButton>
                    </>
                )}

                {/* --- ADMIN ONLY LINKS --- */}
                {role === "ADMIN" && (
                    <>
                        <NavButton to="/manage-leaves">Manage Leaves</NavButton>
                        <NavButton to="/employees">Employees</NavButton>
                        <NavButton to="/accounts">All Accounts</NavButton>
                        <NavButton to="/account-requests">Account Requests</NavButton>
                    </>
                )}

                <LogoutButtonHeader onClick={handleLogout}>
                    Logout
                </LogoutButtonHeader>
            </NavContainer>
        </HeaderContainer>
    );
}