import { styled } from "@mui/material/styles";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";

export const EditContainer = styled(Box)(({ theme }) => ({
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
}));

export const EditCard = styled(Paper)(({ theme }) => ({
    width: "700px",
    padding: theme.spacing(4),
    borderRadius: 12,
    boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#f4f8f0",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(3),
}));

export const EditTitle = styled(Typography)(() => ({
    fontSize: "2rem",
    fontWeight: 700,
    color: "#2C6E49",
    textAlign: "center",
    marginBottom: "2px",
}));

export const EditLabel = styled(Typography)(() => ({
    fontWeight: 600,
    color: "#1c3d2c",
    marginLeft: "4px",
}));

export const EditInput = styled(TextField)(() => ({
    width: "100%",
    marginBottom: "8px",
    "& .MuiInputBase-root": {
        backgroundColor: "#ffffff",
        borderRadius: 8,
    },
    "& .MuiOutlinedInput-root fieldset": {
        borderColor: "#b6c9b4",
    },
    "& .MuiOutlinedInput-root:hover fieldset": {
        borderColor: "#90a88e",
    },
    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
        borderColor: "#2C6E49",
        borderWidth: "2px",
    },
}));


export const EditSelect = styled(TextField)(() => ({
    width: "100%",
    marginBottom: "12px",
    "& .MuiInputBase-root": {
        backgroundColor: "#ffffff",
        borderRadius: 8,
    },
    "& .MuiOutlinedInput-root fieldset": {
        borderColor: "#b6c9b4",
    },
    "& .MuiOutlinedInput-root:hover fieldset": {
        borderColor: "#90a88e",
    },
    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
        borderColor: "#2C6E49",
        borderWidth: "2px",
    },
}));


export const SaveButton = styled(Button)(() => ({
    fontWeight: 600,
    padding: "6px 16px",
    borderRadius: "8px",
    backgroundColor: "#1b7944",
    "&:hover": {
        backgroundColor: "#135229",
    },
    color: "#ffffff",
}));

export const BackButton = styled(Button)(() => ({
    fontWeight: 600,
    padding: "6px 16px",
    borderRadius: "8px",
    backgroundColor: "#c0392b",
    "&:hover": {
        backgroundColor: "#922b21",
    },
    color: "#ffffff",
}));

export const FormActionsWrapper = styled("div")(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    marginTop: theme.spacing(2),
}));

export const AddItemButton = styled(Button)(() => ({
    fontWeight: 600,
    padding: "6px 16px",
    borderRadius: "8px",
    backgroundColor: "#1b7944",
    "&:hover": {
        backgroundColor: "#135229",
    },
    color: "#ffffff",
}));


export const OrderItemRow = styled(Box)(({ theme }) => ({
    display: "flex",
    gap: theme.spacing(2),
    alignItems: "center",
    marginBottom: theme.spacing(1),
}));
