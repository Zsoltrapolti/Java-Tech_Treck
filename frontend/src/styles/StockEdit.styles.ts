import { styled } from "@mui/material/styles";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";

export const EditContainer = styled(Box)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#E0ECD6",
}));

export const EditCard = styled(Paper)(({ theme }) => ({
    width: 400,
    padding: theme.spacing(4),
    borderRadius: 16,
    boxShadow: theme.shadows[6],
    backgroundColor: "#d5e3ca",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
}));

export const EditTitle = styled(Typography)(({ theme }) => ({
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "#2C6E49",
    textAlign: "center",
    marginBottom: theme.spacing(2),
}));

export const EditLabel = styled(Typography)(() => ({
    fontWeight: 600,
    color: "#0d4627",
}));

export const EditInput = styled(TextField)(() => ({
    backgroundColor: "#edf5e9",
    borderRadius: 8,
}));

export const SaveButton = styled(Button)(({ theme }) => ({
    backgroundColor: "#2C6E49",
    "&:hover": { backgroundColor: "#244d38" },
    marginTop: theme.spacing(2),
}));

export const BackButton = styled(Button)(() => ({
    backgroundColor: "#2C6E49",
    "&:hover": { backgroundColor: "#244d38" },
}));


export const EditSelect = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    backgroundColor: "#edf5e9",
    borderRadius: "8px",
    "& .MuiInputBase-root": {
        paddingRight: theme.spacing(1),
    },
}));