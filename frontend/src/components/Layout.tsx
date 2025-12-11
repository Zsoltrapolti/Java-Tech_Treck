import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { LayoutWrapper, LayoutContent } from "../styles/Layout.styles";

export default function Layout() {
    return (
        <LayoutWrapper>
            <Header />

            <LayoutContent>
                <Outlet />
            </LayoutContent>
        </LayoutWrapper>
    );
}
