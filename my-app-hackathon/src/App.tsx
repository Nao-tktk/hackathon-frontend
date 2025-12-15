import { MantineProvider } from "@mantine/core";
import { Routes, Route } from "react-router-dom";
import "@mantine/core/styles.css"; // Mantineのスタイルシート
import { Header } from "./components/Header";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { ItemList } from "./pages/ItemList";
import { SellItem } from "./pages/SellItem";
import { ItemDetail } from "./pages/ItemDetail";
import { Chat } from "./pages/Chat";
import { Notifications } from "./pages/Notifications";

function App() {
  return (
    <MantineProvider>
      <Header />

      <Routes>
        <Route path="/" element={<ItemList />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sell" element={<SellItem />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/chat/:itemId/:partnerId" element={<Chat />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </MantineProvider>
  );
}

export default App;
