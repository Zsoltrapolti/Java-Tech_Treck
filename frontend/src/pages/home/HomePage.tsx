import HomeList from "./HomeList.tsx";
import {
    HomeContainer,
    PageTitle,
    ModulesWrapper
} from "../../ui/HomePage.styles.ts";

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
