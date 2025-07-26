'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const images = [
  '/SD02.jpg',
  '/matasudikshaji.png',
  '/satgurumataji1.png',
  '/SD03.jpg',
];
// Add to your co


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('scroll', handleScroll);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const navLinks = [
    { href: '/', text: 'Home' },
    { href: '/about', text: 'About' },
    { href: '/contact', text: 'Contact' },
    { href: '/login', text: 'login' },
  ];
  const navLink = [
    { href: '/', text: 'Home' },
    { href: '/about', text: 'About' },
    { href: '/contact', text: 'Contact' },

  ];


  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-gradient-to-r from-purple-700 via-pink-500 to-yellow-400 shadow-xl py-1 md:py-2'
          : 'bg-gradient-to-r from-purple-700/90 via-pink-500/90 to-yellow-400/90 py-2 md:py-4'
      }`}
    >
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-2 md:gap-4">
            <Image
              src="/snmlogo.jpeg"
              alt="Sant Nirankari Mission Logo"
              width={isMobile ? 40 : 50}
              height={isMobile ? 40 : 50}
              className="rounded-full border-2 border-white shadow-lg"
            />
            <Link href="/" className="text-lg md:text-xl lg:text-2xl font-serif font-bold text-white tracking-tight">
              Medical Sewa
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {navLink.slice(0, 5).map((link, index) => (
              <motion.div key={index} whileHover={{ scale: 1.05 }}>
                <Link
                  href={link.href}
                  className="px-4 py-1 lg:px-5 lg:py-2 rounded-full text-xs lg:text-sm font-bold  text-white bg:hover-white hover:bg-white hover:text-purple-700 transition-colors duration-300"
                >
                  {link.text}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Login Button */}
          <motion.div whileHover={{ scale: 1.05 }} className="hidden md:block">
            <Link
              href="/login"
              className="bg-white text-indigo-700 px-4 py-1.5 lg:px-5 lg:py-2 rounded-full text-xs lg:text-sm font-bold shadow-md hover:bg-indigo-50 transition-colors duration-300"
            >
              Login
            </Link>
          </motion.div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <motion.div whileHover={{ scale: 1.05 }}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white focus:outline-none"
                aria-label="Toggle menu"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                  />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className={`md:hidden overflow-hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        >
          <div className="pt-4 pb-3 flex flex-col bg-gradient-to-b from-purple-800 to-pink-700 rounded-lg mt-2">
            {navLinks.map((link, index) => (
              <motion.div key={index} whileHover={{ scale: 1.02 }}>
                <Link
                  href={link.href}
                  className="block px-4 py-3 text-base font-medium text-white hover:bg-purple-600/30 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.text}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const ServiceCard = ({ title, description, icon }: { title: string; description: string; icon: string }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center"
  >
    <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-full mb-4">
      <span className="text-3xl">{icon}</span>
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const TestimonialCard = ({ content, author, role }: { content: string; author: string; role: string }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-md p-6"
  >
    <div className="text-yellow-400 text-xl mb-3">★★★★★</div>
    <p className="text-gray-700 italic mb-4">&quot;{content}&quot;</p>
    <div>
      <p className="font-bold text-gray-800">{author}</p>
      <p className="text-gray-600 text-sm">{role}</p>
    </div>
  </motion.div>
);

export default function LandingPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const services = [
   
    {
      title: "Free Health Check-ups",
      description: "Conducting free health check-ups and screenings for early detection of diseases.",
      icon: "🩺"
    },
    
    {
      title: " Mega Blood Donation",
      description: "Organizing regular blood donation camps to support local hospitals.",
      icon: "🩸"
    }
  ];
  

// Create an array with 8 images// Add to your component state
const [aboutCurrentIndex, setAboutCurrentIndex] = useState(0);
const aboutImages = [
  '/babaji.jpg',
  '/snmd.jpg',
  '/blood_donation.jpg',
  '/snm1.png',
];

// Add this useEffect for auto-sliding
useEffect(() => {
  const aboutInterval = setInterval(() => {
    setAboutCurrentIndex(prev => (prev + 1) % aboutImages.length);
  }, 4000);

  return () => clearInterval(aboutInterval);
}, [aboutImages.length]);
  

  const testimonials = [
    {
      content: "Medical Sewa transformed our community's access to healthcare. Their camps have been a blessing!",
      author: "Rajesh Kumar",
      role: "Community Leader"
    },
    {
      content: "The support I received for my father's surgery was life-changing. Thank you Medical Sewa!",
      author: "Priya Sharma",
      role: "Beneficiary"
    },
    {
      content: "As a volunteer, I'm proud to be part of such an impactful organization that truly serves humanity.",
      author: "Dr. Amit Patel",
      role: "Volunteer Doctor"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Slider */}
      <section className="relative overflow-hidden mt-16 md:mt-20">
        <div
          ref={sliderRef}
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((src, index) => (
            <div key={index} className="min-w-full flex-shrink-0">
              <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh]">
                <Image
                  src={src}
                  alt={`MedicalSewa Event ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 md:pb-12">
                  
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation Arrows */}
        <motion.div whileHover={{ scale: 1.1 }} className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <button
            onClick={prevSlide}
            className="bg-white/80 text-purple-700 p-3 rounded-full shadow-md hover:bg-white transition-colors"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.1 }} className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <button
            onClick={nextSlide}
            className="bg-white/80 text-purple-700 p-3 rounded-full shadow-md hover:bg-white transition-colors"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white w-6' : 'bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Section *
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">About Medical Sewa</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-500 mx-auto mb-6" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A Sant Nirankari Mission initiative providing compassionate healthcare services to underserved communities
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-xl overflow-hidden shadow-xl h-80 md:h-96">
              <Image
                src="/babaji.jpg"
                alt="Sant Nirankari Mandal"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Serving Humanity with Divine Inspiration
              </h3>
              <p className="text-gray-600 mb-6">
                Medical Sewa is a healthcare initiative by Sant Nirankari Mission dedicated to providing quality medical services to all sections of society. Inspired by the teachings of Satguru Mata Sudiksha Ji Maharaj, we strive to serve humanity with compassion and dedication.
              </p>
              <p className="text-gray-600 mb-8">
                Our team of volunteer doctors, nurses, and healthcare professionals work tirelessly to bring medical care to remote areas, organize health camps, and provide financial assistance for critical treatments.
              </p>
              <div className="flex gap-4">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    href="/about"
                    className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:from-purple-700 hover:to-pink-600 transition-all"
                  >
                    Learn More
                  </Link>
                </motion.div>
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* about section */}
      <section className="py-16 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">About Medical Sewa</h2>
      <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-500 mx-auto mb-6" />
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        A Sant Nirankari Mission initiative providing compassionate healthcare services to underserved communities
      </p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-12 items-center">
      {/* Image Slider Container */}
      <div className="relative rounded-xl overflow-hidden shadow-xl h-80 md:h-96">
        {/* Slider Track */}
        <div 
          className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${aboutCurrentIndex * 100}%)` }}
        >
          {aboutImages.map((src, index) => (
            <div key={index} className="min-w-full flex-shrink-0 relative">
              <Image
                src={src}
                alt={`Medical Sewa Activity ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
        
        {/* Navigation Arrows */}
        <button
          onClick={() => setAboutCurrentIndex(prev => (prev - 1 + aboutImages.length) % aboutImages.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-purple-700 p-2 rounded-full shadow-md hover:bg-white transition-colors z-10"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={() => setAboutCurrentIndex(prev => (prev + 1) % aboutImages.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-purple-700 p-2 rounded-full shadow-md hover:bg-white transition-colors z-10"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
          <div className="flex space-x-2">
            {aboutImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setAboutCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === aboutCurrentIndex ? 'bg-white w-4' : 'bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Serving Humanity with Divine Inspiration
        </h3>
        <p className="text-gray-600 mb-6">
          Medical Sewa is a healthcare initiative by Sant Nirankari Mission dedicated to providing quality medical services to all sections of society. Inspired by the teachings of Satguru Mata Sudiksha Ji Maharaj, we strive to serve humanity with compassion and dedication.
        </p>
        <p className="text-gray-600 mb-8">
          Our team of volunteer doctors, nurses, and healthcare professionals work tirelessly to bring medical care to remote areas, organize health camps, and provide financial assistance for critical treatments.
        </p>
        <div className="flex gap-4">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              href="/about"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:from-purple-700 hover:to-pink-600 transition-all"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  </div>
</section>

{/*
      <section className="py-5  md:flex items-center bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-500 mx-auto mb-6" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive healthcare services for communities in need
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center max-w-7xl flex flex-wrap justify-center mx-auto">
            {services.map((service, index) => (
              <ServiceCard 
                key={index}
                title={service.title}
                description={service.description}
                icon={service.icon}
              />
            ))}
          </div>
        </div>
      </section>

       Stats Section *
      <section className="py-16 bg-gradient-to-r from-purple-700 via-pink-500 to-yellow-400 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="p-6"
            >
              <p className="text-4xl md:text-5xl font-bold mb-2">250+</p>
              <p className="text-lg">Medical Camps</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="p-6"
            >
              <p className="text-4xl md:text-5xl font-bold mb-2">50K+</p>
              <p className="text-lg">Patients Treated</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="p-6"
            >
              <p className="text-4xl md:text-5xl font-bold mb-2">500+</p>
              <p className="text-lg">Mega Blood Donation</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="p-6"
            >
              <p className="text-4xl md:text-5xl font-bold mb-2">15+</p>
              <p className="text-lg"></p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What Saints Say</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-500 mx-auto mb-6" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from the communities we've served and our dedicated volunteers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={index}
                content={testimonial.content}
                author={testimonial.author}
                role={testimonial.role}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Join Us in Making a Difference
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Your support helps us bring healthcare to those who need it most. Whether through volunteering, donations, or spreading awareness, every contribution matters.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                href="/donate"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all"
              >
                Donate Now
              </Link>
            </motion.div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Image
                  src="/snmlogo.jpeg"
                  alt="Sant Nirankari Mission Logo"
                  width={50}
                  height={50}
                  className="rounded-full border-2 border-white"
                />
                <span className="text-xl font-bold">Medical Sewa</span>
              </div>
              <p className="text-gray-400 mb-6">
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
                      <span className="text-base">{social.charAt(0).toUpperCase()}</span>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {['Home', 'About', 'Contact'].map((link) => (
                  <li key={link}>
                    <motion.a 
                      whileHover={{ scale: 1.05 }}
                      href={`#${link.toLowerCase()}`}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6">Our Services</h3>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service.title}>
                    <motion.a 
                      whileHover={{ scale: 1.05 }}
                      href="#services"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {service.title}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6">Contact Us</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <span className="mr-3 mt-1">📍</span>
                  <span>123 Medical Street, Health District, New Delhi, India</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1">📞</span>
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1">✉️</span>
                  <span>info@medicalsewa.org</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Medical Sewa. All rights reserved.</p>
            <p className="mt-2">Sant Nirankari Mission Initiative</p>
          </div>
        </div>
      </footer>
    </div>
  );
}