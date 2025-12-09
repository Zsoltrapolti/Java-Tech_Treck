import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductById, updateProduct } from "../api/backend";
import {
    EditContainer,
    EditCard,
    EditTitle,
    EditLabel,
    EditInput,
    SaveButton,
    BackButton
} from "../styles/StockEdit.styles";
import type { ProductType } from "../types/Product";

export default function StockEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState<ProductType | null>(null);

    useEffect(() => {
        if (id) {
            fetchProductById(Number(id)).then(setProduct);
        }
    }, [id]);

    function handleChange(field: keyof ProductType, value: string | number) {
        if (!product) return;
        setProduct({ ...product, [field]: value });
    }

    async function handleSave() {
        if (!product) return;

        try {
            await updateProduct(product);
            navigate("/stock");
        } catch {
            alert("Failed to update product");
        }
    }

    if (!product) {
        return <p>Loading</p>;
    }

    return (
        <EditContainer>
            <EditCard elevation={6}>
                <EditTitle>Edit Product</EditTitle>

                <EditLabel>Name</EditLabel>
                <EditInput
                    value={product.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                />

                <EditLabel>Type</EditLabel>
                <EditInput
                    value={product.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                />

                <EditLabel>Unit of Measure</EditLabel>
                <EditInput
                    value={product.unitOfMeasure}
                    onChange={(e) => handleChange("unitOfMeasure", e.target.value)}
                />

                <EditLabel>Quantity</EditLabel>
                <EditInput
                    type="number"
                    value={product.quantity}
                    onChange={(e) => handleChange("quantity", Number(e.target.value))}
                />

                <SaveButton variant="contained" onClick={handleSave}>
                    Save
                </SaveButton>

                <BackButton variant="contained" onClick={() => navigate("/stock")}>
                    Cancel
                </BackButton>
            </EditCard>
        </EditContainer>
    );
}
