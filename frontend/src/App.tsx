import HomePage from "./pages/HomePage.tsx";
import StockEditPage from "./pages/StockEditPage.tsx";
import StockListPage from "./pages/StockListPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import EmployeesPage from "./pages/EmployeesPage.tsx";
import OrdersPage from "./pages/OrdersPage.tsx";
import {Routes, Route, BrowserRouter} from "react-router-dom";
import OrdersEditPage from "./pages/OrdersEditPage.tsx";

function App() {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/stock" element={<StockListPage/>} />
                <Route path="/stock/:id/edit" element={<StockEditPage/>} />
                <Route path="/employees" element={<EmployeesPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:id/edit" element={<OrdersEditPage/>} />
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
