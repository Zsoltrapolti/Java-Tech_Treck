import { useNavigate } from "react-router-dom";
import { logout } from "../api/backend";
import {
    HeaderContainer,
    HeaderTitle,
    NavContainer,
    NavButton,
    LogoutButtonHeader
} from "../styles/Header.styles";

export function Header() {
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <HeaderContainer>
            <HeaderTitle>Krumpi Management System</HeaderTitle>

            <NavContainer>
                <NavButton variant="contained" onClick={() => navigate("/home")}>Home</NavButton>
                <NavButton variant="contained" onClick={() => navigate("/stock")}>Stock</NavButton>
                <NavButton variant="contained" onClick={() => navigate("/employees")}>Employees</NavButton>
                <NavButton variant="contained" onClick={() => navigate("/orders")}>Orders</NavButton>

                <LogoutButtonHeader variant="contained" onClick={handleLogout}>
                    Logout
                </LogoutButtonHeader>
            </NavContainer>
        </HeaderContainer>
    );
}
