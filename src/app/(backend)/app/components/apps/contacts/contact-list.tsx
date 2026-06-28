"use client";
import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import {
  ContactContext,
  ContactContextType,
} from "@/app/context/conatact-context/index";
import { ContactType } from "@/app/(dashboard-layout)/types/apps/contact";
import { Icon } from "@iconify/react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertTitle } from "@/components/ui/alert";
import SimpleBar from "simplebar-react";
import { Button } from "@/components/ui/button";
import AnimatedItem from "../../animated-components/list-animation";

type ContactListProps = {
  openContact: Dispatch<SetStateAction<boolean>>;
};

function ContactList({ openContact }: ContactListProps) {
  const {
    selectedDepartment,
    contacts,
    deleteContact,
    starredContacts,
    toggleStarred,
    setSelectedContact,
    selectedContact,
    searchTerm,
  } = useContext(ContactContext) as ContactContextType;

  // Handle click on delete contact
  const handleDeleteClick = (contactId: number) => {
    deleteContact(contactId);
  };
  const [openContactModal, setOpenContactModal] = useState(false);
  const [contactId, setContactId] = useState<number | null>(null);

  // Filter contacts based on selected department and search query
  const filterContacts = (
    contacts: ContactType[],
    selectedDepartment: string,
    search: string
  ): ContactType[] => {
    let filteredContacts = [...contacts];

    if (selectedDepartment !== "All") {
      if (selectedDepartment === "Frequent") {
        filteredContacts = filteredContacts.filter(
          (contact) => contact.frequentlycontacted
        );
      } else if (selectedDepartment === "Starred") {
        filteredContacts = filteredContacts.filter((contact) =>
          starredContacts.includes(contact.id)
        );
      } else {
        filteredContacts = filteredContacts.filter(
          (contact) => contact.department === selectedDepartment
        );
      }
    }

    if (searchTerm.trim() !== "") {
      const searchTermLower = search.toLowerCase();
      filteredContacts = filteredContacts.filter(
        (contact) =>
          contact.firstname.toLowerCase().includes(searchTermLower) ||
          contact.lastname.toLowerCase().includes(searchTermLower)
      );
    }

    return filteredContacts;
  };

  // Get filtered contacts based on selected department and search query
  const filteredContacts = filterContacts(
    contacts,
    selectedDepartment,
    searchTerm
  );

  // Handle click on a contact to view details
  const handleContactClick = (contact: ContactType) => {
    setSelectedContact(contact);
    if (window.innerWidth < 1024) {
      openContact((prev) => !prev);
    }
  };
  return (
    <>
      <SimpleBar className=" h-[calc(100vh_-_300px)]">
        <div className=" h-full w-full">
          {selectedDepartment === "Starred" && filteredContacts.length === 0 ? (
            <div className="px-6 pt-3">
              <Alert variant="destructive">
                <Icon icon="tabler:alert-circle" height={18} />
                <AlertTitle>No starred contacts available.</AlertTitle>
              </Alert>
            </div>
          ) : searchTerm !== "" && filteredContacts.length === 0 ? (
            <div className="px-6 pt-3">
              <Alert variant="destructive">
                <Icon icon="tabler:alert-circle" height={18} />
                <AlertTitle>No contact found.</AlertTitle>
              </Alert>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {filteredContacts.map((contact, index) => (
                <AnimatedItem key={contact.id} index={index}>
                  <div
                    className={`cursor-pointer flex py-4 px-6 gap-3 items-center group bg-primary/5 hover:bg-primary/5  ${selectedContact && selectedContact.id === contact.id
                      ? "bg-primary/5"
                      : "bg-transparent"
                      }`}
                    onClick={() => {
                      handleContactClick(contact);
                    }}
                  >
                    <Image
                      src={contact.image}
                      width={40}
                      height={40}
                      alt="name"
                      className="rounded-full"
                    />
                    <div>
                      <h6
                        className={`text-sm group-hover:text-primary  ${selectedContact && selectedContact.id === contact.id
                          ? "text-primary"
                          : ""
                          }`}
                      >
                        {contact.firstname} {contact.lastname}
                      </h6>
                      <p className="text-xs text-muted-foreground  font-medium mt-0.5">
                        {contact.department}
                      </p>
                    </div>
                    <div className="flex ms-auto">
                      <div
                        className="me-2"
                        onClick={() => toggleStarred(contact.id)}
                      >
                        {starredContacts.includes(contact.id) ? (
                          <Icon
                            icon="tabler:star-filled"
                            className="text-chart-4"
                            height="15"
                          />
                        ) : (
                          <Icon icon="tabler:star" height="15" />
                        )}
                      </div>
                      <div
                        onClick={() => {
                          {
                            setContactId(contact.id);
                            setOpenContactModal(true);
                          }
                        }}
                      >
                        <Icon
                          icon="tabler:trash"
                          height={15}
                          className="hover:text-error"
                        />
                      </div>
                    </div>
                  </div>
                </AnimatedItem>
              ))}
            </div>
          )}
        </div>
      </SimpleBar>
      <Dialog open={openContactModal} onOpenChange={setOpenContactModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex flex-col items-center justify-center text-center py-4">
              <Icon
                icon="tabler:alert-circle"
                className="mx-auto  h-14 w-14 text-destructive"
              />
            </div>
            <DialogTitle className="text-center text-muted-foreground">
              Are you sure you want to delete this contact?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-center gap-4">
            <Button
              className={"bg-primary/5 text-primary hover:bg-primary/20"}
              onClick={() => {
                if (contactId !== null) handleDeleteClick(contactId);
                setOpenContactModal(false);
              }}
            >
              Yes
            </Button>
            <Button
              variant="destructive"
              onClick={() => setOpenContactModal(false)}
            >
              No, cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ContactList;
