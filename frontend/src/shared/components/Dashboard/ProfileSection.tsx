import React from "react";
import { BsFillPersonFill, BsFillCameraFill } from "react-icons/bs";
import { IoIosMail } from "react-icons/io";
import { HOME_HERO_BANNER_IMAGE3, DEFAULT_PROFILE_IMAGE } from "@assets/index";
import { Carousel } from "../Carousel";
import { imagesDashBoard } from "@shared/config/common";

interface ProfileSectionProps {
  name: string;
  qualification: string;
  profileImage?: string | null;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  name,
  qualification,
  profileImage,
}) => {
  return (
    <section className="overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Banner */}
        <div className="flex-1 w-full h-full sm:h-50 md:h-100 overflow-hidden relative">
          <Carousel
            slides={imagesDashBoard.map((src, i) => (
              <div
                key={i}
                className="relative w-full  h-[45vh] sm:h-[60vh] md:h-[75vh] lg:h-[70vh] xl:h-[75vh]"
              >
                <img
                  src={src}
                  alt={`Slide ${i + 1}`}
                  className="w-full h-[150] object-contain lg:object-cover xl:object-contain 
                    object-center 
                    transition-all duration-500"
                />
              </div>
            ))}
            autoPlay
            dots={false}
            interval={5000}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
        </div>
      </div>
    </section>
  );
};
