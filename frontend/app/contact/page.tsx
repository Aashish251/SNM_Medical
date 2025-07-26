'use client';
import React, { useState, useRef, useEffect } from 'react';
import {  FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import Image from 'next/image';
import {  IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import {  } from 'react-icons/bs';
import Logo from '@/public/snmlogo.jpeg';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showReports, setShowReports] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('contact');
  const [formData, setFormData] = useState({
    // Initial form data state
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportsRef = useRef<HTMLDivElement>(null);
    const services = [
        { title: 'Free Medical Camps', description: 'Organizing free medical camps in underserved areas.' },
        { title: 'Health Awareness Programs', description: 'Conducting health awareness programs on various topics.' },
        { title: 'Medical Consultations', description: 'Providing free medical consultations to those in need.' },
        { title: 'Emergency Response', description: 'Offering emergency medical response during disasters.' }
    ];

  const navItems = [
    { id: 'home', href: '/', name: 'Home' },
    { id: 'update-profile', href:'/registrationpage', name: 'Update Profile' },
    { id: 'master-search', href:'/master',name: 'Master Search' },
    { id: 'duty-chart', href: '/DutyChart', name: 'Duty Chart' },
    { id: 'reports', name: 'Reports', children: [
          { id: 'daily-report', href: 'daily-report', name: 'Daily Report' },
      { id: 'registration-report', href: 'registration-report', name: 'Registration Report' },
      { id: 'master-report', href: 'master-report', name: 'Master Report' }
    ]},
    { id: 'about', href: '/about', name: 'About Us' },
    { id: 'contact', href: '/contact', name: 'Contact Us' },
    { id: 'sign-out', href: '/login', name: 'Sign Out' }
  ];


  // Handle profile image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const handleProfileClick = () => {
    fileInputRef.current?.click();
  };

  // Close reports dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (reportsRef.current && !reportsRef.current.contains(event.target as Node)) {
        setShowReports(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check if any report child is active
  const isReportChildActive = navItems
    .find(item => item.id === 'reports')
    ?.children?.some(child => child.id === activeTab) || false;

  // Handle navigation
  const handleTabClick = (id: string) => {
    if (id === 'reports') {
      setShowReports(!showReports);
    } else {
      setActiveTab(id);
      setShowReports(false);
      setIsMenuOpen(false);
      const item = navItems.find(item => item.id === id);
      if (item?.href) {
        window.location.href = item.href;
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    // Hide success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="max-h-screen flex flex-col bg-gray-70 font-sans">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-3 right-3 z-100">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-7 h-5 backdrop-blur-md md:hidden text-white p-2 rounded-md shadow-lg bg-white-700"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 via-pink-500 to-amber-500 shadow-lg py-2 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 flex items-center">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-full p-1 flex items-center justify-center">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                <Image 
                  src={Logo} 
                  alt="Medical Sewa Logo" 
                  layout="fill"
                  objectFit="contain"
                  className="rounded-full"
                />
              </div>
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Medical Sewa</h1>
          </div>
          
          {/* Navbar */}
          <nav className="hidden lg:flex items-center ml-auto space-x-2 sm:space-x-4">
            {navItems.map((item) => (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => handleTabClick(item.id)}
                  className={`px-3 py-2 sm:px-4 sm:py-3 font-medium whitespace-nowrap rounded-md transition-all flex items-center
                    ${
                      activeTab === item.id || 
                      (item.id === 'reports' && (showReports || isReportChildActive))
                        ? "bg-white text-indigo-700"
                        : 'text-white hover:text-purple-900 hover:bg-white'
                    }`}
                >
                  {item.name}
                  {item.children && (
                    <span className="ml-1">
                      {showReports ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </span>
                  )}
                </button>
                {/* Dropdown for Reports */}
                {item.children && showReports && (
                  <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-md overflow-hidden z-20">
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => {
                          setActiveTab(child.id);
                          setShowReports(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-gray-700 hover:bg-purple-50 transition-colors flex items-center
                          ${activeTab === child.id ? 'bg-white-50 text-purple-700 font-medium' : ''}`}
                      >
                        <span className="ml-2">{child.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="bg-opacity-20 rounded-lg shadow-xl w-60 z-50 z-40 lg:hidden">
          <div className="absolute top-16 right-4 lg:flex lg:flex border-b border-white border-opacity- fixed border-b border-white border-opacity-70-blur bg-opacity-200 backdrop-blur-md md:hidden rounded-lg shadow-x2 w-64 z-70">
            <div className="py-2">
              {navItems.map((item) => (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => handleTabClick(item.id)}
                    className={`block px-2 py-5 rounded-x1 text-sm font-medium text-black rounded-lg shadow-xl w-64 z-50 border-b hover:bg-purple-600/30 transition-colors
                      ${
                        activeTab === item.id || 
                        (item.id === 'reports' && (showReports || isReportChildActive))
                          ? "bg-purple-50 text-purple-700 font-medium"
                          : 'text-black-b-700 hover:bg-purple-100'
                      }`}
                  >
                    {item.name}
                    {item.children && (
                      <span>
                        {showReports ? <IoIosArrowUp /> : <IoIosArrowDown />}
                      </span>
                    )}
                  </button>
                  
                  {/* Dropdown for Reports in mobile */}
                  {item.children && showReports && (
                    <div className="pl-4 bg-gray-50">
                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => {
                            setActiveTab(child.id);
                            setShowReports(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-gray-700 hover:bg-purple-50 transition-colors flex items-center
                            ${activeTab === child.id ? 'bg-purple-50 text-purple-700 font-medium' : ''}`}
                        >
                          <span className="ml-2">{child.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Profile Section */}
       

        {/* Contact Us Content */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-purple-700 mb-2">Contact Us</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Have questions or need assistance? Reach out to our team and we&apos;ll get back to you as soon as possible.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-purple-600 mb-4">Contact Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-purple-100 p-2 rounded-full mr-4">
                        <FaMapMarkerAlt className="text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Address</h4>
                        <p className="text-gray-600">123 Medical Sewa Lane<br />Health City, HC 12345</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-purple-100 p-2 rounded-full mr-4">
                        <FaPhone className="text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Phone</h4>
                        <p className="text-gray-600">+1 (123) 456-7890<br />+1 (987) 654-3210</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-purple-100 p-2 rounded-full mr-4">
                        <FaEnvelope className="text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Email</h4>
                        <p className="text-gray-600">info@medicalsewa.org<br />support@medicalsewa.org</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-purple-100 p-2 rounded-full mr-4">
                        <FaClock className="text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Working Hours</h4>
                        <p className="text-gray-600">Monday - Friday: 9:00 - 17:00<br />Saturday: 10:00 - 14:00</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg shadow-sm">
                  <div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215209132828!2d-73.987844924525!3d40.74844047138961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzU0LjQiTiA3M8KwNTknMTQuMiJX!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus" 
                      width="100%" 
                      height="300" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy"
                      className="rounded-md"
                    ></iframe>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-purple-600 mb-4">Send Us a Message</h3>
                
                {isSubmitted && (
                  <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                    Thank you for your message! We&#39;ll get back to you soon.
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Volunteer Opportunity">Volunteer Opportunity</option>
                      <option value="Medical Services">Medical Services</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-600 transition-all shadow-md"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

       {/* Footer */}
            <footer className="bg-gray-900 text-white pt-12 pb-6 md:pt-16 md:pb-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  <div>
                    <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                      <Image
                        src={Logo}
                        alt="Sant Nirankari Mission Logo"
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-white"
                      />
                      <span className="text-lg md:text-xl font-bold">Medical Sewa</span>
                    </div>
                    <p className="text-gray-400 mb-4 md:mb-6 text-sm md:text-base">
                      Providing compassionate healthcare services to underserved communities through the Sant Nirankari Mission.
                    </p>
                    <div className="flex space-x-3 md:space-x-4">
                      {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                        <motion.a 
                          key={social}
                          whileHover={{ scale: 1.1 }}
                          href={`#${social}`}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <span className="sr-only">{social}</span>
                          <div className="w-7 h-7 md:w-8 md:h-8 bg-gray-800 rounded-full flex items-center justify-center">
                            <span className="text-sm md:text-base">{social === 'facebook' ? 'f' : social.charAt(0).toUpperCase()}</span>
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base md:text-lg font-bold mb-3 md:mb-6">Quick Links</h3>
                    <ul className="space-y-2 md:space-y-3">
                      {['Home', 'About', 'Services', 'Gallery', 'Contact'].map((link) => (
                        <li key={link}>
                          <motion.a 
                            whileHover={{ scale: 1.05 }}
                            href={`#${link.toLowerCase()}`}
                            className="text-gray-400 hover:text-white transition-colors text-sm md:text-base"
                          >
                            {link}
                          </motion.a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-base md:text-lg font-bold mb-3 md:mb-6">Our Services</h3>
                    <ul className="space-y-2 md:space-y-3">
                      {services.map((service) => (
                        <li key={service.title}>
                          <motion.a 
                            whileHover={{ scale: 1.05 }}
                            href="#services"
                            className="text-gray-400 hover:text-white transition-colors text-sm md:text-base"
                          >
                            {service.title}
                          </motion.a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-base md:text-lg font-bold mb-3 md:mb-6">Contact Us</h3>
                    <ul className="space-y-2 md:space-y-3 text-gray-400">
                      <li className="flex items-start">
                        <span className="mr-2 mt-0.5">📍</span>
                        <span className="text-sm md:text-base">123 Medical Street, Health District, New Delhi, India</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 mt-0.5">📞</span>
                        <span className="text-sm md:text-base">+91 98765 43210</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 mt-0.5">✉️</span>
                        <span className="text-sm md:text-base">info@medicalsewa.org</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8 text-center text-gray-500 text-xs md:text-sm">
                  <p>© {new Date().getFullYear()} Medical Sewa. All rights reserved.</p>
                  <p className="mt-1 md:mt-2">A Sant Nirankari Mission Initiative</p>
                </div>
              </div>
            </footer>
    </div>
  );
}