import { styled } from "@mui/material/styles";
import {Button} from "@mui/material";
import {LinkButton} from "../components/layout/LinkButton.tsx";

export const HeaderContainer = styled("header")(() => ({
    background: "#1F4529",
    padding: "15px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
}));

export const HeaderTitle = styled("h1")(() => ({
    color: "white",
    margin: 0,
    fontSize: "26px",
    fontWeight: 700,
}));

export const NavContainer = styled("nav")(() => ({
    display: "flex",
    gap: "10px",
}));

export const NavButton = styled(LinkButton)(() => ({
    backgroundColor: "#2E7D32",
    fontWeight: 600,
    padding: "6px 16px",
    borderRadius: "8px",
    textTransform: "none",
    color: "white",
    "&:hover": {
        backgroundColor: "#256628",
    },
}));

export const LogoutButtonHeader = styled(Button)(() => ({
    fontWeight: 600,
    padding: "6px 16px",
    borderRadius: "8px",
    color: "white",

    backgroundColor: "#7A1F1F",
    "&:hover": {
        backgroundColor: "#5C1414",
    },
}));