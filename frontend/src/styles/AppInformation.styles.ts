import { styled } from '@mui/material/styles';
import { Card, Box, Typography } from '@mui/material';

export const InformationCard = styled(Card)(({ theme }) => ({
    maxWidth: 600,
    margin: '0 auto',
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(10),
    padding: theme.spacing(4),
    borderRadius:20,
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#2C6E49",
    textAlign: "center",
}));

export const InformationLayout = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: theme.spacing(2),
}));

export const InformationTitle = styled(Typography)(({ }) => ({
    fontSize: '1.8rem',
    fontWeight: 700,
    color:  "#E0ECD6",
}));

export const InformationVersion = styled(Typography)(({ theme }) => ({
    fontSize: '1.2rem',
    marginTop: theme.spacing(0.5),
    color: "#E0ECD6",
}));
