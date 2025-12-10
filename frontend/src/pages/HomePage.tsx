import HomeList from "../components/HomeList.tsx";
import {
    HomeContainer,
    PageTitle,
    ModulesWrapper
} from "../styles/HomePage.styles";

export default function HomePage() {
    return (
        <HomeContainer>
            <PageTitle>
                Home
            </PageTitle>

            <ModulesWrapper>
                <HomeList />
            </ModulesWrapper>

        </HomeContainer>
    );
}
