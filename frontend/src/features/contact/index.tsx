import {
  SNM_CONTACT_PAGE_FORM_SUCCESS_MESSAGE,
  SNM_CONTACT_PAGE_FORM_TITLE_LABEL,
  SNM_CONTACT_PAGE_HEADING,
  SNM_CONTACT_PAGE_SUBHEADING,
  SNM_SITE_ADDRESS,
  SNM_SITE_EMAIL,
  SNM_SITE_PHONE,
} from "@shared/constants";
import React, { useState, useRef } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";

export default function Contact() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result)
          setProfileImage(event.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileClick = () => fileInputRef.current?.click();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 pt-[120px] md:pt-[90px] lg:pt-[100px] space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-2">
              {SNM_CONTACT_PAGE_HEADING}
            </h2>
            <div className="w-24 h-1 bg-to-two-right-theme-gradient mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {SNM_CONTACT_PAGE_SUBHEADING}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-purple-600 mb-4">
                  Contact Information
                </h3>

                <div className="space-y-4">
                  {[
                    {
                      icon: <FaMapMarkerAlt />,
                      title: "Address",
                      desc: `${SNM_SITE_ADDRESS}`,
                    },
                    {
                      icon: <FaPhone />,
                      title: "Phone",
                      desc: `${SNM_SITE_PHONE}`,
                    },
                    {
                      icon: <FaEnvelope />,
                      title: "Email",
                      desc: `${SNM_SITE_EMAIL}`,
                    },
                    // { icon: <FaClock />, title: "Working Hours", desc: "Monday - Friday: 9:00 - 17:00\nSaturday: 10:00 - 14:00" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start">
                      <div className="bg-purple-100 p-2 rounded-full mr-4 text-purple-600">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {item.title}
                        </h4>
                        <p className="text-gray-600 whitespace-pre-line">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
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
              <h3 className="text-xl font-semibold text-purple-600 mb-4">
                {SNM_CONTACT_PAGE_FORM_TITLE_LABEL}
              </h3>

              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                  {SNM_CONTACT_PAGE_FORM_SUCCESS_MESSAGE}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
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
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
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
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone
                    </label>
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
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subject
                  </label>
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
                    <option value="Volunteer Opportunity">
                      Volunteer Opportunity
                    </option>
                    <option value="Medical Services">Medical Services</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message
                  </label>
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
                  className="w-full bg-to-two-right-theme-gradient text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-600 transition-all shadow-md"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
