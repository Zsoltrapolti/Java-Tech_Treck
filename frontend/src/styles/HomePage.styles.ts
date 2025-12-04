import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const HomeContainer = styled(Box)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    minHeight: "100vh",
    backgroundColor: "#E0ECD6",
}));

export const PageTitle = styled("h1")(({ theme }) => ({
    fontSize: "2.5rem",
    fontWeight: 700,
    textAlign: "center",
    marginBottom: theme.spacing(4),
    fontFamily: theme.typography.fontFamily,
    color: "#2C6E49",
    displau: "flex",
    justifyContent: "center",
    gap: theme.spacing(1),
    alignItems: "center",
}));