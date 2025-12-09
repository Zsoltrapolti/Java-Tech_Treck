import AppInformation from '../components/AppInformation';
import ModuleList from '../components/ModuleList.tsx';
import { HomeContainer, PageTitle, LogoutButton } from "../styles/HomePage.styles.ts";
import { logout } from "../api/backend";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <HomeContainer>
            <LogoutButton variant="contained" onClick={handleLogout}>
                LOGOUT
            </LogoutButton>

            <PageTitle>Home</PageTitle>
            <AppInformation />
            <ModuleList />
        </HomeContainer>
    );
}
