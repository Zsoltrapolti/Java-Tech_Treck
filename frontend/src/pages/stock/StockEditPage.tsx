import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductById, updateProduct } from "../../api/backend.ts";

import { EditFormPage } from "../../components/form/EditFormPage.tsx";
import { EditFormField } from "../../components/form/EditFormField.tsx";
import { EditFormActions } from "../../components/form/EditFormActions.tsx";

import type { ProductType } from "../../types/Product.ts";
import { showError } from "../../utils/toast";

export default function StockEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState<ProductType | null>(null);

    useEffect(() => {
        if (id) fetchProductById(Number(id)).then(setProduct);
    }, [id]);

    if (!product) return <p>Loading...</p>;

    return (
        <EditFormPage title="Edit Product">

            <EditFormField
                label="Name"
                value={product.name}
                onChange={v => setProduct({ ...product, name: v })}
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
                        await updateProduct(product);
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
