import { styled } from "@mui/material/styles";
import { Paper, Box, Button, TextField, Typography } from "@mui/material";

export const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: "#E0ECD6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(3),
}));

export const LoginCard = styled(Paper)(({ theme }) => ({
  maxWidth: 540,
  width: "100%",
  padding: theme.spacing(5),
  borderRadius: 20,
  backgroundColor: "#d5e3ca",
  boxShadow: theme.shadows[10],
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  alignItems: "stretch",
}));

export const LoginTitle = styled(Typography)(() => ({
  color: "#2C6E49",
  fontWeight: 700,
  textAlign: "center",
}));

export const LoginSubtitle = styled(Typography)(() => ({
  color: "#2C6E49",
  textAlign: "center",
}));

export const FieldLabel = styled(Typography)(() => ({
  color: "#2C6E49",
  fontWeight: 600,
  fontSize: "0.95rem",
}));

export const StyledTextField = styled(TextField)(() => ({
  "& .MuiInputBase-root": {
    backgroundColor: "#edf5e9",
    borderRadius: 10,
    color: "#072d18",
  },
  "& .MuiInputLabel-root": {
    color: "#E0ECD6",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#E0ECD6",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#E0ECD6",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#E0ECD6",
  },
}));

export const StyledButton = styled(Button)(() => ({
  color: "#E0ECD6",
  fontWeight: 700,
  backgroundColor: "#2C6E49",
  "&:hover": { backgroundColor: "#244d38" },
}));

export const ErrorText = styled(Typography)(() => {
  return ({
    color: "#9d2626",
    textAlign: "center",
    fontSize: "1rem",
  });
});
