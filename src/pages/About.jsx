import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 mt-12">
        <h1 className="text-4xl font-bold text-[#0B3D91] mb-6 font-heading text-center">ABOUT   BA<span className="text-[#Fef250]">Z</span>AR </h1>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-[#0B3D91] text-lg leading-relaxed mb-4">
            Welcome to BA<span className="text-[#Fef250]">Z</span>AR! We are committed to providing you with the best shopping experience online. Our mission is to offer high-quality products, excellent customer service, and a seamless shopping journey from start to finish.
          </p>
          
          <p className="text-[#0B3D91] text-lg leading-relaxed mb-4">
            At BA<span className="text-[#Fef250]">Z</span>AR, you can find a wide range of products, including electronics, home goods, fashion, and much more. We carefully select our products to ensure you receive only the best quality items at competitive prices.
          </p>

          <p className="text-[#0B3D91] text-lg leading-relaxed">
            Our team is passionate about helping you find exactly what you need. Whether you're shopping for yourself or looking for the perfect gift, we are here to make your experience enjoyable and hassle-free.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
