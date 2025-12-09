import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createProduct } from "../api/backend.ts";

import { EditFormPage } from "../components/EditFormPage.tsx";
import { EditFormField } from "../components/EditFormField.tsx";
import { EditFormActions } from "../components/EditFormActions.tsx";

export default function StockAddPage() {
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        id: 0,
        name: "",
        type: "",
        unitOfMeasure: "",
        quantity: 0
    });

    return (
        <EditFormPage title="Add Product">

            <EditFormField
                label="Name"
                value={product.name}
                onChange={v => setProduct({ ...product, name: v })}
            />

            <EditFormField
                label="Type"
                value={product.type}
                onChange={v => setProduct({ ...product, type: v })}
            />

            <EditFormField
                label="Unit of Measure"
                value={product.unitOfMeasure}
                onChange={v => setProduct({ ...product, unitOfMeasure: v })}
            />

            <EditFormField
                label="Quantity"
                type="number"
                value={product.quantity}
                onChange={v => setProduct({ ...product, quantity: v })}
            />

            <EditFormActions
                onSave={async () => {
                    await createProduct(product);
                    navigate("/stock");
                }}
                onCancel={() => navigate("/stock")}
            />

        </EditFormPage>
    );
}
