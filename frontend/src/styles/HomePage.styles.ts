import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const HomeContainer = styled(Box)(({ theme }) => ({
    width: "100%",
    maxWidth: "1100px",
    margin: "0 auto",
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
}));

export const PageTitle = styled("h1")(() => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "0 auto 20px",
    color: "#2C6E49",
    fontWeight: 700,
    fontSize: "3rem",
}));

export const ModulesWrapper = styled(Box)(({ theme }) => ({
    width: "100%",
    maxWidth: "900px",
    marginTop: theme.spacing(4),
}));


export const ModulesTableContainer = styled(Box)(({ theme }) => ({
    width: "100%",
    maxHeight: "506px",
    overflowY: "auto",
    marginTop: theme.spacing(2),
    borderRadius: 10,
    border: "1px solid #d9e5d3",
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",

    "&::-webkit-scrollbar": { width: 8 },
    "&::-webkit-scrollbar-thumb": {
        background: "#b0c4a0",
        borderRadius: 8,
    },
    "&::-webkit-scrollbar-thumb:hover": {
        background: "#8fa982",
    }
}));

