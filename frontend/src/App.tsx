import HomePage from "./pages/HomePage.tsx";
import StockEditPage from "./pages/StockEditPage.tsx";
import StockListPage from "./pages/StockListPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import EmployeesPage from "./pages/EmployeesPage.tsx";
import OrdersPage from "./pages/OrdersPage.tsx";
import {Routes, Route, BrowserRouter} from "react-router-dom";
import OrdersEditPage from "./pages/OrdersEditPage.tsx";
import StockAddPage from "./pages/StockAddPage.tsx";
import EmployeesEditPage from "./pages/EmployeesEditPage.tsx";
import EmployeesAddPage from "./pages/EmployeesAddPage.tsx";
import OrdersAddPage from "./pages/OrdersAddPage.tsx";
import Layout from "./components/Layout";

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