import { styled } from "@mui/material/styles";
import { Paper, Box, Button, TextField, Typography } from "@mui/material";


export const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: "#E5F3E5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
}));


export const LoginCard = styled(Paper)(({ theme }) => ({
  width: "620px",
  height: "620px",
  padding: theme.spacing(4),
  borderRadius: 12,
  backgroundColor: "#f4f8f0",
  boxShadow: "0px 2px 12px rgba(0,0,0,0.12)",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  alignItems: "center",
  justifyContent: "center",
}));


export const LoginTitle = styled(Typography)(() => ({
  fontSize: "2.2rem",
  fontWeight: 700,
  color: "#2C6E49",
  textAlign: "center",
  marginBottom: "8px",
}));

export const LoginSubtitle = styled(Typography)(() => ({
  fontSize: "1rem",
  color: "#1c3d2c",
  textAlign: "center",
  marginBottom: "25px",
}));


export const FieldLabel = styled(Typography)(() => ({
  fontWeight: 600,
  fontSize: "1rem",
  color: "#1c3d2c",
  marginBottom: "4px",
}));


export const StyledTextField = styled(TextField)(() => ({
  backgroundColor: "#ffffff",
  borderRadius: 8,
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#b6c9b4" },
    "&.Mui-focused fieldset": { borderColor: "#2C6E49" },
  },
}));


export const StyledButton = styled(Button)(() => ({
  backgroundColor: "#2C6E49",
  color: "#fff",
  fontWeight: 600,
  padding: "8px 22px",
  borderRadius: 8,
  "&:hover": { backgroundColor: "#244d38" },
  marginTop: "25px",
}));


export const ErrorText = styled(Typography)(() => ({
  color: "#a33a32",
  textAlign: "center",
  fontWeight: 600,
  marginTop: "4px",
}));

export const LoginForm = styled("form")(() => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
}));