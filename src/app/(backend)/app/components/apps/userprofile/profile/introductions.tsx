import { Icon } from "@iconify/react";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Introduction = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Introduction</CardTitle>
          <CardDescription>
            Hello, I am Cameron. I love making websites and graphics. Lorem
            ipsum dolor sit amet, consectetur adipiscing elit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 mt-2">
            <div className="flex gap-3 items-center ">
              <Icon icon="tabler:briefcase" height="20" className="" />
              <p className=" font-semibold">Sir, P P Institute Of Science</p>
            </div>
            <div className="flex gap-3 items-center">
              <Icon icon="tabler:mail" height="20" />
              <p className=" font-semibold">xyzjonathan@gmail.com</p>
            </div>
            <div className="flex gap-3 items-center">
              <Icon icon="tabler:device-desktop" height="20" />
              <p className=" font-semibold">www.xyz.com</p>
            </div>
            <div className="flex gap-3 items-center">
              <Icon icon="tabler:map-pin" height="20" />
              <p className=" font-semibold">Newyork, USA - 100001</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Introduction;
