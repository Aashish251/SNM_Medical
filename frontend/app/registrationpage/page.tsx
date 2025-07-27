'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import debounce from 'lodash/debounce';
import ApiService from '@/lib/api';

// TypeScript Interfaces
interface FormData {
  title: string;
  fullName: string;
  contact: string;
  gender: string;
  email: string;
  birthdate: string;
  age: string;
  address: string;
  stateId: string;
  cityId: string;
  profilePic: File | null;
  qualificationId: string;
  departmentId: string;
  availability: string;
  shift: string;
  experience: string;
  lastSewa: string;
  recommendedBy: string;
  certificate: File | null;
  password: string;
  confirmPassword: string;
  userType: 'admin' | 'ms';
  remark: string;
}

interface DropdownOption {
  id: number;
  state_name?: string;
  city_name?: string;
  department_name?: string;
  qualification_name?: string;
}

interface DropdownData {
  states: DropdownOption[];
  cities: DropdownOption[];
  departments: DropdownOption[];
  qualifications: DropdownOption[];
}

// Static data for fields not in database
const staticData = {
  titles: ['Mr', 'Mrs', 'Ms', 'Dr'],
  genders: ['Male', 'Female', 'Other'],
  availabilities: ['Weekdays', 'Weekends', 'Both'],
  shifts: ['Morning', 'Afternoon', 'Evening', 'Night'],
};

