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
                        <NavButton to="/products">All Products</NavButton>

                        <NavButton to="/my-products">My Shopping Cart</NavButton>

                        <NavButton to="/create-order">New Order</NavButton>

                        <NavButton to="/my-orders">My Orders</NavButton>
                    </>
                )}

                {/* --- EMPLOYEE / ADMIN LINKS --- */}
                {(role === "EMPLOYEE" || role === "ADMIN") && (
                    <NavButton to="/stock">Stock</NavButton>
                )}

                {role === "ADMIN" && (
                    <>
                        <NavButton to="/employees">Employees</NavButton>
                        <NavButton to="/orders">All Orders</NavButton>
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