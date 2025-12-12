import HomePage from "../pages/home/HomePage.tsx";
import StockEditPage from "../pages/stock/StockEditPage.tsx";
import StockListPage from "../pages/stock/StockListPage.tsx";
import LoginPage from "../pages/LoginPage.tsx";
import EmployeesPage from "../pages/employees/EmployeesPage.tsx";
import OrdersPage from "../pages/orders/OrdersPage.tsx";
import {Routes, Route, BrowserRouter} from "react-router-dom";
import OrdersEditPage from "../pages/orders/OrdersEditPage.tsx";
import StockAddPage from "../pages/stock/StockAddPage.tsx";
import EmployeesEditPage from "../pages/employees/EmployeesEditPage.tsx";
import EmployeesAddPage from "../pages/employees/EmployeesAddPage.tsx";
import OrdersAddPage from "../pages/orders/OrdersAddPage.tsx";
import Layout from "../components/layout/Layout.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<LoginPage />} />

                <Route element={<Layout />}>
                    <Route path="/home" element={<HomePage />} />

                    <Route path="/stock" element={<StockListPage />} />
                    <Route path="/stock/new" element={<StockAddPage />} />
                    <Route path="/stock/:id/edit" element={<StockEditPage />} />

                    <Route path="/employees" element={<EmployeesPage />} />
                    <Route path="/employees/new" element={<EmployeesAddPage />} />
                    <Route path="/employees/:id/edit" element={<EmployeesEditPage />} />

                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/orders/new" element={<OrdersAddPage />} />
                    <Route path="/orders/:id/edit" element={<OrdersEditPage />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;