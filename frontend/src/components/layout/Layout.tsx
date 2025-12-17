import { Outlet } from "react-router-dom";
import { Header } from "./Header.tsx";
import { LayoutWrapper, LayoutContent } from "../../ui/Layout.styles.ts";

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
