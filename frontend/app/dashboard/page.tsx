'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image, { StaticImageData } from 'next/image';
import { FaChartPie, FaBars, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import ApiService from '@/lib/api'; // Import your API service

// Chart.js components
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// Icons
import { IoIosMail, IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { BsFillPersonFill, BsFillCameraFill, BsGraphUp } from 'react-icons/bs';
import { motion } from 'framer-motion';

// Import your images
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

// Image mapping for dynamic assignment
const imageMap: { [key: string]: StaticImageData } = {
  'Doctors': DoctorsImage,
  'Nurses': NursesImage,
  'Dressing': DressingImage,
  'Paramedical': ParamedicalImage,
  'Pathology': PathologyImage,
  'Acupuncture': AcupunctureImage,
  'Pharmacy': PharmacyImage,
  'Physiotherapy': PhysiotherapyImage,
  'Homeopathy': HomeopathyImage,
  'Ambulance': AmbulanceImage,
  'Registration': RegistrationImage,
  'Lab-Tech': LabTechImage,
};

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  qualification: string;
  profileImage?: string;
  joinedDate: string;
  department: string;
}

interface StatData {
  title: string;
  value: number;
  color: string;
  image?: StaticImageData;
}

interface DashboardData {
  stats: StatData[];
  lastUpdated: string;
  period: string;
}

export default function Dashboard() {
  // State management
  const [userData, setUserData] = useState<UserData | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState('JUL');
  const [activeTab, setActiveTab] = useState('home');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showReports, setShowReports] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Check authentication and fetch data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Fetch user profile and dashboard stats
        const [profileResponse, statsResponse] = await Promise.all([
          ApiService.getUserProfile(),
          ApiService.getDashboardStats()
        ]);

        if (profileResponse.success && statsResponse.success) {
          setUserData(profileResponse.data);
          
          // Add images to stats data
          const statsWithImages = statsResponse.data.stats.map((stat: StatData) => ({
            ...stat,
            image: imageMap[stat.title] || DoctorsImage
          }));
          
          setDashboardData({
            ...statsResponse.data,
            stats: statsWithImages
          });
          
          if (profileResponse.data.profileImage) {
            setProfileImage(profileResponse.data.profileImage);
          }
        }
      } catch (err: any) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load dashboard data');
        
        // If unauthorized, redirect to login
        if (err.message?.includes('token') || err.message?.includes('unauthorized')) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  // Handle profile image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      // TODO: Upload to server
      // try {
      //   const formData = new FormData();
      //   formData.append('profileImage', file);
      //   await ApiService.uploadProfileImage(formData);
      // } catch (error) {
      //   console.error('Profile image upload failed:', error);
      // }
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    router.push('/login');
  };

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
        { id: 'daily-report', href: 'daily-report', name: 'Daily Report' },
        { id: 'registration-report', href: 'registration-report', name: 'Registration Report' },
        { id: 'master-report', href: 'master-report', name: 'Master Report' }
      ]
    },
    { id: 'sign-out', onClick: handleLogout, name: 'Sign Out' }
  ];

  // Handle navigation
  const handleTabClick = (id: string) => {
    if (id === 'reports') {
      setShowReports(!showReports);
    } else if (id === 'sign-out') {
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If no data, show message
  if (!userData || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  // Prepare chart data
  const chartLabels = dashboardData.stats.map(stat => stat.title);
  const chartData = dashboardData.stats.map(stat => stat.value);
  const chartColors = dashboardData.stats.map(stat => stat.color);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Header - Keep your existing header code */}
      <header className="bg-gradient-to-r from-purple-700 via-pink-500 to-amber-500 shadow-lg py-3 sticky top-0 z-50">
        <div className="max-w-8xl mx-auto px-4 flex justify-between items-center">
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
          
          {/* Add user info in header */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-white text-sm">Welcome, {userData.name}</span>
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs">
              {userData.role}
            </span>
          </div>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white p-2 rounded-md"
          >
            {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-9xl mx-auto w-full px-1 py-1 space-y-1">
        {/* Profile Section - Updated with dynamic data */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col p-1">
            <div className="flex flex-col sm:flex-row items-start gap-4 w-full">
              <div className="flex flex-col">
                <div className="relative group w-full flex-col">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-full p-1.5 cursor-pointer flex justify-center"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {profileImage ? (
                      <div className="bg-gray-200 border-2 border-dashed rounded-full w-32 h-32 sm:w-40 sm:h-40 overflow-hidden">
                        <Image
                          src={profileImage}
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
                  <h2 className="text-2xl font-bold text-gray-800">{userData.name}</h2>
                  <div className="mt-4 flex flex-col items-center sm:items-start space-y-2">
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">👨‍⚕️</span>
                      <span>{userData.role}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <IoIosMail className="mr-2 text-purple-600" />
                      <span>{userData.qualification}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">📧</span>
                      <span>{userData.email}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 w-full mt-4 sm:mt-0">
                <div className="relative rounded-xl overflow-hidden w-full h-70 sm:h-96">
                  <Image
                    src="/satgurumataji1.png"
                    alt="Medical Services"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <p className="text-sm">Last Updated: {new Date(dashboardData.lastUpdated).toLocaleDateString()}</p>
                      <p className="text-xs">Period: {dashboardData.period}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>  
        
        {/* Stats Grid - Updated with dynamic data */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {dashboardData.stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg flex flex-row items-center justify-between"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center h-16 bg-gray-50 p-1">
                <div className="relative w-10 h-10">
                  <Image
                    src={stat.image || DoctorsImage}
                    alt={stat.title}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              
              <div className="p-3 text-center flex-grow flex flex-row justify-between">
                <div className="text-xl font-bold" style={{ color: stat.color }}>
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-gray-700 mt-1 text-xs sm:text-sm">{stat.title}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section - Updated with dynamic data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <BsGraphUp className="text-purple-600" />
                Service Utilization ({dashboardData.period})
              </h4>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                {dashboardData.period}
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
                    legend: { display: false },
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
                      grid: { color: '#f3f4f6' },
                      ticks: { color: '#6b7280' },
                      beginAtZero: true,
                      border: { display: false }
                    },
                    y: {
                      grid: { display: false },
                      ticks: {
                        color: '#6b7280',
                        font: { size: 11 }
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
                        font: { size: 10 }
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

      {/* Keep your existing footer */}
      {/* Footer code remains the same... */}
    </div>
  );
}
