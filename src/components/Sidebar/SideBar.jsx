import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaHome,
  FaWallet,
  FaSignOutAlt,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaPhoneAlt,
  FaInfoCircle,
  FaTruck,
  FaUserShield,
  FaUserTie,
  FaBriefcase,
  FaTruckLoading,
  FaEye,
  FaTachometerAlt,
} from "react-icons/fa";
import { MdApartment, MdHome, MdVisibility } from "react-icons/md";
import { BiCog } from "react-icons/bi";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SidebarMenu from "./SidebarMenu";
const routes = [
  {
    path: "/",
    name: "Home",
    icon: <FaHome />,
  },
  {
    path: "/about-us",
    name: "About Us",
    icon: <FaInfoCircle />,
  },
  {
    path: "/contact-us",
    name: "Contact Us",
    icon: <FaPhoneAlt />,
  },
];

const SideBar = ({ children }) => {
  const admin = JSON.parse(sessionStorage.getItem("active-admin"));
  const transporter = JSON.parse(sessionStorage.getItem("active-transporter"));

  const userRoutes = [...routes];
  if (admin) {
    userRoutes.push(
      {
        path: "/admin/dashboard",
        name: "Dashboard",
        icon: <FaTachometerAlt />,
      },
      // {
      //   path: "/settings",
      //   name: "Transporter",
      //   icon: <FaUserShield />,
      //   exact: true,
      //   subRoutes: [
      //     {
      //       path: "/admin/transporter/register",
      //       name: "Register",
      //       icon: <FaUserPlus />,
      //     },
      //     {
      //       path: "/admin/transporter/view",
      //       name: "View",
      //       icon: <FaEye />,
      //     },
      //   ],
      // },
      {
        path: "/settings",
        name: "Vehicle",
        icon: <FaTruck />,
        exact: true,
        subRoutes: [
          {
            path: "/admin/vehicle/add",
            name: "Add",
            icon: <FaUserPlus />,
          },
          {
            path: "/admin/vehicle/view",
            name: "View",
            icon: <FaEye />,
          },
        ],
      },
      {
        path: "/settings",
        name: "Employee",
        icon: <FaUserTie />,
        exact: true,
        subRoutes: [
          {
            path: "/admin/employee/register",
            name: "Register",
            icon: <FaUserPlus />,
          },
          {
            path: "/admin/employee/view",
            name: "View",
            icon: <FaSignInAlt />,
          },
        ],
      },
      {
        path: "/settings",
        name: "Client",
        icon: <FaBriefcase />,
        exact: true,
        subRoutes: [
          {
            path: "/admin/client/add",
            name: "Add",
            icon: <FaUserPlus />,
          },
          {
            path: "/admin/client/view",
            name: "View",
            icon: <FaSignInAlt />,
          },
        ],
      },
      {
        path: "/settings",
        name: "Order Booking",
        icon: <FaTruckLoading />,
        exact: true,
        subRoutes: [
          {
            path: "/admin/client/order/booking",
            name: "Add",
            icon: <FaUserPlus />,
          },
          {
            path: "/admin/client/booking/view",
            name: "View",
            icon: <FaSignInAlt />,
          },
        ],
      },
      {
        path: "/user/admin/logout",
        name: "Logout",
        icon: <FaSignOutAlt />,
      }
    );
  } else if (transporter) {
    userRoutes.push({
      path: "/property",
      name: "Property",
      icon: <MdApartment />,
      exact: true,
      subRoutes: [
        {
          path: "/user/guest/register",
          name: "Add Property",
          icon: <MdHome />,
        },
        {
          path: "/user/login",
          name: "View Property",
          icon: <MdVisibility />,
        },
      ],
    });
  } else {
    userRoutes.push({
      path: "/user/login",
      name: "Login",
      icon: <FaSignInAlt />,
    });
  }

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const inputAnimation = {
    hidden: {
      width: 0,
      padding: 0,
      transition: {
        duration: 0.2,
      },
    },
    show: {
      width: "140px",
      padding: "5px 15px",
      transition: {
        duration: 0.2,
      },
    },
  };

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      <div className="main-container">
        <motion.div
          animate={{
            width: isOpen ? "200px" : "45px",

            transition: {
              duration: 0.5,
              type: "spring",
              damping: 10,
            },
          }}
          className={`sidebar `}
        >
          <div className="top_section">
            <AnimatePresence>
              {isOpen && (
                <motion.h1
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="logo"
                >
                  <b> SmartShipD</b>
                </motion.h1>
              )}
            </AnimatePresence>

            <div className="bars">
              <FaBars onClick={toggle} />
            </div>
          </div>

          <section className="routes">
            {userRoutes.map((route, index) => {
              if (route.subRoutes) {
                return (
                  <SidebarMenu
                    setIsOpen={setIsOpen}
                    route={route}
                    showAnimation={showAnimation}
                    isOpen={isOpen}
                  />
                );
              }

              return (
                <NavLink
                  to={route.path}
                  key={index}
                  className="link"
                  activeClassName="active"
                >
                  <div className="icon text-color">{route.icon}</div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text text-color"
                      >
                        <b>{route.name}</b>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            })}
          </section>
        </motion.div>

        <main>{children}</main>
      </div>
    </>
  );
};

export default SideBar;
