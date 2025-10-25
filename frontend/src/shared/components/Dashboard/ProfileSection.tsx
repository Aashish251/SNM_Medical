import React from "react";
import { BsFillPersonFill, BsFillCameraFill } from "react-icons/bs";
import { IoIosMail } from "react-icons/io";
import { HOME_HERO_BANNER_IMAGE3, DEFAULT_PROFILE_IMAGE } from "@assets/index";

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
    <section className="bg-white rounded-2xl shadow-lg overflow-hidden p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="flex flex-col items-center gap-4 w-full sm:w-auto text-center">
          <div className="relative">
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-full p-1.5">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center">
                {profileImage ? (
                  <img
                    src={profileImage || DEFAULT_PROFILE_IMAGE}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BsFillPersonFill className="text-gray-400 text-6xl" />
                )}
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow cursor-pointer hover:bg-purple-100 transition">
              <BsFillCameraFill className="text-purple-600 text-lg" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
            <div className="mt-2 flex items-center justify-center gap-2 text-gray-600">
              <IoIosMail className="text-purple-600" />
              <span>{qualification}</span>
            </div>
          </div>
        </div>

        {/* Banner */}
        <div className="flex-1 w-full sm:h-56 md:h-64 rounded-xl overflow-hidden relative">
          <img
            src={HOME_HERO_BANNER_IMAGE3}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
        </div>
      </div>
    </section>
  );
};
