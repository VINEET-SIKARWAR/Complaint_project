import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StaffRequests from "./components/StaffRequests";
import StaffDashboard from "./pages/StaffDashboard";
import AssignedComplaints from "./pages/AssignedComplaints"; 
import NewComplaint from "./pages/NewComplaint";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/staff-requests" element={<StaffRequests />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        <Route path="/assigned-complaints" element={<AssignedComplaints />} /> 
        <Route path ="/new-complaint" element={<NewComplaint/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

