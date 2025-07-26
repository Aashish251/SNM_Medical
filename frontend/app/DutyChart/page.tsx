'use client';
import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaFileExport, FaCalendarAlt } from 'react-icons/fa';
import Image from 'next/image';
import {  IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import {  BsClockFill } from 'react-icons/bs';
import { MdLocationOn, MdPeople } from 'react-icons/md';
import Logo from '@/public/snmlogo.jpeg';
import { motion } from 'framer-motion';

export default function DutyChart() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('duty-chart');
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
  const dutyData = [
    {
      id: 1,
      name: 'Pratik K.',
      department: 'Admin',
      location: 'D1 - Registration',
      date: '15/07/2023',
      shift: 'Morning (8AM-2PM)',
      team: 'Logistics'
    },


  // Sample duty chart data
 
    {
      id: 2,
      name: 'Sandeep S.',
      department: 'Medical',
      location: 'D2 - Camp 1',
      date: '15/07/2023',
      shift: 'Afternoon (2PM-8PM)',
      team: 'Consultation'
    },
    {
      id: 3,
      name: 'Rahul M.',
      department: 'Volunteer',
      location: 'D1 - Registration',
      date: '15/07/2023',
      shift: 'Evening (8PM-2AM)',
      team: 'Logistics'
    },
    {
      id: 4,
      name: 'Priya T.',
      department: 'Medical',
      location: 'D2 - Camp 2',
      date: '16/07/2023',
      shift: 'Morning (8AM-2PM)',
      team: 'Pharmacy'
    }
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
      <div className="lg:hidden fixed top-3 right-3 z-50">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-10 h-10 backdrop-blur-md text-white p-2 rounded-md shadow-lg bg-purple-600"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 via-pink-500 to-amber-500 shadow-lg py-2 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
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
          
          {/* Desktop Navbar */}
          <nav className="hidden lg:flex items-center space-x-2 sm:space-x-4">
            {navItems.map((item) => (
              <div key={item.id} className="relative group" ref={item.id === 'reports' ? reportsRef : null}>
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
                          if (child.href) {
                            window.location.href = child.href;
                          }
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

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 space-y-6">
       

        {/* Duty Chart Content */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, department, location..."
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
                <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
            
            <div className="flex items-end">
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:from-purple-700 hover:to-pink-600 transition-all flex items-center justify-center gap-2">
                <FaSearch /> Search
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm flex items-center gap-1">
                <input type="checkbox" className="mr-1" /> Morning
              </button>
              <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm flex items-center gap-1">
                <input type="checkbox" className="mr-1" /> Afternoon
              </button>
              <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm flex items-center gap-1">
                <input type="checkbox" className="mr-1" /> Evening
              </button>
            </div>
            
            <div className="flex gap-2">
              <button className="bg-green-600 text-white px-4 py-1 rounded-md text-sm flex items-center gap-1">
                <FaFileExport /> Export
              </button>
            </div>
          </div>
        </div>

        {/* Duty Chart Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-purple-700 via-pink-500 to-amber-500 text-white">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">Department</th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">Location</th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">Shift</th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">Team</th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dutyData.map((duty, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{duty.id}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{duty.name}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{duty.department}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center">
                        <MdLocationOn className="text-purple-600 mr-1" />
                        <span className="truncate max-w-[100px] md:max-w-none">{duty.location}</span>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{duty.date}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center">
                        <BsClockFill className="text-purple-600 mr-1" />
                        <span className="truncate max-w-[100px] md:max-w-none">{duty.shift}</span>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center">
                        <MdPeople className="text-purple-600 mr-1" />
                        {duty.team}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-purple-600 hover:text-purple-800 cursor-pointer">
                      <button className="bg-purple-100 px-3 py-1 rounded-md text-xs">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src={Logo}
                  alt="Sant Nirankari Mission Logo"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white"
                />
                <span className="text-lg font-bold">Medical Sewa</span>
              </div>
              <p className="text-gray-400 mb-6 text-sm">
                Providing compassionate healthcare services to underserved communities through the Sant Nirankari Mission.
              </p>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                  <motion.a 
                    key={social}
                    whileHover={{ scale: 1.1 }}
                    href={`#${social}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                      <span className="text-sm">{social === 'facebook' ? 'f' : social.charAt(0).toUpperCase()}</span>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-base font-bold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {['Home', 'About', 'Services', 'Gallery', 'Contact'].map((link) => (
                  <li key={link}>
                    <motion.a 
                      whileHover={{ scale: 1.05 }}
                      href={`#${link.toLowerCase()}`}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-base font-bold mb-4">Our Services</h3>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service.title}>
                    <motion.a 
                      whileHover={{ scale: 1.05 }}
                      href="#services"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {service.title}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-base font-bold mb-4">Contact Us</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5">📍</span>
                  <span>123 Medical Street, Health District, New Delhi, India</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5">📞</span>
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-0.5">✉️</span>
                  <span>info@medicalsewa.org</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Medical Sewa. All rights reserved.</p>
            <p className="mt-2">A Sant Nirankari Mission Initiative</p>
          </div>
        </div>
      </footer>
    </div>
  );
}