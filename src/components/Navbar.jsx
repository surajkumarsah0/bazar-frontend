import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  
  const [  ,setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 22);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full  z-50 transition-all duration-500 bg-[#0b3d91] text-[#ffffff] shadow-lg'
      }`}
    >
      <div className="container mx-auto px-4 ">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-5xl font-bold font-heading px-4">
            BA<span className="text-[#Fef250]">Z</span>AR
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 font-heading">
            <Link className={`hover:text-[#1E90FF] transition text-[white] bg-[#0B3D91]`} to="/">
              Home
            </Link>
            <Link className={`hover:text-[#1E90FF] transition text-[white] bg-[#0B3D91]`} to="/products">
              Products
            </Link>
            {user && isAdmin && (
              <Link className={`hover:text-[#1E90FF] transition text-[white] bg-[#0B3D91]`} to="/admin">
                Admin Panel
              </Link>
            )}
            {user && (
              <Link className={`hover:text-[#1E90FF] transition text-[white] bg-[#0B3D91]`} to="/orders">
                My Orders
              </Link>
            )}
            <Link className={`relative hover:text-[#1E90FF] transition text-[white] bg-[#0B3D91]`} to="/cart">
              Cart
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF4C4C] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-[#FF4C4C] hover:bg-[#FF1A1A] px-4 py-2 rounded transition font-button"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-white text-[#0B3D91] hover:bg-[#F5F5F5] px-4 py-2 rounded transition font-button"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#0B3D91] text-white hover:bg-[#1E90FF] px-4 py-2 rounded transition font-button"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="white"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden flex flex-col space-y-2 py-4 font-heading bg-transparent shadow-md">
            <Link to="/" className="hover:text-[#1E90FF] text-[white] transition">Home</Link>
            <Link to="/products" className="hover:text-[#1E90FF] text-[white] transition">Products</Link>
            {user && isAdmin && (
              <Link to="/admin" className="hover:text-[#1E90FF] text-[white] transition">Admin Panel</Link>
            )}
            {user && (
              <Link to="/orders" className="hover:text-[#1E90FF] text-[white] transition">My Orders</Link>
            )}
            <Link to="/cart" className="relative hover:text-[#1E90FF] text-[white] transition">
              Cart
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF4C4C] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            {user ? (
              <button onClick={handleLogout} className="bg-[#FF4C4C] hover:bg-[#FF1A1A] px-4 py-2 rounded transition font-button">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="bg-white text-[#0B3D91] hover:bg-[#F5F5F5] px-4 py-2 rounded transition font-button">
                  Login
                </Link>
                <Link to="/register" className="bg-[#0B3D91] text-white hover:bg-[#1E90FF] px-4 py-2 rounded transition font-button">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
