
/*'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import debounce from 'lodash/debounce';

// Define interfaces for type safety
interface FormData {
  title: string;
  fullName: string;
  contact: string;
  gender: string;
  email: string;
  birthdate: string;
  age: string;
  address: string;
  state: string;
  city: string;
  profilePic: File | null;
  qualification: string;
  sewa: string;
  availability: string;
  shift: string;
  experience: string;
  lastSewa: string;
  recommendedBy: string;
  certificate: File | null;
  loginId: string;
  password: string;
  remark: string;
}

// Simulated dynamic data source (replace with API call in production)
const dataSource = {
  titles: ['Mr', 'Mrs', 'Ms', 'Dr'],
  genders: ['Male', 'Female', 'Other'],
  states: [
    { name: 'Delhi', cities: ['Delhi', 'New Delhi'] },
    { name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur'] },
    { name: 'Punjab', cities: ['Amritsar', 'Ludhiana', 'Chandigarh'] },
    { name: 'Karnataka', cities: ['Bangalore', 'Mysore', 'Hubli'] },
  ],
  qualifications: ['Graduate', 'Post Graduate', 'Diploma', 'PhD', 'Other'],
  sewaDepartments: ['IT', 'Transport', 'Decoration', 'Security', 'Medical', 'Education'],
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
    state: '',
    city: '',
    profilePic: null,
    qualification: '',
    sewa: '',
    availability: '',
    shift: '',
    experience: '',
    lastSewa: '',
    recommendedBy: '',
    certificate: null,
    loginId: '',
    password: '',
    remark: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileNames, setFileNames] = useState<{
    profilePic: string;
    certificate: string;
  }>({
    profilePic: '',
    certificate: '',
  });
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);

  const steps = [
    { id: 1, title: 'Personal', color: 'from-purple-700 via-pink-500 to-yellow-400' },
    { id: 2, title: 'Professional', color: 'from-purple-700 via-pink-500 to-yellow-400' },
    { id: 3, title: 'Login', color: 'from-purple-700 via-pink-500 to-yellow-400' },
  ];

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
      } else if (formData.contact.length !== 10) {
        newErrors.contact = 'Invalid contact number';
      }
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.birthdate) newErrors.birthdate = 'Birthdate is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.profilePic) newErrors.profilePic = 'Profile picture is required';
    }

    if (step === 2) {
      if (!formData.qualification) newErrors.qualification = 'Qualification is required';
      if (!formData.sewa) newErrors.sewa = 'Sewa Department is required';
      if (!formData.availability) newErrors.availability = 'Availability is required';
      if (!formData.shift) newErrors.shift = 'Shift Time is required';
      if (!formData.certificate) newErrors.certificate = 'Certificate is required';
    }

    if (step === 3) {
      if (!formData.loginId.trim()) newErrors.loginId = 'Login ID is required';
      if (!formData.password.trim()) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
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
    if (name === 'state') {
      setFormData((prev) => ({ ...prev, city: '' }));
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

  const resetSection = (section: number) => {
    const resetFields: { [key: number]: Partial<FormData> } = {
      1: {
        title: '',
        fullName: '',
        contact: '',
        gender: '',
        email: '',
        birthdate: '',
        age: '',
        address: '',
        state: '',
        city: '',
        profilePic: null,
      },
      2: {
        qualification: '',
        sewa: '',
        availability: '',
        shift: '',
        experience: '',
        lastSewa: '',
        recommendedBy: '',
        certificate: null,
      },
      3: {
        loginId: '',
        password: '',
        remark: '',
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

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateStep(3)) {
      try {
        const formPayload = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value instanceof File) {
            formPayload.append(key, value);
          } else if (value !== null && value !== '') {
            formPayload.append(key, value);
          }
        });

        // Placeholder for API call
        // const response = await fetch('/api/register', {
        //   method: 'POST',
        //   body: formPayload,
        // });

        alert('Registration Successful!');
        setCurrentStep(1);
        setFormData({
          title: '',
          fullName: '',
          contact: '',
          gender: '',
          email: '',
          birthdate: '',
          age: '',
          address: '',
          state: '',
          city: '',
          profilePic: null,
          qualification: '',
          sewa: '',
          availability: '',
          shift: '',
          experience: '',
          lastSewa: '',
          recommendedBy: '',
          certificate: null,
          loginId: '',
          password: '',
          remark: '',
        });
        setFileNames({ profilePic: '', certificate: '' });
        setProfilePicPreview(null);
        setErrors({});
      } catch (error) {
        console.error('Submission error:', error);
        alert('Registration Failed!');
      }
    }
  };

  // Get cities for the selected state
  const getCities = () => {
    const selectedState = dataSource.states.find((state) => state.name === formData.state);
    return selectedState ? selectedState.cities : [];
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
          background: linear-gradient(to right, #6b46c1, #ec4899, #f59e0b);
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
          top: 60px;
          text-align: center;
          font-size: 0.9rem;
          font-weight: 500;
          color: #374151;
        }
        .custom-file-input::-webkit-file-upload-button {
          display: none;
        }
        .custom-file-input::before {
          content: 'Choose File';
          display: inline-block;
          background: linear-gradient(to right, #6b46c1, #ec4899, #f59e0b);
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          margin-right: 12px;
          transition: background 0.2s;
        }
        .custom-file-input:hover::before {
          background: linear-gradient(to right, #5b21b6, #db2777, #d97706);
        }
        .profile-pic-preview {
          max-width: 120px;
          max-height: 120px;
          object-fit: cover;
          border-radius: 8px;
          border: 2px solid #e5e7eb;
        }
      `}</style>
      <Navbar />
      <div className="max-w-6xl mx-auto p-8 mt-24">
        {/* Progress Steps 
        <div className="stepper-container mb-12">
          <div className="stepper-line"></div>
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <button
                onClick={() => currentStep >= step.id && setCurrentStep(step.id)}
                className={`step-button ${
                  currentStep >= step.id
                    ? 'bg-gradient-to-r from-purple-700 via-pink-500 to-yellow-400 text-white border-2 border-purple-800 shadow-md'
                    : 'bg-gray-200 text-gray-600 border-2 border-gray-300'
                }`}
              >
                {step.id}
              </button>
              <span className="step-label">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-gray-800">
            {steps[currentStep - 1].title} Details
          </h2>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-10"
        >
          {/* Personal Details 
          {currentStep === 1 && (
            <div>
              <h3 className="text-2xl font-serif font-bold text-gray-800 mb-8">
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:border-pink-400 transition hover:border-gray-400"
                  >
                    <option value="">Select</option>
                    {dataSource.titles.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:border-pink-400 transition hover:border-gray-400"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Contact <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    maxLength={10}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:border-pink-400 transition hover:border-gray-400"
                  />
                  {errors.contact && <p className="text-red-500 text-xs">{errors.contact}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:border-pink-400 transition hover:border-gray-400"
                  >
                    <option value="">Select</option>
                    {dataSource.genders.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:border-pink-400 transition hover:border-gray-400"
                  />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <div className="flex flex-row gap-4 flex-wrap">
                    <div className="flex-1 min-w-[150px]">
                      <label className="block text-sm font-semibold text-gray-700">
                        Birthdate <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:border-pink-400 transition hover:border-gray-400"
                      />
                      {errors.birthdate && <p className="text-red-500 text-xs">{errors.birthdate}</p>}
                    </div>
                    <div className="flex-1 min-w-[150px]">
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
                <div className="textarea-2">
                  <label className="block text-sm font-semibold textarea-gray-700">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:border-pink-400 transition hover:border-gray-400"
                  />
                  {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:border-pink-400 transition hover:border-gray-400"
                  >
                    <option value="">Select</option>
                    {dataSource.states.map((state) => (
                      <option key={state.name} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:border-pink-400 transition hover:border-gray-400"
                  >
                    <option value="">Select</option>
                    {getCities().map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Profile Picture <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="profilePic"
                      onChange={handleFileChange}
                      accept="image/*"
                      id="profilePic"
                      className="w-full p-3 border border-gray-300 rounded-lg custom-file-input"
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
                  {errors.profilePic && <p className="text-red-500 text-xs">{errors.profilePic}</p>}
                </div>
              </div>
              <div className="col-span-full flex justify-between mt-12">
                <button
                  type="button"
                  onClick={() => resetSection(1)}
                  className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 hover:scale-105 transition-transform"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-gradient-to-r from-purple-700 via-pink-500 to-yellow-400 text-white rounded-lg hover:from-purple-800 hover:via-pink-600 hover:to-yellow-500 hover:scale-105 transition-transform"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Professional Details *
          {currentStep === 2 && (
            <div>
              <h3 className="text-2xl font-serif font-bold text-gray-800 mb-8">
                Professional Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Highest Qualification <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:border-pink-400 transition hover:border-gray-400"
                  >
                    <option value="">Select</option>
                    {dataSource.qualifications.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.qualification && (
                    <p className="text-red-500 text-xs">{errors.qualification}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Sewa Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="sewa"
                    value={formData.sewa}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:border-pink-400 transition hover:border-gray-400"
                  >
                    <option value="">Select</option>
                    {dataSource.sewaDepartments.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.sewa && <p className="text-red-500 text-xs">{errors.sewa}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Available Days <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:border-pink-400 transition hover:border-gray-400"
                  >
                    <option value="">Select</option>
                    {dataSource.availabilities.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.availability && (
                    <p className="text-red-500 text-xs">{errors.availability}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Preferred Shift Time <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="shift"
                    value={formData.shift}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:border-pink-400 transition hover:border-gray-400"
                  >
                    <option value="">Select</option>
                    {dataSource.shifts.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.shift && <p className="text-red-500 text-xs">{errors.shift}</p>}
                </div>
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:border-pink-400 transition hover:border-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Sewa Performed During Last Samagam
                  </label>
                  <input
                    type="text"
                    name="lastSewa"
                    value={formData.lastSewa}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:border-pink-400 transition hover:border-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Recommended By
                  </label>
                  <input
                    type="text"
                    name="recommendedBy"
                    value={formData.recommendedBy}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:border-pink-400 transition hover:border-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Upload Certificate <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="certificate"
                      onChange={handleFileChange}
                      id="certificate"
                      className="w-full p-3 border border-gray-300 rounded-lg custom-file-input"
                    />
                    {fileNames.certificate && (
                      <span className="text-sm text-gray-600 mt-2 block">
                        {fileNames.certificate}
                      </span>
                    )}
                  </div>
                  {errors.certificate && (
                    <p className="text-red-500 text-xs">{errors.certificate}</p>
                  )}
                </div>
              </div>
              <div className="col-span-full flex justify-between mt-12">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 hover:scale-105 transition-transform"
                >
                  Previous
                </button>
                <div className="space-x-4">
                  <button
                    type="button"
                    onClick={() => resetSection(2)}
                    className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 hover:scale-105 transition-transform"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-gradient-to-r from-purple-700 via-pink-500 to-yellow-400 text-white rounded-lg hover:from-purple-800 hover:via-pink-600 hover:to-yellow-500 hover:scale-105 transition-transform"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Login Details *
          {currentStep === 3 && (
            <div>
              <h3 className="text-2xl font-serif font-bold text-gray-800 mb-8">
                Login Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Login ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="loginId"
                    value={formData.loginId}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:border-pink-400 transition hover:border-gray-400"
                  />
                  {errors.loginId && <p className="text-red-500 text-xs">{errors.loginId}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:border-pink-400 transition hover:border-gray-400"
                  />
                  {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                </div>
                <div className="col-span-full space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Remark (Added by Administration Team)
                  </label>
                  <textarea
                    name="remark"
                    value={formData.remark}
                    onChange={handleInputChange}
                    readOnly
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 resize-y focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:border-pink-400 transition hover:border-gray-400"
                  />
                </div>
              </div>
              <div className="col-span-full flex justify-between mt-12">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 hover:scale-105 transition-transform"
                >
                  Previous
                </button>
                <div className="space-x-4">
                  <button
                    type="button"
                    onClick={() => resetSection(3)}
                    className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 hover:scale-105 transition-transform"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-purple-700 via-pink-500 to-yellow-400 text-white rounded-lg hover:from-purple-800 hover:via-pink-600 hover:to-yellow-500 hover:scale-105 transition-transform"
                  >
                    Submit
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
*/
// app/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import debounce from 'lodash/debounce';

