
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
 import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Complaints from "./pages/Complaints";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/complaints" element={<Complaints />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
