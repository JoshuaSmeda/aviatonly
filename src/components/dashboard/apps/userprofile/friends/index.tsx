"use client";
import FriendsCard from "@/components/dashboard/apps/userprofile/friends/friends-card";
import ProfileBanner from "@/components/dashboard/apps/userprofile/profile/profilebanners";
import React from "react";
import { UserDataProvider } from "@/app/context/userdata-context/index";

const FriendsApp = () => {
  return (
    <>
      <UserDataProvider>
        <div className="grid grid-cols-12 gap-6">
          {/* Banner */}
          <div className="col-span-12">
            <ProfileBanner />
          </div>
          {/* FriendsCard */}
          <div className="col-span-12">
            <FriendsCard />
          </div>
        </div>
      </UserDataProvider>
    </>
  );
};

export default FriendsApp;
