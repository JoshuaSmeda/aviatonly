"use client";

import ProfileBanner from "@/app/components/apps/userprofile/profile/profilebanners";
import React from "react";
import { UserDataProvider } from "@/app/context/userdata-context/index";
import Introduction from "@/app/components/apps/userprofile/profile/introductions";
import Photos from "./photo";
import Post from "./posts";

const UserProfileApp = () => {
  return (
    <>
      <UserDataProvider>
        <div className="grid grid-cols-12 gap-6">
          {/* Banner */}
          <div className="col-span-12">
            <ProfileBanner />
          </div>
          <div className="lg:col-span-4 col-span-12">
            <div className="grid grid-cols-12">
              {/* Introduction */}
              <div className="col-span-12 mb-7">
                <Introduction />
              </div>
              {/* Photos */}
              <div className="col-span-12">
                <Photos />
              </div>
            </div>
          </div>
          <div className="lg:col-span-8 col-span-12">
            <Post />
          </div>
        </div>
      </UserDataProvider>
    </>
  );
};

export default UserProfileApp;
