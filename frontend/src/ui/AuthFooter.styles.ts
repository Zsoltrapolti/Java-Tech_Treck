import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

export const AuthFooterContainer = styled("div")(({ theme }) => ({
    marginTop: theme.spacing(3),
    textAlign: "center",
}));

export const AuthFooterText = styled(Typography)(() => ({
    fontSize: "0.95rem",
    color: "#1c3d2c",
    display: "inline",
}));

export const AuthFooterLink = styled("span")(({ theme }) => ({
    marginLeft: theme.spacing(0.5),
    color: "#2C6E49",
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "underline",

    "&:hover": {
        color: "#244d38",
    },
}));
