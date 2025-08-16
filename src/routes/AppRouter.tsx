  import { BrowserRouter, Route, Routes } from "react-router";
  import Mimo from "@/pages/mimo";
  import Catalog from "@/pages/catalog";

  export default function AppRouter() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Mimo />} />
          <Route path="/catalog" element={<Catalog />} />
        </Routes>
      </BrowserRouter>
    );  
  }

  
