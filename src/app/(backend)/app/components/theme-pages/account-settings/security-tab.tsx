"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Icon } from "@iconify/react";
const SecurityTab = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-8 col-span-12">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>
                <h5>Two-factor Authentication</h5>
              </CardTitle>
              <CardDescription>
                <div className="flex gap-4 items-center">
                  <div className="lg:flex gap-4 ">
                    <p>
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                      Corporis sapiente sunt earum officiis laboriosam ut.
                    </p>
                    <Button className="lg:mt-0 ">Enable</Button>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="">
                  <h6 className="text-base">Authentication App</h6>
                  <p className="text-sm text-muted-foreground ">Google auth app</p>
                </div>
                <Button className={"bg-primary/12 text-primary"}>Setup</Button>

              </div>
              <div className="flex items-center justify-between border-t border-border pt-4 mt-3">
                <div className="">
                  <h6 className="text-base ">Another e-mail</h6>
                  <p className="text-sm text-muted-foreground">
                    E-mail to send verification link
                  </p>
                </div>
                <Button className={"bg-primary/12 text-primary"}>Setup</Button>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4 mt-3">
                <div className="">
                  <h6 className="text-base ">SMS Recovery</h6>
                  <p className="text-sm text-muted-foreground">
                    Your phone number or something
                  </p>
                </div>
                <Button className={"bg-primary/12 text-primary"}>Setup</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-12">
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex justify-center h-12 w-12 rounded-md items-center ">
                  <Icon icon="solar:laptop-2-broken" height={20} className="text-primary" />
                </div>
                <h5 className="text-lg mt-1">Devices</h5>
              </CardTitle>
              <CardDescription>
                <p className="text-sm  -mt-1">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit Rem.
                </p>
                <Button className="w-fit mt-3">
                  Sign out from all devices
                </Button>
              </CardDescription>
            </CardHeader>

            <CardContent>

              <div className="flex gap-3.5 items-center mt-6">
                <Icon icon="solar:smartphone-vibration-linear" height={20} />
                <div>
                  <h6 className="text-base">iPhone 14</h6>
                  <p className="text-sm text-muted-foreground ">London UK, Oct 23 at 1:15 AM</p>
                </div>
                <Icon icon="qlementine-icons:menu-dots-24" width={18} height={18} className="cursor-pointer ms-auto " />

              </div>
              <div className="flex gap-3.5 items-center border-t border-border mt-2 pt-3">
                <Icon icon="solar:monitor-broken" height={20} />
                <div>
                  <h6 className="text-base">Macbook Air</h6>
                  <p className="text-sm text-muted-foreground">Gujarat India, Oct 24 at 3:15 AM</p>
                </div>
                <Icon icon="qlementine-icons:menu-dots-24" width={20} height={20} className="cursor-pointer ms-auto " />
              </div>
              <Button className="mt-3 bg-primary/12 text-primary">Need Help?</Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-7">
        <Button >Save</Button>
        <Button variant={"destructive"}>Cancel</Button>
      </div>
    </>
  );
};

export default SecurityTab;
