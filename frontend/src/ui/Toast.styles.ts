import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const ErrorToastWrapper = styled(Box)(({ theme }) => ({
    position: "fixed",
    top: 20,
    right: 20,
    backgroundColor: "#ffffff",
    color: "#9d1111",
    padding: "14px 20px",
    borderRadius: 8,
    boxShadow: theme.shadows[4],
    zIndex: 1500,
    minWidth: 280,
}));
