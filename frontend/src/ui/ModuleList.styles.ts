import { styled } from '@mui/material/styles';
import { TableContainer, TableCell, TableRow} from '@mui/material';

export const ModuleTableContainer = styled(TableContainer)(({ theme }) => ({
    maxWidth: 900,
    margin: '0 auto',
    borderRadius: 16,
    boxShadow: theme.shadows[6],
    overflowX: 'hidden',
    marginTop: theme.spacing(3),
}));

export const ModuleTableCell = styled(TableCell)(({ }) => ({
    fontWeight: 700,
    backgroundColor: "#2C6E49",
    color: "#E0ECD6",
    fontSize: "1rem",
}))

export const ModuleBodyRow = styled(TableRow)(({ }) => ({
    '&:hover': {
        backgroundColor: "#cadcba",
        cursor: 'pointer',
    },
}));

export const ModuleTableCell2 = styled(TableCell)(({ }) => ({
    fontWeight: 500,
    color: "#072d18",
    fontSize: "1rem",
}))