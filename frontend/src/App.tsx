import HomePage from "./pages/HomePage.tsx";
import StockEditPage from "./pages/StockEditPage.tsx";
import StockListPage from "./pages/StockListPage.tsx";
import {Routes, Route, BrowserRouter} from "react-router-dom";

function App() {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/stock" element={<StockListPage/>} />
                <Route path="/stock/:id" element={<StockEditPage/>} />
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
