import { styled } from '@mui/material/styles';
import {TableContainer, TableCell, TableRow, Button, Typography, Paper, Box} from '@mui/material';

export const StockTableContainer = styled(TableContainer)(({ theme }) => ({
    maxWidth: 900,
    margin: '0 auto',
    borderRadius: 16,
    boxShadow: theme.shadows[6],
    overflowX: 'hidden',
    marginTop: theme.spacing(3),
    backgroundColor: "#E0ECD6",
}));

export const StockTableHeader = styled(TableCell)(({ }) => ({
    fontWeight: 700,
    backgroundColor: "#2C6E49",
    color: "#E0ECD6",
    fontSize: "1rem",
}))

export const StockBodyRow = styled(TableRow)(({ }) => ({
    '&:hover': {
        backgroundColor: "#cadcba",
        cursor: 'pointer',
    },
}));

export const StockTableCell = styled(TableCell)(({ }) => ({
    fontWeight: 500,
    color: "#072d18",
    fontSize: "1rem",
}))

export const StockPageContainer = styled(Box)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    minHeight: "100vh",
    backgroundColor: "#E0ECD6",
}));

export const StockPaper = styled(Paper)(({ theme }) => ({
    maxWidth: 900,
    margin: "20px auto",
    padding: theme.spacing(3),
    borderRadius: 16,
    boxShadow: theme.shadows[6],
    backgroundColor: "#E0ECD6",
}));

export const BackButton = styled(Button)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    backgroundColor: "#2C6E49",
    marginLeft: theme.spacing(4),
    "&:hover": {
        backgroundColor: "#244d38",
    },
}));

export const StockPageTitle = styled(Typography)(({ theme }) => ({
    fontSize: "2rem",
    fontWeight: 700,
    marginBottom: theme.spacing(2),
    color: "#2C6E49",
    textAlign: "center",
}));

export const EditButton = styled(Button)(() => ({
    padding: "4px 4px",
    fontSize: "0.9rem",
    backgroundColor: "#2C6E49",
}));