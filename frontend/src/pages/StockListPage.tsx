import { useEffect, useState } from "react";
import { fetchStockEntries } from "../api/backend";
import type { StockEntryType } from "../types/StockEntry";
import { useNavigate } from "react-router-dom";
import {
    BackButton, EditButton, StockBodyRow,
    StockPageContainer,
    StockPageTitle,
    StockPaper, StockTableCell,
    StockTableContainer, StockTableHeader
} from "../styles/StockList.styles.ts";
import {Table, TableBody, TableHead, TableRow} from "@mui/material";

export default function StockListPage() {
    const [stocks, setStocks] = useState<StockEntryType[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStockEntries().then(setStocks);
    }, []);

    return (
        <StockPageContainer>
            <BackButton variant="contained" onClick={() => navigate("/home")}>
                Back to Home
            </BackButton>
            <StockPaper>
                <StockPageTitle>
                    Stock Products
                </StockPageTitle>
                <StockTableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StockTableHeader>Name</StockTableHeader>
                                <StockTableHeader>Type</StockTableHeader>
                                <StockTableHeader>Unit of Measure</StockTableHeader>
                                <StockTableHeader>Quantity</StockTableHeader>
                                <StockTableHeader>Edit</StockTableHeader>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stocks.map((entry) => (
                                <StockBodyRow key={entry.id}>
                                    <StockTableCell>{entry.product.name}</StockTableCell>
                                    <StockTableCell>{entry.product.type}</StockTableCell>
                                    <StockTableCell>{entry.product.unitOfMeasure}</StockTableCell>
                                    <StockTableCell>{entry.quantity}</StockTableCell>
                                    <StockTableCell>
                                        <EditButton variant="contained" onClick={() => navigate(`/stock/${entry.id}/edit`)}>
                                            Edit
                                        </EditButton>
                                    </StockTableCell>
                                </StockBodyRow>
                            ))}
                        </TableBody>
                    </Table>
                </StockTableContainer>
            </StockPaper>
        </StockPageContainer>
    );
}