import React from "react";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProfileTab from "./profiletabs";
import { Icon } from "@iconify/react/dist/iconify.js";

const ProfileBanner = () => {
  return (
    <>
      <Card className="p-0 overflow-hidden">
        <Image
          src={"/images/backgrounds/profilebg.jpg"}
          alt="priofile banner"
          className="w-full"
          width={330}
          height={330}
        />
        <div className="p-6 -mt-2">
          <div className="grid grid-cols-12 gap-3">
            <div className="lg:col-span-4 col-span-12 lg:order-1 order-2">
              <div className="flex gap-6 items-center justify-around lg:py-0 py-4">
                <div className="text-center">
                  <Icon
                    icon="akar-icons:file"
                    width={"18s"}
                    height={"18"}
                    className="block mx-auto opacity-50 "
                  />
                  <h4 className="text-xl">938</h4>
                  <p className="text-muted-foreground text-sm">Posts</p>
                </div>
                <div className="text-center">
                  <Icon
                    icon="qlementine-icons:user-16"
                    width={"18s"}
                    height={"18"}
                    className="block mx-auto  opacity-50"
                  />
                  <h4 className="text-xl">3,586</h4>
                  <p className="text-muted-foreground  text-sm">Followers</p>
                </div>
                <div className="text-center">
                  <Icon
                    icon="tabler:user-check"
                    width={"18s"}
                    height={"18"}
                    className="block mx-auto  opacity-50"
                  />
                  <h4 className="text-xl">2,659</h4>
                  <p className="text-muted-foreground  text-sm">Following</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 col-span-12 lg:order-2 order-1">
              <div className="text-center -mt-20 ">
                <div className="w-[110px] h-[110px] bg-gradient-to-b from-[rgb(80,178,252)] to-[rgb(244,76,102)] rounded-full flex justify-center items-center mx-auto">
                  <Image
                    src="/images/profile/avtar.webp"
                    alt="profile"
                    height="100"
                    width="100"
                    className="rounded-full mx-auto border-4 border-border "
                  />
                </div>
                <h5 className="text-lg mt-3">Cameron</h5>
                <p className="text-muted-foreground">Designer</p>
              </div>
            </div>
            <div className="lg:col-span-4 col-span-12 lg:order-3 order-3">
              <div className="flex items-center gap-3.5 lg:justify-end justify-center h-full xl:pe-4">
                <Button className="h-9 w-9 rounded-full p-0 ">
                  <Link href={""}>
                    <Icon icon="mynaui:facebook" />
                  </Link>
                </Button>
                <Button
                  className="h-9 w-9 rounded-full p-0 text-primary"
                  variant={"secondary"}
                >
                  <Link href={""}>
                    <Icon icon="flowbite:dribbble-solid" />
                  </Link>
                </Button>
                <Button className="h-9 w-9 rounded-full p-0 bg-destructive text-white">
                  <Link href={""}>
                    <Icon icon="si:youtube-line" />
                  </Link>
                </Button>
                <Button className="rounded-md">Add To Story</Button>
              </div>
            </div>
          </div>
        </div>
        {/* Profile Tabs */}
        <ProfileTab />
      </Card>
    </>
  );
};

export default ProfileBanner;
