"use client";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { TooltipContent, TooltipProvider, TooltipTrigger, Tooltip } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";

const NotificationTab = () => {
  const [switch1, setSwitch1] = useState(false);
  const [switch2, setSwitch2] = useState(true);
  const [switch3, setSwitch3] = useState(true);
  const [switch4, setSwitch4] = useState(false);
  const [switch5, setSwitch5] = useState(true);
  const [switch6, setSwitch6] = useState(false);

  const notificationTb = [
    {
      title: "Our newsletter",
      subtitle: "We will always let you know about important changes",
      icon: "solar:notification-unread-lines-outline",
      switch: switch1,
      switchfun: setSwitch1,
    },
    {
      title: "Order Confirmation",
      subtitle: "You will be notified when customer order any product",
      icon: "solar:check-square-outline",
      switch: switch2,
      switchfun: setSwitch2,
    },
    {
      title: "Order Status Changed",
      subtitle: "You will be notified when customer make changes to the order",
      icon: "solar:clock-circle-outline",
      switch: switch3,
      switchfun: setSwitch3,
    },
    {
      title: "Order Delivered",
      subtitle: "You will be notified once the order is delivered",
      icon: "solar:rewind-15-seconds-forward-linear",
      switch: switch4,
      switchfun: setSwitch4,
    },
    {
      title: "Email Notification",
      subtitle: "Turn on email notificaiton to get updates through email",
      icon: "solar:bookmark-square-minimalistic-linear",
      switch: switch5,
      switchfun: setSwitch5,
    },
  ];
  return (
    <>
      <div className="flex justify-center">
        <div className="lg:w-3/4 w-full">
          <Card className="shadow-none pb-0">
            <CardHeader>
              <CardTitle>
                <h5 >Notification Preferences</h5>

              </CardTitle>
              <CardDescription>
                <p >
                  Select the notificaitons ou would like to receive via email.
                  Please note that you cannot opt out of receving service messages,
                  such as payment, security or legal notifications.
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="my-4">
                <div className="mb-2 block">
                  <Label htmlFor="eml" >Email</Label>
                </div>
                <Input
                  id="eml"
                  type="email"

                />
                <small className="text-sm  text-muted-foreground">
                  Required for notificaitons.
                </small>
              </div>

              <div>
                {notificationTb.map((item, index) => (
                  <div className="flex mb-6 items-center" key={index} >
                    <div className="flex gap-3.5">
                      <div className="flex justify-center h-12 w-12 rounded-md bg-muted  items-center ">
                        <Icon icon={item.icon} height={22} />
                      </div>
                      <div>
                        <h6 className="text-base">{item.title}</h6>
                        <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                      </div>
                    </div>
                    <div className="ms-auto">
                      <Switch
                        checked={item.switch}
                        onCheckedChange={item.switchfun}
                        className={"cursor-pointer"}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-[30px] shadow-none ">
            <CardHeader>
              <CardTitle>
                <h5 >Date & Time</h5>
              </CardTitle>
              <CardDescription>
                <p className="-mt-1">
                  Time zones and calendar display settings.
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mt-6">
                <div className="flex gap-3.5">
                  <div className="flex justify-center h-12 w-12 rounded-md  bg-muted items-center ">
                    <Icon icon="solar:clock-circle-outline" height={22} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time zone</p>
                    <h6 className="text-base">(UTC + 02:00) Athens, Bucharet</h6>
                  </div>
                </div>
                <div className="ms-auto">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Icon
                          icon="solar:download-minimalistic-outline"
                          height={18}
                          className=" cursor-pointer"
                        />
                      </TooltipTrigger>
                      <TooltipContent>Download</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-[30px] shadow-none">
            <CardHeader>
              <CardTitle>
                <h5 >Ignore Tracking</h5>
              </CardTitle>
              <CardDescription>
                <p className="-mt-1">
                  Time zones and calendar display settings.
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mt-5">
                <div className="flex gap-3.5">
                  <div className="flex justify-center h-12 w-12 rounded-md  bg-muted items-center ">
                    <Icon icon="solar:stopwatch-pause-outline" height={22} />
                  </div>
                  <div>
                    <h6 className="text-base">Ignore Browser Tracking</h6>
                    <p className="text-sm text-muted-foreground">Browser Cookie</p>
                  </div>
                </div>
                <div className="ms-auto">
                  <Switch checked={switch6} onCheckedChange={setSwitch6} className={"cursor-pointer"} />
                </div>
              </div>
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

export default NotificationTab;
