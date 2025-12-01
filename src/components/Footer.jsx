import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <>
      <div className='bg-[#Fef250] w-full h-1 '></div>
    <footer className="bg-[#0B3D91] text-white pt-12 pb-6 font-body px-12">
      
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h3 className="text-xl font-bold font-heading mb-4">
            BA<span className="text-[#Fef250]">Z</span>AR
          </h3>
          <p className="text-sm text-[#F5F5F5]">
            Your one-stop online shop for the best products. Quality guaranteed, delivered to your doorstep.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold font-heading mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-[#1E90FF] transition font-body">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-[#1E90FF] transition font-body">
                Products
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#1E90FF] transition font-body">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#1E90FF] transition font-body">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-xl font-bold font-heading mb-4">Contact Us</h3>
          <p className="text-sm text-[#F5F5F5] mb-2 font-body">Email: support@bazar.com</p>
          <p className="text-sm text-[#F5F5F5] mb-4 font-body">Phone: +977 9000000000</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-[#1E90FF] transition">
              <FaFacebook size={24} />
            </a>
            <a href="#" className="hover:text-[#1E90FF] transition">
              <FaInstagram size={24} />
            </a>
            <a href="#" className="hover:text-[#1E90FF] transition">
              <FaTwitter size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-[#1E90FF] mt-8 pt-4 text-center text-sm text-[#F5F5F5] font-body">
        &copy; {new Date().getFullYear()} BA<span className="text-[#Fef250]">Z</span>AR. All rights reserved.
      </div>
    </footer>
    </>
  );
};

export default Footer;
