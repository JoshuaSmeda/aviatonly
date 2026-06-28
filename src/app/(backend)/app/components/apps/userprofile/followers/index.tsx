"use client";
import FollowerCard from "@/app/components/apps/userprofile/followers/follower-card";

import React from "react";
import { UserDataProvider } from "@/app/context/userdata-context/index";
import ProfileBanner from "../profile/profilebanners";

const FollowersApp = () => {
  return (
    <>
      <UserDataProvider>
        <div className="grid grid-cols-12 gap-6">
          {/* Banner */}
          <div className="col-span-12">
            <ProfileBanner />
          </div>
          {/* FollowerCard */}
          <div className="col-span-12">
            <FollowerCard />
          </div>
        </div>
      </UserDataProvider>
    </>
  );
};

export default FollowersApp;
