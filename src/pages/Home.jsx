import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productAPI.getAll({ limit: 8 }),
        categoryAPI.getAll()
      ]);
      setFeaturedProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] font-body">
        <div className="text-2xl text-[#0B3D91] font-semibold animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-body">
      {/* Hero Section */}
      <div className="bg-[#0B3D91] text-white py-32 text-center">
        <h1 className="text-5xl md:text-6xl font-bold font-heading mb-4">
        WELCOME TO BA<span className="text-[#Fef250]">Z</span>AR
        </h1>
        {/* underline */}
        <div className="w-24 h-1 bg-[#fef250] mx-auto mb-6 rounded"></div>
        <p className="text-xl md:text-2xl mb-8">Your one-stop shop for everything you need</p>
        <Link to="/products" className="bg-[#1E90FF] hover:bg-[#87CEFA] text-white font-button px-8 py-3 rounded-lg text-lg transition inline-block shadow-lg">
          Shop Now
        </Link>
      </div>
       <div className='bg-[#Fef250] w-full h-1 '></div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold font-heading mb-8 text-center text-[#0B3D91] ">
        SHOP BY CATEGORY
        </h2>
         <div className="w-24 h-1 bg-[#fef250] mx-auto mb-6 rounded"></div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition transform hover:-translate-y-2 font-body"
            >
              <div className="text-5xl mb-4">{category.image || '📦'}</div>
              <h3 className="text-lg font-semibold font-heading">{category.name}</h3>
              <p className="text-sm">{category.Products?.length || 0} items</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="container mx-auto px-4 pb-16">
        <h2 className="text-3xl md:text-4xl font-bold font-heading mb-8 text-center text-[#0B3D91] ">
        FEATURED PRODUCTS
        </h2>
         <div className="w-24 h-1 bg-[#fef250] mx-auto mb-6 rounded"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="bg-[#87CEFA] py-16 mt-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-[#0B3D91]">
          Don’t Miss Our Latest Collection!
        </h2>
        <p className="text-lg md:text-xl mb-6">{/* Body text */}Explore the newest products and exclusive deals.</p>
        <Link to="/products" className="bg-[#0B3D91] hover:bg-[#1E90FF] text-white font-button px-8 py-3 rounded-lg text-lg transition transform hover:scale-105 shadow-md">
          Explore Now
        </Link>
      </div>
    </div>
  );
};

export default Home;
