import { Link } from "react-router-dom";
import Carousel from "./Carousel";
import vehicle_mng from "./../images/vehicle_mng.png";
import client_branch from "./../images/client_branch.png";
import trip_mngt from "./../images/trip_mngt.png";
import expense_mngt from "./../images/expense_mngt.png";
import salary_mng from "./../images/salary_mng.png";
import trip_payments from "./../images/trip_payments.png";
const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}

      <Carousel />

      <div className="container text-center mt-5">
        <h1 className="display-4">Manage Your Transport Business with Ease</h1>
        <p className="text-muted mt-4">
          A comprehensive platform for admins and transporters to efficiently
          manage vehicles, clients, bookings, employees, and more. Track trip
          expenses, monitor payments, and ensure seamless coordination of
          day-to-day operations. Simplify every aspect of transport management
          with real-time updates and detailed reports.
        </p>

        <Link
          to="/admin/dashboard"
          className="btn btn-lg bg-color custom-bg-text mt-4"
        >
          Get Started
        </Link>
      </div>

      {/* Features Section */}
      <section className="features-section py-5 mt-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4">
              <img
                src={vehicle_mng} // Placeholder path
                alt="Vehicle Management"
                className="img-fluid mb-3"
                style={{ maxHeight: "150px" }}
              />
              <h3>Vehicle Management</h3>
              <p>
                Easily manage your fleet, from adding new vehicles to tracking
                their maintenance and availability.
              </p>
            </div>
            <div className="col-md-4">
              <img
                src={client_branch} // Placeholder path
                alt="Client Management"
                className="img-fluid mb-3"
                style={{ maxHeight: "150px" }}
              />
              <h3>Client & Branch Management</h3>
              <p>
                Add new clients, manage their details, and keep track of client
                branches for smooth operations.
              </p>
            </div>
            <div className="col-md-4">
              <img
                src={trip_mngt} // Placeholder path
                alt="Trip Management"
                className="img-fluid mb-3"
                style={{ maxHeight: "150px" }}
              />
              <h3>Client Trip Management</h3>
              <p>
                Efficiently manage client trips by adding trips, tracking trip
                expenses, calculating prices, charges, and handling payments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="features-section py-5 bg-light">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4">
              <img
                src={expense_mngt} // Placeholder path
                alt="Expense Management"
                className="img-fluid mb-3"
                style={{ maxHeight: "150px" }}
              />
              <h3>Expense Management</h3>
              <p>
                Manage all types of expenses, from trip fuel costs to
                miscellaneous charges, and keep track of overall costs.
              </p>
            </div>
            <div className="col-md-4">
              <img
                src={salary_mng} // Placeholder path
                alt="Employee Salary Management"
                className="img-fluid mb-3"
                style={{ maxHeight: "150px" }}
              />
              <h3>Employee Salary Management</h3>
              <p>
                Manage employees such as drivers and helpers, track their
                salaries, assign them to trips, and monitor their performance.
              </p>
            </div>
            <div className="col-md-4">
              <img
                src={trip_payments} // Placeholder path
                alt="Secure Transactions"
                className="img-fluid mb-3"
                style={{ maxHeight: "150px" }}
              />
              <h3>Trip Payment Records</h3>
              <p>
                Keep track of all trip payments, including whether payments have
                been fully made by the client or are still pending. Easily
                manage payment statuses for seamless financial operations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
