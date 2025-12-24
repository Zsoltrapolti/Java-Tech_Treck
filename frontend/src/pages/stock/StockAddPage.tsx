import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {createProduct} from "../../api/backend.ts";
import { showError } from "../../utils/toast";

import { EditFormPage } from "../../components/form/EditFormPage.tsx";
import { EditFormField } from "../../components/form/EditFormField.tsx";
import { EditFormActions } from "../../components/form/EditFormActions.tsx";

export default function StockAddPage() {
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        id: 0,
        name: "",
        type: "",
        unitOfMeasure: "",
        quantity: 0,
        ownerUsername: ""
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
                label="Owner Username"
                value={product.ownerUsername}
                onChange={v => setProduct({ ...product, ownerUsername: v })}
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
                    try {
                        await createProduct(product);
                        navigate("/stock");
                    } catch (e) {
                        showError(e);
                    }
                }}
                onCancel={() => navigate("/stock")}
            />
        </EditFormPage>
    );
}