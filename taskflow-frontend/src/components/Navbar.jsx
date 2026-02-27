import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="font-bold text-xl tracking-wide">TaskFlow</h1>

      {user && (
        <div className="flex gap-6 items-center">
          {/* Dashboard Button */}
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Dashboard
          </Link>
          <Link
            to="/profile"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Profile
          </Link>

          {/* 👑 Admin Only Link */}
          {user.role === "admin" && (
            <Link
              to="/admin"
              className="text-purple-600 hover:text-purple-800 font-medium transition"
            >
              Admin Panel
            </Link>
          )}

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
