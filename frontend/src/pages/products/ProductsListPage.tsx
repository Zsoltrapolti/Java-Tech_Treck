import { useEffect, useState } from "react";
import { fetchProducts, addToCart } from "../../api/backend";
import type { ProductType } from "../../types/Product";
import {
    ModulePageContainer,
    ModuleTableContainer,
    ModuleTableHeader,
    ModuleTableCell,
    ModulePageHeader,
    EditButton, AddButton, DeleteButton,
} from '../../ui/ModulePage.styles';
import {
    Table, TableHead, TableRow, TableBody, CircularProgress,
    Dialog, DialogContent,Typography,
    Divider,
    Box
} from "@mui/material";
import { showSuccess } from "../../utils/toast";
import {
    QuantityControlBox,
    QuantityInput,
    StyledDialogActions,
    StyledDialogContentBox,
    StyledDialogTitle,
    TotalPriceBox
} from "../../ui/ModulePage.styles";

export default function ProductsListPage() {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        fetchProducts().then((data) => {
            setProducts(data);
            setLoading(false);
        });
    }, []);

    const handleOpenAddDialog = (product: ProductType) => {
        setSelectedProduct(product);
        setQuantity(1);
        setOpenDialog(true);
    };

    const handleConfirmAdd = async () => {
        if (!selectedProduct) return;
        try {
            await addToCart(selectedProduct.id, quantity);
            showSuccess(`Added ${quantity} x ${selectedProduct.name} to cart.`);
            setOpenDialog(false);
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <CircularProgress style={{ display: 'block', margin: '20px auto' }} />;

    return (
        <ModulePageContainer>
            <ModulePageHeader>Krumpi Menu</ModulePageHeader>
            <ModuleTableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <ModuleTableHeader>Product Name</ModuleTableHeader>
                            <ModuleTableHeader>Price (RON)</ModuleTableHeader>
                            <ModuleTableHeader>Unit</ModuleTableHeader>
                            <ModuleTableHeader>Stock</ModuleTableHeader>
                            <ModuleTableHeader>Action</ModuleTableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map(product => (
                            <TableRow key={product.id}>
                                <ModuleTableCell>{product.name}</ModuleTableCell>
                                <ModuleTableCell>{product.price.toFixed(2)}</ModuleTableCell>
                                <ModuleTableCell>{product.unitOfMeasure}</ModuleTableCell>
                                <ModuleTableCell>{product.quantity}</ModuleTableCell>
                                <ModuleTableCell>
                                    <EditButton onClick={() => handleOpenAddDialog(product)}>
                                        Add to Cart
                                    </EditButton>
                                </ModuleTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ModuleTableContainer>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                PaperProps={{ style: { borderRadius: 16, minWidth: '350px', padding: '10px' } }}
            >
                <StyledDialogTitle>
                    Add to Cart
                </StyledDialogTitle>

                <DialogContent>
                    <StyledDialogContentBox>
                        <Typography variant="h6" sx={{ color: '#333', fontWeight: 600 }}>
                            {selectedProduct?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Available: <b>{selectedProduct?.quantity}</b> {selectedProduct?.unitOfMeasure}
                        </Typography>
                    </StyledDialogContentBox>

                    <QuantityControlBox>
                        <QuantityInput
                            variant="outlined"
                            type="number"
                            value={quantity}
                            size="small"
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                if (val > 0 && selectedProduct && val <= selectedProduct.quantity) {
                                    setQuantity(val);
                                }
                            }}
                        />
                    </QuantityControlBox>
                    <Divider />
                    <TotalPriceBox>
                        <Typography variant="body2" color="text.secondary">
                            Unit Price:<br/>
                            <b>{selectedProduct?.price.toFixed(2)} RON</b>
                        </Typography>

                        <Box textAlign="right">
                            <Typography variant="caption" color="text.secondary">TOTAL</Typography>
                            <Typography variant="h5" sx={{ color: '#2C6E49', fontWeight: 'bold' }}>
                                {(selectedProduct ? selectedProduct.price * quantity : 0).toFixed(2)} RON
                            </Typography>
                        </Box>
                    </TotalPriceBox>
                </DialogContent>

                <StyledDialogActions>
                    <DeleteButton onClick={() => setOpenDialog(false)}>
                        Cancel
                    </DeleteButton>
                    <AddButton
                        onClick={handleConfirmAdd}
                        variant="contained"
                    >
                        Add Product
                    </AddButton>
                </StyledDialogActions>
            </Dialog>
        </ModulePageContainer>
    );
}