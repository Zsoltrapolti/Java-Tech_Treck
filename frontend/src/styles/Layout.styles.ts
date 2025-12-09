import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const LayoutWrapper = styled(Box)(() => ({
    backgroundColor: "#E5F3E5",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
}));

export const LayoutContent = styled(Box)(() => ({
    width: "100%",
    flex: 1,
    margin: "0 auto",
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center",
}));
