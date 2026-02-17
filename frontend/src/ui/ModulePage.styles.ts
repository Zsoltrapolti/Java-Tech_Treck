import { styled } from "@mui/material/styles";
import {
    TableCell,
    Button,
    Box,
    DialogTitle,
    DialogActions,
    DialogContent,
    Typography,
    TextField,
    Paper
} from "@mui/material";

export const ModulePageContainer = styled(Box)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    minHeight: "80vh",
    maxWidth: "100%",
}));

export const ModulePageHeader = styled("div")(() => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    margin: "0 auto 20px",
    color: "#2C6E49",
    fontWeight: 700,
    fontSize: "2.5rem",
}));


export const ModuleTableContainer = styled(Box)(({ theme }) => ({
    width: "1000px",
    maxHeight: "506px",
    overflowY: "auto",
    marginTop: theme.spacing(2),
    borderRadius: 10,
    border: "1px solid #d9e5d3",
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",

    "&::-webkit-scrollbar": { width: 8 },
    "&::-webkit-scrollbar-thumb": {
        background: "#b0c4a0",
        borderRadius: 8,
    },
    "&::-webkit-scrollbar-thumb:hover": {
        background: "#8fa982",
    }
}));

export const ModuleTableHeader = styled(TableCell)(() => ({
    fontWeight: 700,
    backgroundColor: "#2C6E49",
    color: "#E0ECD6",
    position: "sticky",
    top: 0,
    zIndex: 10,
}));

export const ModuleTableCell = styled(TableCell)(() => ({
    fontWeight: 500,
    color: "#072d18",
    fontSize: "1rem",
    backgroundColor: "#eef3ea",
}));

export const EditButton = styled(Button)(() => ({
    fontWeight: 600,
    padding: "6px 16px",
    borderRadius: "8px",
    backgroundColor: "#1b7944",
    "&:hover": {
        backgroundColor: "#256628",
    },
    color: "#ffffff",
}));

export const DeleteButton = styled(Button)(() => ({
    fontWeight: 600,
    padding: "6px 16px",
    borderRadius: "8px",
    backgroundColor: "#c0392b",
    "&:hover": {
        backgroundColor: "#922b21",
    },
    color: "#ffffff",
}));

export const AddButton = styled(Button)(() => ({
    fontWeight: 600,
    padding: "6px 16px",
    borderRadius: "8px",
    backgroundColor: "#1b7944",
    "&:hover": {
        backgroundColor: "#135229",
    },
    color: "#ffffff",
}));

export const DenyButton = styled(Button)(() => ({
    fontWeight: 600,
    padding: "6px 16px",
    borderRadius: "8px",
    backgroundColor: "#e67e22",
    color: "#ffffff",
    "&:hover": {
        backgroundColor: "#d35400",
    },
}));

export const ModalTitle = styled(DialogTitle)(({ theme }) => ({
    backgroundColor: "#2C6E49",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "1.2rem",
    textAlign: "center",
    padding: theme.spacing(2),
}));

export const ModalContent = styled(DialogContent)(({ theme }) => ({
    minWidth: "400px",
    padding: theme.spacing(3),
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    "&.MuiDialogContent-root": {
        paddingTop: theme.spacing(3),
    }
}));

export const UserInfoText = styled(Typography)(({ theme }) => ({
    backgroundColor: "#e5f5ea",
    padding: theme.spacing(2),
    borderRadius: "8px",
    color: "#1c3d2c",
    fontSize: "0.95rem",
    marginBottom: theme.spacing(1),
}));

export const ModalActions = styled(DialogActions)(({ theme }) => ({
    padding: theme.spacing(2, 3),
    justifyContent: "space-between",
    borderTop: "1px solid #eeeeee"
}));



export const StyledDialogTitle = styled(DialogTitle)(() => ({
    textAlign: 'center',
    fontWeight: 700,
    color: '#2C6E49',
    fontSize: '1.5rem',
}));

export const StyledDialogContentBox = styled(Box)(() => ({
    textAlign: 'center',
    marginBottom: '24px',
}));

export const QuantityControlBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
}));

export const QuantityInput = styled(TextField)(() => ({
    width: '80px',
    '& input': {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '1.2rem',
    }
}));

export const TotalPriceBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: '#f9fcf9',
    borderRadius: '8px',
    border: '1px solid #E0ECD6',
}));

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
    justifyContent: 'center',
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(1),
}));


export const SuccessCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(5),
    textAlign: 'center',
    borderRadius: 16,
    maxWidth: 600,
    width: '100%',
    boxShadow: theme.shadows[10],
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
}));

export const SummaryBox = styled(Box)(({ theme }) => ({
    width: '100%',
    padding: theme.spacing(3),
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    border: '1px solid #c8e6c9',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

export const PrimaryButton = styled(Button)(({ theme }) => ({
    backgroundColor: "#2C6E49",
    color: "#fff",
    fontWeight: "bold",
    padding: "10px 24px",
    borderRadius: "8px",
    textTransform: "none",
    fontSize: "1rem",
    boxShadow: theme.shadows[3],
    '&:hover': {
        backgroundColor: "#1b4d32",
        boxShadow: theme.shadows[5],
    },
    '&:disabled': {
        backgroundColor: "#a5d6a7",
        color: "#fff",
    }
}));

export const OutlinedButton = styled(Button)(() => ({
    borderColor: "#2C6E49",
    color: "#2C6E49",
    fontWeight: "bold",
    padding: "10px 10px",
    borderRadius: "8px",
    backgroundColor: "#e8f5e9",
    textTransform: "none",
    fontSize: "1rem",
    borderWidth: '2px',
    '&:hover': {
        borderWidth: '2px',
        borderColor: "#1b4d32",
        backgroundColor: "#c4dac6",
    },
}));