// Define interfaces for type safety
interface FormData {
  title: string;
  fullName: string;
  contact: string;
  gender: string;
  email: string;
  birthdate: string;
  age: string;
  address: string;
  state: string;
  city: string;
  profilePic: File | null;
  qualification: string;
  sewa: string;
  availability: string;
  shift: string;
  experience: string;
  lastSewa: string;
  recommendedBy: string;
  certificate: File | null;
  loginId: string;
  password: string;
  remark: string;
}

// Simulated dynamic data source (replace with API call in production)
const dataSource = {
  titles: ['Mr', 'Mrs', 'Ms', 'Dr'],
  genders: ['Male', 'Female', 'Other'],
  states: [
    { name: 'Delhi', cities: ['Delhi', 'New Delhi'] },
    { name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur'] },
    { name: 'Punjab', cities: ['Amritsar', 'Ludhiana', 'Chandigarh'] },
    { name: 'Karnataka', cities: ['Bangalore', 'Mysore', 'Hubli'] },
  ],
  qualifications: ['Graduate', 'Post Graduate', 'Diploma', 'PhD', 'Other'],
  sewaDepartments: ['IT', 'Transport', 'Decoration', 'Security', 'Medical', 'Education'],
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
            Medical Sewa 
          </h1>
        </div>
        <div className="flex space-x-4">
          <Link href="/" className="text-white hover:text-yellow-200 transition-colors font-medium tracking-wide">Home</Link>
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
    state: '',
    city: '',
    profilePic: null,
    qualification: '',
    sewa: '',
    availability: '',
    shift: '',
    experience: '',
    lastSewa: '',
    recommendedBy: '',
    certificate: null,
    loginId: '',
    password: '',
    remark: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileNames, setFileNames] = useState<{
    profilePic: string;
    certificate: string;
  }>({
    profilePic: '',
    certificate: '',
  });
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);

  const steps = [
    { id: 1, title: 'Personal', color: 'rgb(44, 83, 167),rgb(34, 71, 159),rgb(21, 59, 229)  mb-1x1' },
    { id: 2, title: 'Professional', color: 'rgb(44, 83, 167),rgb(34, 71, 159),rgb(21, 59, 229) mb-1x1' },
    { id: 3, title: 'Login', color: 'rgb(44, 83, 167),rgb(34, 71, 159),rgb(21, 59, 229) mb-1x1' },
  ];

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
      } else if (formData.contact.length !== 10) {
        newErrors.contact = 'Invalid contact number';
      }
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.birthdate) newErrors.birthdate = 'Birthdate is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.profilePic) newErrors.profilePic = 'Profile picture is required';
    }

    if (step === 2) {
      if (!formData.qualification) newErrors.qualification = 'Qualification is required';
      if (!formData.sewa) newErrors.sewa = 'Sewa Department is required';
      if (!formData.availability) newErrors.availability = 'Availability is required';
      if (!formData.shift) newErrors.shift = 'Shift Time is required';
      if (!formData.certificate) newErrors.certificate = 'Certificate is required';
    }

    if (step === 3) {
      if (!formData.loginId.trim()) newErrors.loginId = 'Login ID is required';
      if (!formData.password.trim()) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
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
    if (name === 'state') {
      setFormData((prev) => ({ ...prev, city: '' }));
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

  const resetSection = (section: number) => {
    const resetFields: { [key: number]: Partial<FormData> } = {
      1: {
        title: '',
        fullName: '',
        contact: '',
        gender: '',
        email: '',
        birthdate: '',
        age: '',
        address: '',
        state: '',
        city: '',
        profilePic: null,
      },
      2: {
        qualification: '',
        sewa: '',
        availability: '',
        shift: '',
        experience: '',
        lastSewa: '',
        recommendedBy: '',
        certificate: null,
      },
      3: {
        loginId: '',
        password: '',
        remark: '',
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

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateStep(3)) {
      try {
        const formPayload = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value instanceof File) {
            formPayload.append(key, value);
          } else if (value !== null && value !== '') {
            formPayload.append(key, value);
          }
        });

        // Placeholder for API call
        // const response = await fetch('/api/register', {
        //   method: 'POST',
        //   body: formPayload,
        // });

        alert('Registration Successful!');
        setCurrentStep(1);
        setFormData({
          title: '',
          fullName: '',
          contact: '',
          gender: '',
          email: '',
          birthdate: '',
          age: '',
          address: '',
          state: '',
          city: '',
          profilePic: null,
          qualification: '',
          sewa: '',
          availability: '',
          shift: '',
          experience: '',
          lastSewa: '',
          recommendedBy: '',
          certificate: null,
          loginId: '',
          password: '',
          remark: '',
        });
        setFileNames({ profilePic: '', certificate: '' });
        setProfilePicPreview(null);
        setErrors({});
      } catch (error) {
        console.error('Submission error:', error);
        alert('Registration Failed!');
      }
    }
  };

  // Get cities for the selected state
  const getCities = () => {
    const selectedState = dataSource.states.find((state) => state.name === formData.state);
    return selectedState ? selectedState.cities : [];
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
          top: 65px; /* Increased gap below step buttons */
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
          background: linear-gradient(to right, #2563eb,rgb(19, 32, 216),rgb(37, 27, 231));
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          margin-right: 12px;
          transition: background 0.2s;
          letter-spacing: 0.5px;
        }
        .custom-file-input:hover::before {
          background: linear-gradient(to right, #1d4ed8,rgb(48, 65, 224),rgb(66, 50, 216));
        }
        .profile-pic-preview {
          max-width: 120px;
          max-height: 120px;
          object-fit: cover;
          border-radius: 8px;
          border: 2px solid #e5e7eb;
        }
        .form-label {
          letter-spacing: 0.5px;
        }
        .form-input {
          letter-spacing: 0.5px;
        }
        /* Static gradient with opacity for focus rings */
        .focus-gradient-to-r:focus {
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3), 
                      0 0 0 6px rgba(51, 54, 232, 0.2), 
                      0 0 0 9px rgba(13, 40, 148, 0.1);
          outline: none;
        }
      `}</style>
      <Navbar />
      <div className="max-w-6xl mx-auto p-8 mt-24">
        {/* Progress Steps */}
        <div className="stepper-container mb-12">
          <div className="stepper-line"></div>
{steps.map((step) => (
  <div key={step.id} className="flex flex-col items-center">
    <button
      onClick={() => currentStep >= step.id && setCurrentStep(step.id)}
      className={`step-button ${
        currentStep >= step.id
          ? 'bg-gradient-to-r from-blue-800  text-black border-1  shadow-md' // Updated gradient
          : 'bg-gradient-to-r from-blue-800  text-black border-1  shadow-md'
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

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-10"
        >
          {/* Personal Details */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-2xl font-serif font-bold text-gray-800 mb-8 tracking-wide">
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 form-label">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400 form-input"
                  >
                    <option value="">Select</option>
                    {dataSource.titles.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 form-label">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400 form-input"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 form-label">
                    Contact <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    maxLength={10}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400 form-input"
                  />
                  {errors.contact && <p className="text-red-500 text-xs">{errors.contact}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 form-label">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400 form-input"
                  >
                    <option value="">Select</option>
                    {dataSource.genders.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 form-label">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400 form-input"
                  />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <div className="flex flex-row gap-4 flex-wrap">
                    <div className="flex-1 min-w-[150px]">
                      <label className="block text-sm font-semibold text-gray-700 form-label">
                        Birthdate <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400 form-input"
                      />
                      {errors.birthdate && <p className="text-red-500 text-xs">{errors.birthdate}</p>}
                    </div>
                    <div className="flex-1 min-w-[150px]">
                      <label className="block text-sm font-semibold text-gray-700 form-label">Age</label>
                      <input
                        type="text"
                        name="age"
                        value={formData.age}
                        readOnly
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed form-input"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 form-label">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400 form-input"
                  >
                    <option value="">Select</option>
                    {dataSource.states.map((state) => (
                      <option key={state.name} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 form-label">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400 form-input"
                  >
                    <option value="">Select</option>
                    {getCities().map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 form-label">
                    Profile Picture <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="profilePic"
                      onChange={handleFileChange}
                      accept="image/*"
                      id="profilePic"
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
                  {errors.profilePic && <p className="text-red-500 text-xs">{errors.profilePic}</p>}
                </div>
              </div>
               <div className="col-span-full space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 form-label">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400 min-h-[100px] form-input"
                  />
                  {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
                </div>
              
              <div className="col-span-full flex justify-end gap-3 mt-12">
                <button
                  type="button"
                  onClick={() => resetSection(1)}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:scale-105 transition-transform tracking-wide"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-transform tracking-wide"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Professional Details */}
          {currentStep === 2 && (
            <div>
              <h3 className="text-2xl font-serif font-bold text-gray-800 mb-8 tracking-wide">
                Professional Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 form-label">
                    Highest Qualification <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400 form-input"
                  >
                    <option value="">Select</option>
                    {dataSource.qualifications.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.qualification && (
                    <p className="text-red-500 text-xs">{errors.qualification}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 form-label">
                    Sewa Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="sewa"
                    value={formData.sewa}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400 form-input"
                  >
                    <option value="">Select</option>
                    {dataSource.sewaDepartments.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.sewa && <p className="text-red-500 text-xs">{errors.sewa}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 form-label">
                    Available Days <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400 form-input"
                  >
                    <option value="">Select</option>
                    {dataSource.availabilities.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.availability && (
                    <p className="text-red-500 text-xs">{errors.availability}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 form-label">
                    Preferred Shift Time <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="shift"
                    value={formData.shift}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400 form-input"
                  >
                    <option value="">Select</option>
                    {dataSource.shifts.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.shift && <p className="text-red-500 text-xs">{errors.shift}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 form-label">
                    Total Experience (Years)
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400 form-input"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 form-label">
                    Sewa Performed During Last Samagam
                  </label>
                  <input
                    type="text"
                    name="lastSewa"
                    value={formData.lastSewa}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400 form-input"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 form-label">
                    Recommended By
                  </label>
                  <input
                    type="text"
                    name="recommendedBy"
                    value={formData.recommendedBy}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400 form-input"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 form-label">
                    Upload Certificate <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="certificate"
                      onChange={handleFileChange}
                      id="certificate"
                      className="w-full p-3 border border-gray-300 rounded-lg custom-file-input focus-gradient"
                    />
                    {fileNames.certificate && (
                      <span className="text-sm text-gray-600 mt-2 block">
                        {fileNames.certificate}
                      </span>
                    )}
                  </div>
                  {errors.certificate && (
                    <p className="text-red-500 text-xs">{errors.certificate}</p>
                  )}
                </div>
              </div>
              <div className="col-span-full flex justify-between mt-12">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-transform tracking-wide"
                >
                  Previous
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => resetSection(2)}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:scale-105 transition-transform tracking-wide"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-transform tracking-wide"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Login Details */}
          {currentStep === 3 && (
            <div>
              <h3 className="text-2xl font-serif font-bold text-gray-800 mb-8 tracking-wide">
                Login Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 form-label">
                    Login ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="loginId"
                    value={formData.loginId}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400 form-input"
                  />
                  {errors.loginId && <p className="text-red-500 text-xs">{errors.loginId}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 form-label">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-0 focus-gradient transition hover:border-gray-400 form-input"
                  />
                  {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                </div>
                <div className="col-span-full space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 form-label">
                    Remark (Added by Administration Team)
                  </label>
                  <textarea
                    name="remark"
                    value={formData.remark}
                    onChange={handleInputChange}
                    readOnly
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 resize-y focus:ring-0 focus-gradient transition hover:border-gray-400 form-input"
                  />
                </div>
              </div>
              <div className="col-span-full flex justify-between mt-12">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-transform tracking-wide"
                >
                  Previous
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => resetSection(3)}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:scale-105 transition-transform tracking-wide"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:scale-105 transition-transform tracking-wide"
                  >
                    Submit
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