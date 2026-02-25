import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createProduct } from "../../api/backend.ts";
import { showError } from "../../utils/toast";

import { EditFormPage } from "../../components/form/EditFormPage.tsx";
import { EditFormField } from "../../components/form/EditFormField.tsx";
import { EditFormActions } from "../../components/form/EditFormActions.tsx";

// Matching the ProductDTO structure
export default function StockAddPage() {
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        type: "",
        unitOfMeasure: "",
        quantity: 0,
        price: 0 // Added to match DTO
    });

    return (
        <EditFormPage title="Add Product">
            <EditFormField
                label="Product Name"
                value={product.name}
                onChange={v => setProduct({ ...product, name: v })}
            />

            <EditFormField
                label="Category / Type"
                value={product.type}
                onChange={v => setProduct({ ...product, type: v })}
            />

            <EditFormField
                label="Unit of Measure (e.g., kg, pcs)"
                value={product.unitOfMeasure}
                onChange={v => setProduct({ ...product, unitOfMeasure: v })}
            />

            <EditFormField
                label="Quantity"
                type="number"
                value={product.quantity}
                onChange={v => setProduct({ ...product, quantity: parseFloat(v) })}
            />

            <EditFormField
                label="Price per Unit"
                type="number"
                value={product.price}
                onChange={v => setProduct({ ...product, price: parseFloat(v) })}
            />

            <EditFormActions
                onSave={async () => {
                    try {
                        // The backend will ignore 'id' if sent,
                        // but we send the clean DTO matching your Java class
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