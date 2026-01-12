import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import RegisterYourInterest from "./pages/RegisterYourInterest";
import Admin from "./pages/Admin";

function App() {
  function Layout() {
    const location = useLocation();
    return (
      <>
        {!(location.pathname === "/registeryourinterest" || location.pathname.startsWith("/admin")) && <Navbar />}
        <Outlet />
      </>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}> 
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/admin" element={<Admin/>} />
        </Route>

        <Route path="/registeryourinterest" element={<RegisterYourInterest/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
