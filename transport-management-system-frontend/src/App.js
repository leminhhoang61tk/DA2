import "./App.css";
import SideBar from "./components/Sidebar/SideBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Users from "./pages/Users";
import FileManager from "./pages/ContactUsPage";
import AboutUsPage from "./pages/AboutUsPage";
import Order from "./pages/Order";
import Saved from "./pages/Saved";
import Setting from "./pages/Setting";
import UserLoginForm from "./users/UserLoginForm";
import UserRegister from "./users/UserRegister";
import ContactUsPage from "./pages/ContactUsPage";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import AdminLogout from "./pages/AdminLogout";
import ViewAllTransporters from "./users/ViewAllTransporters";
import AddVehiclePage from "./pages/AddVehiclePage";
import ViewAllVehicles from "./pages/ViewAllVehicles";
import VehicleDetail from "./pages/VehicleDetail";
import UpdateVehicleDocument from "./pages/UpdateVehicleDocument";
import VehicleUpdateDetail from "./pages/VehicleUpdateDetail ";
import RegisterEmployeePage from "./pages/RegisterEmployeePage";
import ViewAllEmployees from "./users/ViewAllEmployees";
import EmployeeDetail from "./users/EmployeeDetail";
import UpdateEmployeeDocument from "./pages/UpdateEmployeeDocument";
import UpdateEmployeeDetailPage from "./pages/UpdateEmployeeDetailPage";
import AddClientPage from "./pages/AddClientPage";
import ViewAllClients from "./pages/ViewAllClients";
import ClientDetail from "./pages/ClientDetail";
import UpdateClientDocument from "./pages/UpdateClientDocument";
import ClientUpdateDetail from "./pages/ClientUpdateDetail";
import AddClientBooking from "./pages/AddClientBooking";
import ViewAllBookings from "./pages/ViewAllBookings";
import BookingDetail from "./pages/BookingDetail";
import UpdateBookingDocument from "./pages/UpdateBookingDocument";
import UpdateClientBooking from "./pages/UpdateClientBooking";
import Dashboard from "./pages/Dashboard";


import WarehousesPage from './pages/WarehousesPage';
import WarehouseDetailPage from './pages/WarehouseDetailPage';
import ItemsPage from './pages/ItemsPage';
import ItemDetailPage from './pages/ItemDetailPage';
import InventoryPage from './pages/InventoryPage';

import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#f8ac2c',

      light: '#ffdd5f',
      dark: '#c47d00',
      contrastText: '#000000',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <SideBar>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/users" element={<Users />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/contact-us" element={<ContactUsPage />} />
            <Route path="/file-manager" element={<FileManager />} />
            <Route path="/order" element={<Order />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/settings" element={<Setting />} />
            <Route path="/user/login" element={<UserLoginForm />} />

            <Route
              path="/admin/transporter/register"
              element={<UserRegister />}
            />

            <Route
              path="/admin/transporter/view"
              element={<ViewAllTransporters />}
            />

            <Route path="/user/admin/logout" element={<AdminLogout />} />
            <Route path="/admin/vehicle/add" element={<AddVehiclePage />} />
            <Route path="/admin/vehicle/view" element={<ViewAllVehicles />} />
            <Route
              path="/admin/vehicle/:vehicleId/detail"
              element={<VehicleDetail />}
            />
            <Route
              path="/admin/vehicle/:vehicleId/update/detail"
              element={<VehicleUpdateDetail />}
            />
            <Route path="*" element={<ErrorPage />} />
            <Route
              path="/admin/vehicle/document/update"
              element={<UpdateVehicleDocument />}
            />
            <Route
              path="/admin/employee/register"
              element={<RegisterEmployeePage />}
            />
            <Route path="/admin/employee/view" element={<ViewAllEmployees />} />
            <Route
              path="/admin/employee/:employeeId/detail"
              element={<EmployeeDetail />}
            />
            <Route
              path="/admin/employee/document/update"
              element={<UpdateEmployeeDocument />}
            />
            <Route
              path="/admin/employee/:employeeId/update/detail"
              element={<UpdateEmployeeDetailPage />}
            />
            <Route path="/admin/client/add" element={<AddClientPage />} />
            <Route path="/admin/client/view" element={<ViewAllClients />} />
            <Route
              path="/admin/client/:clientId/detail"
              element={<ClientDetail />}
            />
            <Route
              path="/admin/client/document/update"
              element={<UpdateClientDocument />}
            />
            <Route
              path="/admin/client/:clientId/update/detail"
              element={<ClientUpdateDetail />}
            />
            <Route
              path="/admin/client/order/booking"
              element={<AddClientBooking />}
            />
            <Route
              path="/admin/client/booking/view"
              element={<ViewAllBookings />}
            />
            <Route
              path="/admin/client/booking/:bookingId/detail"
              element={<BookingDetail />}
            />

            <Route
              path="/admin/booking/document/update"
              element={<UpdateBookingDocument />}
            />
            <Route
              path="/admin/booking/:bookingId/update"
              element={<UpdateClientBooking />}
            />

            <Route path="/warehouses" element={<WarehousesPage />} />
            <Route path="/warehouses/:id" element={<WarehouseDetailPage />} />
            <Route path="/items" element={<ItemsPage />} />
            <Route path="/items/:id" element={<ItemDetailPage />} />
            <Route path="/inventory" element={<InventoryPage />} />

            <Route path="/admin/dashboard" element={<Dashboard />} />
          </Routes>
        </SideBar>
      </Router>
    </ThemeProvider>
  );
}

export default App;
