import { styled } from "@mui/material/styles";
import { TableCell, Button, Box } from "@mui/material";

export const ModulePageContainer = styled(Box)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    minHeight: "80vh",
    maxWidth: "100%",
}));

export const ModulePageHeader = styled("div")(() => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    margin: "0 auto 20px",
    color: "#2C6E49",
    fontWeight: 700,
    fontSize: "2.5rem",
}));


export const ModuleTableContainer = styled(Box)(({ theme }) => ({
    width: "1000px",
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

export const ModuleTableHeader = styled(TableCell)(() => ({
    fontWeight: 700,
    backgroundColor: "#2C6E49",
    color: "#E0ECD6",
    position: "sticky",
    top: 0,
    zIndex: 10,
}));

export const ModuleTableCell = styled(TableCell)(() => ({
    fontWeight: 500,
    color: "#072d18",
    fontSize: "1rem",
    backgroundColor: "#eef3ea",
}));

export const EditButton = styled(Button)(() => ({
    fontWeight: 600,
    padding: "6px 16px",
    borderRadius: "8px",
    backgroundColor: "#1b7944",
    "&:hover": {
        backgroundColor: "#256628",
    },
    color: "#ffffff",
}));

export const DeleteButton = styled(Button)(() => ({
    fontWeight: 600,
    padding: "6px 16px",
    borderRadius: "8px",
    backgroundColor: "#c0392b",
    "&:hover": {
        backgroundColor: "#922b21",
    },
    color: "#ffffff",
}));

export const AddButton = styled(Button)(() => ({
    fontWeight: 600,
    padding: "6px 16px",
    borderRadius: "8px",
    backgroundColor: "#1b7944",
    "&:hover": {
        backgroundColor: "#135229",
    },
    color: "#ffffff",
}));
