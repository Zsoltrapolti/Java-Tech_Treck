import { useNavigate } from "react-router-dom";
import { getUserRole, logout } from "../../api/backend";

import {
    HeaderContainer,
    HeaderTitle,
    NavContainer,
    NavButton,
    LogoutButtonHeader
} from "../../ui/Header.styles";

export function Header() {
    const navigate = useNavigate();
    const role = getUserRole();

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <HeaderContainer>
            <HeaderTitle>Krumpi Management System</HeaderTitle>

            <NavContainer>
                <NavButton to="/products">Products</NavButton>

                {(role === "EMPLOYEE" || role === "ADMIN") && (
                    <NavButton to="/stock">Stock</NavButton>
                )}

                {role === "ADMIN" && (
                    <>
                        <NavButton to="/employees">Employees</NavButton>
                        <NavButton to="/orders">Orders</NavButton>
                    </>
                )}

                <LogoutButtonHeader onClick={handleLogout}>
                    Logout
                </LogoutButtonHeader>
            </NavContainer>
        </HeaderContainer>
    );
}
