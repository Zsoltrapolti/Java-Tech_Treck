import { styled } from "@mui/material/styles";
import { Box, Button, Typography } from "@mui/material";

export const UnauthorizedContainer = styled(Box)(() => ({
    width: "100%",
    minHeight: "calc(100vh - 200px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E5F3E5",
}));

export const UnauthorizedCard = styled(Box)(({ theme }) => ({
    maxWidth: "600px",
    width: "100%",
    padding: theme.spacing(6),
    backgroundColor: "#ffffff",
    borderRadius: 16,
    boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(3),
}));

export const UnauthorizedTitle = styled(Typography)(() => ({
    fontSize: "2.5rem",
    fontWeight: 700,
    color: "#a33a32",
    textAlign: "center",
}));

export const UnauthorizedText = styled(Typography)(() => ({
    fontSize: "1.1rem",
    color: "#1c3d2c",
    textAlign: "center",
}));

export const UnauthorizedButton = styled(Button)(() => ({
    marginTop: "12px",
    backgroundColor: "#2C6E49",
    fontWeight: 600,
    padding: "10px 28px",
    borderRadius: 10,
    "&:hover": {
        backgroundColor: "#244d38",
    },
}));
