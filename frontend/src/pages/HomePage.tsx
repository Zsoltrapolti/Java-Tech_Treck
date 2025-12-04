import AppInformation from '../components/AppInformation'
import ModuleList from '../components/ModuleList.tsx'
import {HomeContainer, PageTitle} from "../styles/HomePage.styles.ts";

export default function HomePage() {
    return (
        <HomeContainer>
            <PageTitle>Home</PageTitle>
            <AppInformation />
            <ModuleList />
        </HomeContainer>
    )
}