const Navbar = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="bg-gradient-to-r from-purple-700 via-pink-500 to-yellow-400 shadow-md fixed top-0 left-0 w-full z-50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Image
            src="/snmlogo.jpeg"
            alt="Logo"
            width={50}
            height={50}
            className="rounded-full border-2 border-white shadow-md"
          />
          <h1 className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight">
            Sant Nirankari Mission
          </h1>
        </div>
        <div className="flex space-x-4">
          <Link href="/" className="text-white hover:text-yellow-200 transition-colors font-medium tracking-wide">
            Home
          </Link>
          <Link href="/login" className="text-white hover:text-yellow-200 transition-colors font-medium tracking-wide">
            Login
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default function RegistrationPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    fullName: '',
    contact: '',
    gender: '',
    email: '',
    birthdate: '',
    age: '',
    address: '',
    stateId: '',
    cityId: '',
    profilePic: null,
    qualificationId: '',
    departmentId: '',
    availability: '',
    shift: '',
    experience: '',
    lastSewa: '',
    recommendedBy: '',
    certificate: null,
    password: '',
    confirmPassword: '',
    userType: 'ms',
    remark: '',
  });

  const [dropdownData, setDropdownData] = useState<DropdownData>({
    states: [],
    cities: [],
    departments: [],
    qualifications: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [fileNames, setFileNames] = useState<{
    profilePic: string;
    certificate: string;
  }>({
    profilePic: '',
    certificate: '',
  });
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);

  const router = useRouter();

  const steps = [
    { id: 1, title: 'Personal', color: 'rgb(44, 83, 167)' },
    { id: 2, title: 'Professional', color: 'rgb(44, 83, 167)' },
    { id: 3, title: 'Login', color: 'rgb(44, 83, 167)' },
  ];

  // Fetch dropdown data on component mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setDropdownLoading(true);
        const response = await ApiService.getRegistrationDropdownData();
        
        if (response.success) {
          setDropdownData({
            states: response.data.states || [],
            cities: response.data.cities || [],
            departments: response.data.departments || [],
            qualifications: response.data.qualifications || []
          });
        } else {
          console.error('Failed to load dropdown data:', response.error);
        }
      } catch (err) {
        console.error('Failed to fetch dropdown data:', err);
        // Keep empty arrays as fallback
        setDropdownData({
          states: [],
          cities: [],
          departments: [],
          qualifications: []
        });
      } finally {
        setDropdownLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    const fetchCities = async () => {
      if (formData.stateId) {
        try {
          const response = await ApiService.getCitiesByState(formData.stateId);
          if (response.success) {
            setDropdownData(prev => ({
              ...prev,
              cities: response.data || []
            }));
          }
        } catch (err) {
          console.error('Failed to fetch cities:', err);
          setDropdownData(prev => ({
            ...prev,
            cities: []
          }));
        }
      } else {
        setDropdownData(prev => ({
          ...prev,
          cities: []
        }));
      }
    };

    fetchCities();
  }, [formData.stateId]);

  // Debounced age calculation
  useEffect(() => {
    const handler = debounce((birthdate: string) => {
      if (!birthdate) {
        setFormData((prev) => ({ ...prev, age: '' }));
        return;
      }
      const birthDate = new Date(birthdate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData((prev) => ({ ...prev, age: age >= 0 ? age.toString() : '0' }));
    }, 300);

    if (formData.birthdate) {
      handler(formData.birthdate);
    }

    return () => {
      handler.cancel();
    };
  }, [formData.birthdate]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.title) newErrors.title = 'Title is required';
      if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
      if (!formData.contact) {
        newErrors.contact = 'Contact is required';
      } else if (!/^[6-9][0-9]{9}$/.test(formData.contact)) {
        newErrors.contact = 'Invalid mobile number format';
      }
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.birthdate) newErrors.birthdate = 'Birthdate is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.stateId) newErrors.stateId = 'State is required';
      if (!formData.cityId) newErrors.cityId = 'City is required';
    }

    if (step === 2) {
      if (!formData.qualificationId) newErrors.qualificationId = 'Qualification is required';
      if (!formData.departmentId) newErrors.departmentId = 'Department is required';
      if (!formData.availability) newErrors.availability = 'Availability is required';
      if (!formData.shift) newErrors.shift = 'Shift Time is required';
    }

    if (step === 3) {
      if (!formData.password.trim()) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));

    if (name === 'contact') {
      const cleanedValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, contact: cleanedValue }));
    }

    // Reset city when state changes
    if (name === 'stateId') {
      setFormData((prev) => ({ ...prev, cityId: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, [e.target.name]: file }));
      setFileNames((prev) => ({
        ...prev,
        [e.target.name]: file.name,
      }));
      if (e.target.name === 'profilePic') {
        setProfilePicPreview(URL.createObjectURL(file));
      }
      if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const resetSection = (section: number) => {
    const resetFields: { [key: number]: Partial<FormData> } = {
      1: {
        title: '', fullName: '', contact: '', gender: '', email: '', birthdate: '', age: '',
        address: '', stateId: '', cityId: '', profilePic: null,
      },
      2: {
        qualificationId: '', departmentId: '', availability: '', shift: '', experience: '',
        lastSewa: '', recommendedBy: '', certificate: null,
      },
      3: {
        password: '', confirmPassword: '', remark: '',
      },
    };
    setFormData((prev) => ({ ...prev, ...resetFields[section] }));
    setFileNames((prev) => ({
      ...prev,
      profilePic: section === 1 ? '' : prev.profilePic,
      certificate: section === 2 ? '' : prev.certificate,
    }));
    if (section === 1) setProfilePicPreview(null);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;

    setLoading(true);
    setSuccess('');
    setErrors({});

    try {
      // Prepare data for API (matching your backend structure)
      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        mobileNo: formData.contact,
        dateOfBirth: formData.birthdate,
        address: formData.address,
        stateId: formData.stateId || null,
        cityId: formData.cityId || null,
        departmentId: formData.departmentId || null,
        qualificationId: formData.qualificationId || null,
        userType: formData.userType
      };

      console.log('Submitting registration data:', registrationData);

      const response = await ApiService.registerUser(registrationData);

      if (response.success) {
        setSuccess('Registration successful! Redirecting to login...');
        
        // Store email for login page
        localStorage.setItem('registeredEmail', formData.email);
        localStorage.setItem('registeredUserType', formData.userType);
        
        // Reset form
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setErrors({ submit: err.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      <style jsx>{`
        .stepper-container {
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px 0;
        }
        .stepper-line {
          position: absolute;
          top: 30px;
          left: 10%;
          right: 10%;
          height: 4px;
          background: #e5e7eb;
          z-index: 0;
          border-radius: 2px;
        }
        .stepper-line::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 4px;
          width: ${((currentStep - 1) / (steps.length - 1)) * 100}%;
          background: linear-gradient(to right, #2563eb, #10b981, #0d9488);
          transition: width 0.4s ease;
          border-radius: 2px;
        }
        .step-button {
          position: relative;
          z-index: 1;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-weight: 600;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }
        .step-label {
          position: absolute;
          top: 65px;
          text-align: center;
          font-size: 0.9rem;
          font-weight: 500;
          color: #374151;
          letter-spacing: 0.5px;
        }
        .custom-file-input::-webkit-file-upload-button {
          display: none;
        }
        .custom-file-input::before {
          content: 'Choose File';
          display: inline-block;
          background: linear-gradient(to right, #2563eb, #1d4ed8);
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          margin-right: 12px;
          transition: background 0.2s;
          letter-spacing: 0.5px;
        }
        .custom-file-input:hover::before {
          background: linear-gradient(to right, #1d4ed8, #1e40af);
        }
        .profile-pic-preview {
          max-width: 120px;
          max-height: 120px;
          object-fit: cover;
          border-radius: 8px;
          border: 2px solid #e5e7eb;
        }
        .focus-gradient:focus {
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
          outline: none;
        }
      `}</style>

      <Navbar />
      
      <div className="max-w-6xl mx-auto p-8 mt-24">
        {/* User Type Selection */}
        <div className="mb-8 bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6">
          <h3 className="text-xl font-serif font-bold text-gray-800 mb-4">Account Type</h3>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, userType: 'ms' }))}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                formData.userType === 'ms'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
              }`}
            >
              Medical Staff
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, userType: 'admin' }))}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                formData.userType === 'admin'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
              }`}
            >
              Administrator
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="stepper-container mb-12">
          <div className="stepper-line"></div>
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <button
                onClick={() => currentStep >= step.id && setCurrentStep(step.id)}
                className={`step-button ${
                  currentStep >= step.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md'
                    : 'bg-gray-200 text-gray-600'
                } hover:scale-105 transition-transform`}
              >
                {step.id}
              </button>
              <span className="step-label">{step.title}</span>
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-gray-800 tracking-wide">
            {steps[currentStep - 1].title} Details
          </h2>
        </div>

        {/* Loading State */}
        {dropdownLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading form data...</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Form Error */}
        {errors.submit && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {errors.submit}
          </div>
        )}

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-10"
        >
          {/* Personal Details Step */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-2xl font-serif font-bold text-gray-800 mb-8">Personal Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400"
                  >
                    <option value="">Select Title</option>
                    {staticData.titles.map((title) => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>
                  {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400"
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
                </div>

                {/* Contact */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    maxLength={10}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400"
                    placeholder="Enter 10-digit mobile number"
                  />
                  {errors.contact && <p className="text-red-500 text-xs">{errors.contact}</p>}
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400"
                  >
                    <option value="">Select Gender</option>
                    {staticData.genders.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                  {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400"
                    placeholder="Enter your email address"
                  />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                </div>

                {/* Birthdate & Age */}
                <div className="space-y-2">
                  <div className="flex flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700">
                        Birthdate <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400"
                      />
                      {errors.birthdate && <p className="text-red-500 text-xs">{errors.birthdate}</p>}
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700">Age</label>
                      <input
                        type="text"
                        name="age"
                        value={formData.age}
                        readOnly
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* State */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="stateId"
                    value={formData.stateId}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400"
                  >
                    <option value="">Select State</option>
                    {(dropdownData.states || []).map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.state_name}
                      </option>
                    ))}
                  </select>
                  {errors.stateId && <p className="text-red-500 text-xs">{errors.stateId}</p>}
                </div>

                {/* City */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="cityId"
                    value={formData.cityId}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400"
                    disabled={!formData.stateId}
                  >
                    <option value="">Select City</option>
                    {(dropdownData.cities || []).map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.city_name}
                      </option>
                    ))}
                  </select>
                  {errors.cityId && <p className="text-red-500 text-xs">{errors.cityId}</p>}
                </div>

                {/* Profile Picture */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Profile Picture
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="profilePic"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="w-full p-3 border border-gray-300 rounded-lg custom-file-input focus-gradient"
                    />
                    {fileNames.profilePic && (
                      <span className="text-sm text-gray-600 mt-2 block">
                        {fileNames.profilePic}
                      </span>
                    )}
                    {profilePicPreview && (
                      <Image
                        src={profilePicPreview}
                        alt="Profile Preview"
                        width={120}
                        height={120}
                        className="profile-pic-preview mt-2"
                        style={{ objectFit: 'cover', borderRadius: '8px', border: '2px solid #e5e7eb' }}
                        unoptimized
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="mt-6 space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400 min-h-[100px]"
                  placeholder="Enter your complete address"
                />
                {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-end gap-3 mt-12">
                <button
                  type="button"
                  onClick={() => resetSection(1)}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:scale-105 transition-transform"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-transform"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Professional Details Step */}
          {currentStep === 2 && (
            <div>
              <h3 className="text-2xl font-serif font-bold text-gray-800 mb-8">Professional Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Qualification */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Highest Qualification <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="qualificationId"
                    value={formData.qualificationId}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400"
                  >
                    <option value="">Select Qualification</option>
                    {(dropdownData.qualifications || []).map((qual) => (
                      <option key={qual.id} value={qual.id}>
                        {qual.qualification_name}
                      </option>
                    ))}
                  </select>
                  {errors.qualificationId && <p className="text-red-500 text-xs">{errors.qualificationId}</p>}
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400"
                  >
                    <option value="">Select Department</option>
                    {(dropdownData.departments || []).map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.department_name}
                      </option>
                    ))}
                  </select>
                  {errors.departmentId && <p className="text-red-500 text-xs">{errors.departmentId}</p>}
                </div>

                {/* Availability */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Available Days <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400"
                  >
                    <option value="">Select Availability</option>
                    {staticData.availabilities.map((availability) => (
                      <option key={availability} value={availability}>
                        {availability}
                      </option>
                    ))}
                  </select>
                  {errors.availability && <p className="text-red-500 text-xs">{errors.availability}</p>}
                </div>

                {/* Shift */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Preferred Shift Time <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="shift"
                    value={formData.shift}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400"
                  >
                    <option value="">Select Shift</option>
                    {staticData.shifts.map((shift) => (
                      <option key={shift} value={shift}>
                        {shift}
                      </option>
                    ))}
                  </select>
                  {errors.shift && <p className="text-red-500 text-xs">{errors.shift}</p>}
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Total Experience (Years)
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400"
                    placeholder="Enter years of experience"
                  />
                </div>

                {/* Last Sewa */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Sewa Performed During Last Samagam
                  </label>
                  <input
                    type="text"
                    name="lastSewa"
                    value={formData.lastSewa}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400"
                    placeholder="Describe your last sewa"
                  />
                </div>

                {/* Recommended By */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Recommended By
                  </label>
                  <input
                    type="text"
                    name="recommendedBy"
                    value={formData.recommendedBy}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400"
                    placeholder="Enter recommender's name"
                  />
                </div>

                {/* Certificate */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Upload Certificate
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="certificate"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full p-3 border border-gray-300 rounded-lg custom-file-input focus-gradient"
                    />
                    {fileNames.certificate && (
                      <span className="text-sm text-gray-600 mt-2 block">
                        {fileNames.certificate}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-12">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 hover:scale-105 transition-transform"
                >
                  Previous
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => resetSection(2)}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:scale-105 transition-transform"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-transform"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Login Details Step */}
          {currentStep === 3 && (
            <div>
              <h3 className="text-2xl font-serif font-bold text-gray-800 mb-8">Login Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400"
                    placeholder="Enter password (min 8 characters)"
                  />
                  {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400"
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Remark */}
              <div className="mt-6 space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Remark (Added by Administration Team)
                </label>
                <textarea
                  name="remark"
                  value={formData.remark}
                  onChange={handleInputChange}
                  readOnly
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 resize-y"
                  placeholder="This field will be filled by the administration team after review"
                />
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-12">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 hover:scale-105 transition-transform"
                  disabled={loading}
                >
                  Previous
                </button>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => resetSection(3)}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:scale-105 transition-transform"
                    disabled={loading}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 hover:scale-105'
                    } text-white`}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Registering...
                      </span>
                    ) : (
                      'Submit Registration'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.form>
      </div>
    </div>
  );
}
