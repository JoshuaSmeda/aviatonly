"use client";
import React, { useContext, useState, ChangeEvent } from "react";

import { ContactContext } from "@/app/context/conatact-context/index";
import { ContactType } from "@/app/(dashboard-layout)/types/apps/contact";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@iconify/react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const ContactAdd = () => {
  const { addContact } = useContext(ContactContext)!;
  const [showAlert, setShowAlert] = useState(false); // State for showing alert

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    image: "/images/profile/user-5.jpg",
    company: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    department: "",
  });

  const [open, setOpen] = useState(false); // Dialog control

  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newContact: ContactType = {
      ...formData,
      id: Date.now(),
      image:
        typeof formData.image === "string"
          ? formData.image
          : (formData.image as { src: string }).src ||
          "/images/profile/user-5.jpg",
      frequentlycontacted: false,
      starred: false,
      deleted: false,
    };
    addContact(newContact);
    setShowAlert(true);
    setOpen(false);

    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen} >
        <DialogTrigger className={"w-full"}>
          <Button className={" w-full"}>Add New Contact</Button>
        </DialogTrigger>
        <DialogContent className="max-w-xl  rtl:[&_[data-slot=dialog-close]]:left-2 rtl:[&_[data-slot=dialog-close]]:right-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Add New Contact</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Let's add a new contact for your application. Fill in all fields
              and click the submit button.
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-12 gap-6">
              <div className="md:col-span-6 col-span-12">
                <Label htmlFor="firstname" className="mb-2 block capitalize">
                  firstname
                </Label>
                <Input
                  name="firstname"
                  type="text"
                  onChange={handleChange}
                  value={formData.firstname}
                  required
                />
              </div>

              <div className="md:col-span-6 col-span-12">
                <Label htmlFor="lastname" className="mb-2 block capitalize">
                  lastname
                </Label>
                <Input
                  name="lastname"
                  type="text"
                  onChange={handleChange}
                  value={formData.lastname}
                  required
                />
              </div>

              <div className="md:col-span-6 col-span-12">
                <Label htmlFor="Department" className="mb-2 block capitalize cursor-pointer">
                  Select department
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) =>
                    handleChange({
                      target: { name: "department", value: value ?? "" },
                    })
                  }
                >
                  <SelectTrigger id="Department" name="department" className={"w-full"}>
                    <SelectValue>
                      {formData.department || "Select department"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className={"cursor-pointer"} value="Engineering">Engineering</SelectItem>
                    <SelectItem className={"cursor-pointer"} value="Sales">Sales</SelectItem>
                    <SelectItem className={"cursor-pointer"} value="Support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-6 col-span-12">
                <Label htmlFor="company" className="mb-2 block capitalize">
                  company
                </Label>
                <Input
                  name="company"
                  type="text"
                  onChange={handleChange}
                  value={formData.company}
                />
              </div>

              <div className="md:col-span-6 col-span-12">
                <Label htmlFor="phone" className="mb-2 block capitalize">
                  phone
                </Label>
                <Input
                  name="phone"
                  type="tel"
                  onChange={handleChange}
                  value={formData.phone}
                />
              </div>

              <div className="md:col-span-6 col-span-12">
                <Label htmlFor="email" className="mb-2 block capitalize">
                  email
                </Label>
                <Input
                  name="email"
                  type="email"
                  onChange={handleChange}
                  value={formData.email}
                  required
                />
              </div>

              <div className="col-span-12">
                <Label htmlFor="address" className="mb-2 block capitalize">
                  address
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="address..."
                  required
                  rows={4}
                  onChange={handleChange}
                  value={formData.address}
                />
              </div>

              <div className="col-span-12">
                <Label htmlFor="notes" className="mb-2 block capitalize">
                  notes
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="note..."
                  required
                  rows={4}
                  onChange={handleChange}
                  value={formData.notes}
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="submit" className={"text-white"}>Submit</Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>


      </Dialog>

      {showAlert && (
        <Alert variant="default" className="fixed mx-auto left-0 right-0 top-3 w-fit z-20  ">
          <Icon
            icon="tabler:square-rounded-check"
            height={22}
          />
          <AlertTitle className="ml-2 font-medium">
            Contact Added successfully.
          </AlertTitle>
        </Alert>
      )}
    </>
  );
};

export default ContactAdd;
