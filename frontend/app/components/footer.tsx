"use client";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";


const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-700 via-pink-500 to-yellow-200 shadow-md text-white text-center py-2 ">
      <div className="container mx-auto">
        {/* Footer Text */}
        <p className="text-center py-2 font-medium">
          &copy; {new Date().getFullYear()} MedicalSewa. All rights reserved.
        </p>

        {/* Useful Links */}
        <div className="mt-5 flex justify-center space-x-6">
         
        </div>

        {/* Social Media Icons 
        <div className="mt-6 flex justify-center space-x-6">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition duration-200 transform hover:scale-110"
          >
           <Image
                       src="/facebook.svg"
                       alt="MedicalSewa Logo"
                       width={40}
                       height={40}
                       className="mr-4"
                     />
          </a>
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="transition duration-200 transform hover:scale-110"
          >
            <Image
                        src="/snmlogo.jpeg"
                        alt="MedicalSewa Logo"
                        width={40}
                        height={40}
                        className="mr-4"
                      />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition duration-200 transform hover:scale-110"
          >
           <Image
                       src="/snmlogo.jpeg"
                       alt="MedicalSewa Logo"
                       width={40}
                       height={40}
                       className="mr-4"
                     />
          </a>
        </div>*/}
      </div>
    </footer>
  );
};

export default Footer;
