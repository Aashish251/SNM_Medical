'use client';
import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaFileExport, FaUserPlus } from 'react-icons/fa';
import Image from 'next/image';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import Logo from '@/public/snmlogo.jpeg';
import { motion } from 'framer-motion';

export default function MasterSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [activeTab, setActiveTab] = useState('master-search');
  const [] = useState<string | null>(null);
  const [showReports, setShowReports] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const reportsRef = useRef<HTMLDivElement>(null);
    const services = [
        { title: 'Free Medical Camps', description: 'Organizing free medical camps in underserved areas.' },
        { title: 'Health Awareness Programs', description: 'Conducting health awareness programs on various topics.' },
        { title: 'Medical Consultations', description: 'Providing free medical consultations to those in need.' },
        { title: 'Emergency Response', description: 'Offering emergency medical response during disasters.' }
    ];
  
  // Sample data - replace with your actual data source
  const userData = [
    {
      reg_id: 1,
      name: 'Pratik Ka...',
      contact: '8965747...',
      qualification: 'IT',
      sewa_location: 'D1',
      shift_time: 'All',
      department: 'Admin',
      email: 'p.k@gm...',
      birthdate: '15/10/1988',
      pass_entry: 'Yes',
      is_present: 'Yes',
      certificate: 'View'
    },
    {
      reg_id: 2,
      name: 'Sandeep ...',
      contact: '9876567...',
      qualification: 'IT',
      sewa_location: 'D1',
      shift_time: 'All',
      department: 'Admin',
      email: 's.s@gma...',
      birthdate: '18/02/1990',
      pass_entry: 'Yes',
      is_present: 'Yes',
      certificate: 'View'
    }
  ];

  const [formData, setFormData] = useState({
    isPresent: false,
    passEntry: false,
    isAdmin: false,
    isActive: false,
    sewaLocation: '',
    samagamHeldIn: '',
    remarks: ''
  });

  const navItems = [
    { id: 'home', href: '/', name: 'Home' },
    { id: 'update-profile', href:'/registrationpage', name: 'Update Profile' },
    { id: 'master-search', href:'/master',name: 'Master Search' },
    { id: 'duty-chart',href: '/DutyChart', name: 'Duty Chart' },
    { id: 'reports', name: 'Reports', children: [
       { id: 'daily-report', href: 'daily-report', name: 'Daily Report' },
      { id: 'registration-report', href: 'registration-report', name: 'Registration Report' },
      { id: 'master-report', href: 'master-report', name: 'Master Report' }
    ]},
    { id: 'sign-out', href: '/login', name: 'Sign Out' }
  ];


  // Handle profile image upload

  // Trigger file input click

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    setShowAddUser(false);
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-10 h-10 backdrop-blur-md flex items-center justify-center text-white p-2 rounded-md shadow-lg bg-purple-600"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 via-pink-500 to-amber-500 shadow-lg py-2 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex items-center">
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
              <div className="  bg-opacity-20 rounded-lg shadow-xl w-60 z-50 z-40 lg:hidden">
                <div className="absolute top-16 right-4 lg:flex lg:flex border-b border-white border-opacity- fixed border-b border-white border-opacity-70-blur bg-opacity-200 backdrop-blur-md md:hidden  rounded-lg shadow-x2 w-64 z-70">
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

      <main className="flex-1 container mx-auto w-full px-4 py-6 space-y-6">
        

        {/* Master Search Content */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, reg id, contact..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent">
                <option value="">All</option>
                <option value="Admin">Admin</option>
                <option value="Medical">Medical</option>
                <option value="Volunteer">Volunteer</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent">
                <option value="">All</option>
                <option value="MBBS">MBBS</option>
                <option value="BSc">BSc</option>
                <option value="IT">IT</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sewa Location</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent">
                <option value="">All</option>
                <option value="D1">D1</option>
                <option value="D2">D2</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:from-purple-700 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
                onClick={() => setShowAddUser(!showAddUser)}
              >
                <FaUserPlus /> <span className="hidden sm:inline">Add User</span>
              </button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
            <div className="flex gap-2">
              <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm flex items-center gap-1">
                <input type="checkbox" className="mr-1" /> IsPresent
              </button>
              <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm flex items-center gap-1">
                <input type="checkbox" className="mr-1" /> PassEntry
              </button>
            </div>
            
            <div className="flex gap-2">
              <button className="bg-purple-600 text-white px-4 py-1 rounded-md text-sm flex items-center gap-1">
                <FaSearch /> Search
              </button>
              <button className="bg-green-600 text-white px-4 py-1 rounded-md text-sm flex items-center gap-1">
                <FaFileExport /> Export
              </button>
            </div>
          </div>
        </div>

        {/* Add User Role Form - Conditionally Rendered */}
        {showAddUser && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-purple-700">Add User Role</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPresent"
                    name="isPresent"
                    checked={formData.isPresent}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPresent" className="ml-2 block text-sm text-gray-700">
                    Is Present
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="passEntry"
                    name="passEntry"
                    checked={formData.passEntry}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="passEntry" className="ml-2 block text-sm text-gray-700">
                    Pass Entry
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    name="isAdmin"
                    checked={formData.isAdmin}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-700">
                    Is Admin
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Is Active
                  </label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="sewaLocation" className="block text-sm font-medium text-gray-700 mb-1">
                    Sewa Location
                  </label>
                  <select
                    id="sewaLocation"
                    name="sewaLocation"
                    value={formData.sewaLocation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  >
                    <option value="">Select Location</option>
                    <option value="D1">D1</option>
                    <option value="D2">D2</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="samagamHeldIn" className="block text-sm font-medium text-gray-700 mb-1">
                    Samagam Held In
                  </label>
                  <input
                    type="text"
                    id="samagamHeldIn"
                    name="samagamHeldIn"
                    value={formData.samagamHeldIn}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks
                  </label>
                  <input
                    type="text"
                    id="remarks"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg shadow-md hover:from-purple-700 hover:to-pink-600 transition-all"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-purple-700 via-pink-500 to-amber-500 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Reg_id</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">Qualifica...</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">Sewa Lo...</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Shift Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider hidden xl:table-cell">Department...</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider hidden 2xl:table-cell">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider hidden 2xl:table-cell">Birthdate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Pass Entry</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Is Present</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Certificate</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userData.map((user, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{user.reg_id}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{user.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{user.contact}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">{user.qualification}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell">{user.sewa_location}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">{user.shift_time}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden xl:table-cell">{user.department}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden 2xl:table-cell">{user.email}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden 2xl:table-cell">{user.birthdate}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{user.pass_entry}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{user.is_present}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-purple-600 hover:text-purple-800 cursor-pointer">
                      {user.certificate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-12 pb-6 md:pt-16 md:pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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