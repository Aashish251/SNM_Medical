'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image, { StaticImageData } from 'next/image';
import { FaChartPie, FaBars, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import ApiService from '@/lib/api';

// Chart.js components
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// Icons
import { IoIosMail, IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { BsFillPersonFill, BsFillCameraFill, BsGraphUp } from 'react-icons/bs';
import { motion } from 'framer-motion';

// Images
import Logo from '@/public/snmlogo.jpeg';
import DoctorsImage from '@/public/Doctors.png';
import NursesImage from '@/public/Nurse.png';
import DressingImage from '@/public/Dressing.png';
import ParamedicalImage from '@/public/Paramedical.png';
import PathologyImage from '@/public/Pathology.png';
import AcupunctureImage from '@/public/Acupressure.png';
import PharmacyImage from '@/public/Pharmacy.png';
import PhysiotherapyImage from '@/public/Physiotherapy.png';
import HomeopathyImage from '@/public/Homeopathy.png';
import AmbulanceImage from '@/public/Ambulance.png';
import RegistrationImage from '@/public/Registration.png';
import LabTechImage from '@/public/Lab-Tech.png';

// Department image mapping
const departmentImages: { [key: string]: StaticImageData } = {
  'Admin': DoctorsImage,
  'Doctors': DoctorsImage,
  'Nursing': NursesImage,
  'Nurses': NursesImage,
  'Dressing': DressingImage,
  'Paramedical': ParamedicalImage,
  'Pathology': PathologyImage,
  'Acupuncture': AcupunctureImage,
  'Accupressure': AcupunctureImage,
  'Pharmacy': PharmacyImage,
  'Physiotherapy': PhysiotherapyImage,
  'Homeopathy': HomeopathyImage,
  'Ambulance': AmbulanceImage,
  'Registration': RegistrationImage,
  'Lab': LabTechImage,
  'Lab-Tech': LabTechImage,
};

interface UserData {
  name: string;
  role: string;
  qualification: string;
  email: string;
  mobile: string;
  department: string;
  profileImage: string | null;
}

interface StatData {
  title: string;
  value: number;
  color: string;
  image: StaticImageData;
}

export default function Dashboard() {
  const [selectedMonth] = useState('JUL');
  const [activeTab, setActiveTab] = useState('home');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showReports, setShowReports] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // ✅ Dynamic data states
  const [userData, setUserData] = useState<UserData>({
    name: 'Mr. Pratik Ji', // Default fallback
    role: 'Medical Sewadar',
    qualification: 'MBA, MD',
    email: '',
    mobile: '',
    department: '',
    profileImage: null
  });
  
  const fixImageSrc = (src: string | null): string | null => {
  if (!src) return null;
  
  // If it's already a valid URL format, return as is
  if (src.startsWith('http://') || 
      src.startsWith('https://') || 
      src.startsWith('data:') || 
      src.startsWith('/')) {
    return src;
  }
  
  // Add leading slash to relative paths
  return '/' + src;
};

  const [statsData, setStatsData] = useState<StatData[]>([
    // Default fallback data with your preferred structure
    { title: 'Doctors', value: 520, color: '#EC4899', image: DoctorsImage },
    { title: 'Nurses', value: 5959, color: '#3B82F6', image: NursesImage },
    { title: 'Dressing', value: 520, color: '#F59E0B', image: DressingImage },
    { title: 'Paramedical', value: 5969, color: '#10B981', image: ParamedicalImage },
    { title: 'Pathology', value: 520, color: '#8B5CF6', image: PathologyImage },
    { title: 'Acupuncture', value: 6969, color: '#06B6D4', image: AcupunctureImage },
    { title: 'Pharmacy', value: 7509, color: '#EC4899', image: PharmacyImage },
    { title: 'Physiotherapy', value: 2110, color: '#3B82F6', image: PhysiotherapyImage },
    { title: 'Homeopathy', value: 7509, color: '#F59E0B', image: HomeopathyImage },
    { title: 'Ambulance', value: 2110, color: '#10B981', image: AmbulanceImage },
    { title: 'Registration', value: 7509, color: '#8B5CF6', image: RegistrationImage },
    { title: 'Lab-Tech', value: 2110, color: '#06B6D4', image: LabTechImage },
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // ✅ Fetch real data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        // Check authentication
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        console.log('🔍 Fetching dashboard data...');

        // Fetch user profile and dashboard stats
        const [profileResponse, statsResponse] = await Promise.all([
          ApiService.getUserProfile().catch(err => ({ success: false, error: err.message })),
          ApiService.getDashboardStats().catch(err => ({ success: false, error: err.message }))
        ]);

        // Update user data if successful
        if (profileResponse.success && profileResponse.data) {
          setUserData({
            name: profileResponse.data.name || 'Mr. Pratik Ji',
            role: profileResponse.data.role || 'Medical Sewadar',
            qualification: profileResponse.data.qualification || 'MBA, MD',
            email: profileResponse.data.email || '',
            mobile: profileResponse.data.mobile || '',
            department: profileResponse.data.department || '',
            profileImage: profileResponse.data.profileImage || null
          });
          
          // Update profile image state
          if (profileResponse.data.profileImage) {
            setProfileImage(profileResponse.data.profileImage);
          }
          
          console.log('✅ User profile loaded:', profileResponse.data.name);
        }

        // Update stats data if successful
        if (statsResponse.success && statsResponse.data && statsResponse.data.stats) {
          const mappedStats = statsResponse.data.stats.map((stat: any, index: number) => ({
            title: stat.title,
            value: stat.value || 0,
            color: stat.color || '#6B7280',
            image: departmentImages[stat.title] || departmentImages['Doctors'] || DoctorsImage
          }));

          // Ensure we have exactly 12 items to match your static layout
          while (mappedStats.length < 12) {
            const fallbackStat = statsData[mappedStats.length % statsData.length];
            mappedStats.push({
              title: fallbackStat.title,
              value: 0,
              color: fallbackStat.color,
              image: fallbackStat.image
            });
          }

          setStatsData(mappedStats.slice(0, 12)); // Keep exactly 12 items
          console.log('✅ Dashboard stats loaded:', mappedStats.length, 'departments');
        }

      } catch (err: any) {
        console.error('❌ Dashboard data fetch error:', err);
        setError('Unable to load some dashboard data. Using cached information.');
        
        // Don't redirect on error, just show error message and use fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  // Navigation items
  const navItems = [
    { id: 'home', href: '/', name: 'Home' },
    { id: 'update-profile', href: '/registrationpage', name: 'Update Profile' },
    { id: 'master-search', href: '/master', name: 'Master Search' },
    { id: 'duty-chart', href: '/DutyChart', name: 'Duty Chart' },
    { 
      id: 'reports', 
      name: 'Reports', 
      children: [
        { id: 'daily-report', href: '/daily-report', name: 'Daily Report' },
        { id: 'registration-report', href: '/registration-report', name: 'Registration Report' },
        { id: 'master-report', href: '/master-report', name: 'Master Report' }
      ]
    },
    { id: 'sign-out', name: 'Sign Out' }
  ];

  // Define services for the footer
  const services = [
    { title: 'Medical Camps' },
    { title: 'Outreach Programs' },
    { title: 'Patient Care' },
    { title: 'Pathology' },
    { title: 'Pharmacy' },
    { title: 'Physiotherapy' },
    { title: 'Homeopathy' },
    { title: 'Ambulance Services' },
    { title: 'Acupuncture' },
    { title: 'Dressing' },
    { title: 'Paramedical Services' },
    { title: 'Registration' },
    { title: 'Lab Technician Services' }
  ];

  // ✅ Logout function
  const handleLogout = async () => {
    try {
      console.log('🔍 Logging out user...');
      localStorage.clear();
      sessionStorage.clear();

      try {
        await ApiService.logout();
      } catch (apiError) {
        console.warn('API logout failed:', apiError);
      }

      console.log('✅ User logged out successfully');
      window.location.href = '/login';
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    }
  };

  // Handle profile image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
          // Update userData as well
          setUserData(prev => ({ ...prev, profileImage: event.target!.result as string }));
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

  // ✅ Handle navigation with sign-out
  const handleTabClick = (id: string) => {
    console.log('🔍 Navigation clicked:', id);

    if (id === 'reports') {
      setShowReports(!showReports);
    } else if (id === 'sign-out') {
      console.log('🔍 Sign out clicked');
      handleLogout();
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

  // Extract data for charts
  const chartLabels = statsData.map(stat => stat.title);
  const chartData = statsData.map(stat => stat.value);
  const chartColors = statsData.map(stat => stat.color);

  // ✅ Loading overlay (subtle, preserves your UI)
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* ✅ Error banner (non-intrusive) */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header - EXACT SAME AS YOUR STATIC VERSION */}
      <header className="bg-gradient-to-r from-purple-700 via-pink-500 to-amber-500 shadow-lg py-3 sticky top-0 z-50">
        <div className="max-w-8xl mx-auto px-4 flex justify-between items-center">
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
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.id} className="relative group" ref={item.id === 'reports' ? reportsRef : null}>
                <button
                  onClick={() => handleTabClick(item.id)}
                  className={`px-3 py-2 font-medium whitespace-nowrap rounded-md transition-all flex items-center
                    ${
                      activeTab === item.id || 
                      (item.id === 'reports' && (showReports || isReportChildActive))
                        ? "bg-white text-indigo-700 shadow-inner"
                        : 'text-white hover:text-purple-900 hover:bg-white/90'
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
                  <div className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-md overflow-hidden z-20 border border-gray-200">
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
                        className={`w-full px-4 py-3 text-left text-gray-700 hover:bg-purple-50 transition-colors flex items-center border-b border-gray-100 last:border-b-0
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
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white p-2 rounded-md"
          >
            {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation - EXACT SAME AS STATIC VERSION */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-opacity-30 backdrop-blur-sm" 
            onClick={() => setIsMenuOpen(false)}
          ></div>
          <div className="relative z-50">
            <div className="fixed top-0 right-0 h-full w-64 bg-gradient-to-b from-purple-800/90 to-pink-600/90 shadow-xl backdrop-blur-lg">
              <div className="p-4 flex justify-between items-center border-b border-white/20">
                <div className="flex items-center space-x-2">
                  <div className="bg-white rounded-full p-1">
                    <div className="relative w-8 h-8">
                      <Image 
                        src={Logo} 
                        alt="Medical Sewa Logo" 
                        layout="fill"
                        objectFit="contain"
                        className="rounded-full"
                      />
                    </div>
                  </div>
                  <span className="text-white font-bold">Medical Sewa</span>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="text-white">
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
              
              <div className="py-4 overflow-y-auto h-full">
                {navItems.map((item) => (
                  <div key={item.id} className="relative">
                    <button
                      onClick={() => handleTabClick(item.id)}
                      className={`w-full px-6 py-4 text-left font-medium flex items-center justify-between
                        ${
                          activeTab === item.id || 
                          (item.id === 'reports' && (showReports || isReportChildActive))
                            ? "bg-white/20 text-white"
                            : 'text-white/90 hover:bg-white/10'
                        }`}
                    >
                      <span>{item.name}</span>
                      {item.children && (
                        <span>
                          {showReports ? <IoIosArrowUp /> : <IoIosArrowDown />}
                        </span>
                      )}
                    </button>
                    
                    {/* Dropdown for Reports in mobile */}
                    {item.children && showReports && (
                      <div className="pl-6 bg-purple-900/30">
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
                            className={`w-full px-4 py-3 text-left text-white/90 hover:bg-white/10 transition-colors flex items-center
                              ${activeTab === child.id ? 'bg-white/20' : ''}`}
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
        </div>
      )}

      <main className="flex-1 max-w-9xl mx-auto w-full px-1 py-1 space-y-1">
        {/* Profile Section - EXACT SAME LAYOUT, DYNAMIC DATA */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col p-1">
            <div className="flex flex-col sm:flex-row items-start gap-4 w-full">
              <div className="flex flex-col">
                <div className="relative group w-full flex-col">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-full p-1.5 cursor-pointer flex justify-center"
                    onClick={handleProfileClick}
                  >
                  {profileImage || userData.profileImage ? (
                    <div className="bg-gray-200 border-2 border-dashed rounded-full w-32 h-32 sm:w-40 sm:h-40 overflow-hidden">
                      <Image
                        src={fixImageSrc(profileImage || userData.profileImage) || '/default-avatar.png'}
                        alt="Profile"
                        width={160}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-full w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
                      <BsFillPersonFill className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  {/* Header Profile Image */}
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                    {userData?.profileImage ? (
                      <Image
                        src={fixImageSrc(userData.profileImage) || '/default-avatar.png'}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white flex items-center justify-center">
                        <BsFillPersonFill className="text-gray-400 text-lg" />
                      </div>
                    )}
                  </div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white rounded-full p-2 shadow-md cursor-pointer group-hover:bg-gray-100 transition-colors">
                    <BsFillCameraFill className="h-5 w-5 text-purple-600" />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                
                <div className="text-center sm:text-left mt-4 ml-5">
                  {/* ✅ Dynamic user data */}
                  <h2 className="text-2xl font-bold text-gray-800">{userData.name}</h2>
                  <div className="mt-4 flex flex-col items-center sm:items-start space-y-2">
                    <div className="flex items-center text-gray-600">
                      <IoIosMail className="mr-2 text-purple-600" />
                      <span>{userData.qualification}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 sm:h-65 w-full mt-2 sm:mt-0">
                <div className="relative rounded-xl overflow-hidden w-full h-10 sm:h-96">
                  <Image
                    src="/satgurumataji1.png"
                    alt="Medical Services"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    className="rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent flex items-end p-6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>  
        
        {/* Stats Grid - EXACT SAME LAYOUT, DYNAMIC DATA */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {statsData.map((stat, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg flex flex-row items-center justify-between"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center h-16 bg-gray-50 p-1">
                <div className="relative w-10 h-10">
                  <Image
                    src={stat.image}
                    alt={stat.title}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              
              <div className="p-3 text-center flex-grow flex flex-row justify-between">
                {/* ✅ Dynamic values */}
                <div className="text-xl font-bold" style={{ color: stat.color }}>
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-gray-700 mt-1 text-xs sm:text-sm">{stat.title}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section - EXACT SAME LAYOUT, DYNAMIC DATA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Graph */}
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <BsGraphUp className="text-purple-600" />
                Service Utilization ({selectedMonth} 2023)
              </h4>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                {selectedMonth} 2023
              </span>
            </div>
            <div className="w-full h-96">
              <Bar
                data={{
                  labels: chartLabels,
                  datasets: [
                    {
                      label: 'Patient Count',
                      data: chartData,
                      backgroundColor: chartColors,
                      borderRadius: 6,
                    }
                  ]
                }}
                options={{
                  indexAxis: 'y',
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      backgroundColor: '#1f2937',
                      titleFont: { size: 14 },
                      bodyFont: { size: 12 },
                      padding: 12,
                      usePointStyle: true,
                      callbacks: {
                        label: function(context) {
                          return `${context.parsed.x.toLocaleString()} patients`;
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      grid: {
                        color: '#f3f4f6'
                      },
                      ticks: {
                        color: '#6b7280',
                        callback: function(value) {
                          return value;
                        }
                      },
                      beginAtZero: true,
                      border: {
                        display: false
                      }
                    },
                    y: {
                      grid: {
                        display: false
                      },
                      ticks: {
                        color: '#6b7280',
                        font: {
                          size: 11
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          
          {/* Doughnut Chart */}
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaChartPie className="text-pink-500" />
                Service Distribution
              </h4>
              <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
                Top Services
              </span>
            </div>
            <div className="w-full h-96">
              <Doughnut
                data={{
                  labels: chartLabels,
                  datasets: [{
                    data: chartData,
                    backgroundColor: chartColors,
                    borderWidth: 0,
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: '65%',
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        boxWidth: 12,
                        padding: 12,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: {
                          size: 10
                        }
                      }
                    },
                    tooltip: {
                      backgroundColor: '#1f2937',
                      titleFont: { size: 14 },
                      bodyFont: { size: 12 },
                      padding: 12,
                      usePointStyle: true,
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.raw as number;
                          const total = (context.dataset.data as number[]).reduce((acc, data) => acc + data, 0);
                          const percentage = Math.round((value / total) * 100);
                          return `${label}: ${value.toLocaleString()} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer - EXACT SAME AS STATIC VERSION */}
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
                {['Home', 'About', 'Contact'].map((link) => (
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
