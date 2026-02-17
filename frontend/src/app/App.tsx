import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import RegisterPage from "../pages/login/RegisterPage";
import RequestAccountPage from "../pages/login/RequestAccountPage";
import Layout from "../components/layout/Layout";
import { RoleRoute } from "../app/RoleRoute";
import StockListPage from "../pages/stock/StockListPage";
import StockAddPage from "../pages/stock/StockAddPage";
import StockEditPage from "../pages/stock/StockEditPage";
import EmployeesPage from "../pages/employees/EmployeesPage";
import EmployeesAddPage from "../pages/employees/EmployeesAddPage";
import EmployeesEditPage from "../pages/employees/EmployeesEditPage";
import OrdersPage from "../pages/orders/OrdersPage";
import OrdersAddPage from "../pages/orders/OrdersAddPage";
//import OrdersEditPage from "../pages/orders/OrdersEditPage";
import ProductsListPage from "../pages/products/ProductsListPage";
import MyProductsListPage from "../pages/products/MyProductsListPage";
import PaymentPage from "../pages/products/PaymentPage"; // Import your new Payment Page
import PaymentSuccessPage from "../pages/products/PaymentSuccessPage.tsx";
import UnauthorizedPage from "../pages/home/UnauthorizedPage";
import ErrorToast from "../components/layout/ErrorToast";
import CheckRequestStatusPage from "../pages/login/CheckRequestStatusPage.tsx";
import AccountsPage from "../pages/accounts/AccountsPage.tsx";
import AccountsEditPage from "../pages/accounts/AccountsEditPage.tsx";
import AccountRequestsPage from "../pages/accounts/AccountRequestsPage.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/request-account" element={<RequestAccountPage />} />
                <Route path="/check-request-status" element={<CheckRequestStatusPage />} />

                {/* Protected Routes inside Layout */}
                <Route element={<Layout />}>

                    {/* COMMON ROUTES: Products seen by everyone logged in */}
                    <Route element={<RoleRoute allowed={["USER", "EMPLOYEE", "ADMIN"]} />}>
                        <Route path="/products" element={<ProductsListPage />} />
                    </Route>

                    {/* USER ONLY ROUTES (Matches your 4 Buttons) */}
                    <Route element={<RoleRoute allowed={["USER"]} />}>
                        <Route path="/my-products" element={<MyProductsListPage />} />
                        <Route path="/payment" element={<PaymentPage />} />
                        <Route path="/payment-success" element={<PaymentSuccessPage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/orders/new" element={<OrdersAddPage />} />
                    </Route>

                    {/* EMPLOYEE & ADMIN ROUTES */}
                    <Route element={<RoleRoute allowed={["EMPLOYEE", "ADMIN"]} />}>
                        <Route path="/stock" element={<StockListPage />} />
                        <Route path="/stock/new" element={<StockAddPage />} />
                        <Route path="/stock/:id/edit" element={<StockEditPage />} />
                    </Route>

                    {/* ADMIN ONLY ROUTES */}
                    <Route element={<RoleRoute allowed={["ADMIN"]} />}>
                        <Route path="/employees" element={<EmployeesPage />} />
                        <Route path="/employees/new" element={<EmployeesAddPage />} />
                        <Route path="/employees/:id/edit" element={<EmployeesEditPage />} />
                        {/* Admin view of orders uses the same component or a specialized admin one */}
                        <Route path="/admin/orders" element={<OrdersPage />} />
                        <Route path="/accounts" element={<AccountsPage />} />
                        <Route path="/accounts/:id/edit" element={<AccountsEditPage />} />
                        <Route path="/account-requests" element={<AccountRequestsPage />} />
                    </Route>

                    <Route path="/unauthorized" element={<UnauthorizedPage />} />
                </Route>
            </Routes>
            <ErrorToast />
        </BrowserRouter>
    );
}

export default App;