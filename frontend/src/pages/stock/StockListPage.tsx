import { useEffect, useState } from "react";
import { fetchStockEntries, deleteProduct } from "../../api/backend.ts";
import type { StockEntryType } from "../../types/StockEntry.ts";
import { useNavigate } from "react-router-dom";

import {
    ModulePageContainer,
    ModuleTableContainer,
} from "../../ui/ModulePage.styles.ts";
import {ModuleHeader} from "../../components/table/ModuleHeader.tsx";
import {ModuleDataTable} from "../../components/table/ModuleDataTable.tsx";


export default function StockListPage() {
    const [stocks, setStocks] = useState<StockEntryType[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStockEntries().then(setStocks);
    }, []);

    function handleDelete(id: number) {
        deleteProduct(id);
        setStocks(prev => prev.filter(s => s.id !== id));
    }

    return (
        <ModulePageContainer>

            <ModuleHeader
                title="Stock Products"
                addLabel="Add Product"
                onAdd={() => navigate("/stock/new")}
            />

            <ModuleTableContainer>
                <ModuleDataTable
                    rows={stocks.map(s => ({
                        id: s.id,
                        name: s.product.name,
                        type: s.product.type,
                        unitOfMeasure: s.product.unitOfMeasure,
                        quantity: s.quantity
                    }))}
                    columns={[
                        { label: "ID", key: "id" },
                        { label: "Name", key: "name" },
                        { label: "Type", key: "type" },
                        { label: "Unit", key: "unitOfMeasure" },
                        { label: "Quantity", key: "quantity" }
                    ]}
                    onEdit={id => navigate(`/stock/${id}/edit`)}
                    onDelete={handleDelete}
                />
            </ModuleTableContainer>

        </ModulePageContainer>
    );
}
