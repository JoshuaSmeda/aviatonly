"use client";
import { useContext, useState } from "react";
import ContactSearch from "./contact-search";
import { ContactContextProvider } from "@/app/context/conatact-context";
import ContactListItem from "./contact-listitem";
import ContactList from "./contact-list";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import ContactFilter from "./contact-filter";
import { CustomizerContext } from "@/app/context/customizer-context";

const index = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const [isOpenContact, setIsOpenContact] = useState(false);
  const { activeDir } = useContext(CustomizerContext);

  return (
    <>
      <ContactContextProvider>
        <Card className="p-0 overflow-hidden">
          <div className="flex">
            {/* ------------------------------------------- */}
            {/* Left Part */}
            {/* ------------------------------------------- */}
            <Sheet open={isOpen} onOpenChange={handleClose}>
              <SheetContent
                side={activeDir === "rtl" ? "right" : "left"}
                className="!max-w-[230px] !sm:max-w-[230px] w-full h-full lg:z-0 lg:hidden block"
                showCloseButton={false}
              >
                <VisuallyHidden>
                  <SheetTitle>title</SheetTitle>
                </VisuallyHidden>
                <ContactFilter />
              </SheetContent>
            </Sheet>

            <div className="max-w-[230px] sm:max-w-[230px] w-full h-auto lg:block hidden">
              <ContactFilter />
            </div>

            {/* ------------------------------------------- */}
            {/* Middle part */}
            {/* ------------------------------------------- */}
            <div className="left-part lg:max-w-[340px] max-w-full lg:border-e lg:border-border border-e-0  w-full px-0 pt-0">
              <ContactSearch onClick={() => setIsOpen(true)} />
              <ContactList openContact={setIsOpenContact} />
            </div>

            {/* ------------------------------------------- */}
            {/* Detail part */}
            {/* ------------------------------------------- */}
            <ContactListItem
              openContactValue={isOpenContact}
              onCloseContact={() => setIsOpenContact(false)}
            />
          </div>
        </Card>
      </ContactContextProvider>
    </>
  );
};

export default index;
