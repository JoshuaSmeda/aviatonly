"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipContent, TooltipProvider, TooltipTrigger, Tooltip } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
const BillsTabs = () => {
  return (
    <TooltipProvider>
      <div className="flex justify-center">
        <div className="lg:w-3/4 w-full">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>
                <h5 >Billing Information</h5>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-12 gap-6">
                <div className="md:col-span-6 col-span-12">
                  <div className="flex flex-col gap-3">
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="bnm">Business Name*</Label>
                      </div>
                      <Input
                        id="bnm"
                        type="text"
                        placeholder="Visitors Analytics"

                      />
                    </div>
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="banm">Business Address*</Label>
                      </div>
                      <Input
                        id="banm"
                        type="text"

                      />
                    </div>
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="fnm">First Name*</Label>
                      </div>
                      <Input
                        id="fnm"
                        type="text"

                      />
                    </div>
                  </div>
                </div>
                <div className="md:col-span-6 col-span-12">
                  <div className="flex flex-col gap-3">
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="bssector">Business Sector*</Label>
                      </div>
                      <Input
                        id="bssector"
                        type="text"
                        placeholder="Arts, Media & Entertainment"

                      />
                    </div>

                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="ct">Country*</Label>
                      </div>
                      <Input
                        id="ct"
                        type="text"
                        placeholder="Romania"

                      />
                    </div>
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="lnm">Last Name*</Label>
                      </div>
                      <Input
                        id="lnm"
                        type="text"

                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-nonemt-7">
            <CardHeader>
              <CardTitle>
                <h5 >Current Plan</h5>
              </CardTitle>

              <CardDescription>
                <p>
                  Thanks for being a premium member and supporting our development.
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent>

              <div className="flex items-center ">
                <div className="flex gap-3.5">
                  <div className="flex justify-center h-12 w-12 rounded-md bg-muted items-center ">
                    <Icon icon="solar:box-linear" height={20} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground ">Current Plan</p>
                    <h6 className="text-base">750.000 Monthly Visits</h6>
                  </div>
                </div>
                <div className="ms-auto">
                  <Tooltip>
                    <TooltipTrigger>
                      <Icon icon="solar:add-circle-outline"
                        height={18}
                        className=" cursor-pointer"
                      />
                    </TooltipTrigger>
                    <TooltipContent>Add</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <Button >Change Plan</Button>
                <Button variant={"destructive"}>Reset Plan</Button>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none mt-7">

            <CardHeader>
              <CardTitle>
                <h5 >Payment Method</h5>

              </CardTitle>
              <CardDescription>
                <p className=" -mt-1">On 26 December, 2023</p>

              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center ">
                <div className="flex gap-3.5">
                  <div className="flex justify-center h-12 w-12 rounded-md bg-muted items-center ">
                    <Icon icon="solar:box-linear" height={20} />
                  </div>
                  <div>
                    <h6 className="text-base">Visa</h6>
                    <p className="text-sm ">
                      *****2102
                    </p>
                  </div>
                </div>
                <div className="ms-auto">
                  <Tooltip>
                    <TooltipTrigger>
                      <Icon icon="solar:pen-2-outline"
                        height={18}
                        className=" cursor-pointer"
                      />
                    </TooltipTrigger>
                    <TooltipContent>Edit</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <p className="text-sm  my-2 text-muted-foreground">If you updated your payment method, it will only be dislpayed here after your next billing cycle.</p>
              <Button variant={"destructive"} className="w-fit">Cancel Subscription</Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-7">
        <Button>Save</Button>
        <Button variant={"destructive"}>Cancel</Button>
      </div>
    </TooltipProvider>
  );
};

export default BillsTabs;
