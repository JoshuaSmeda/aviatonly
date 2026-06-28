"use client";
import React, { useContext } from "react";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { ContactContext } from "@/app/context/conatact-context/index";
import PlaceholdersInput from "../../animated-components/animatedinput-placeholder";
import { SearchIcon } from "lucide-react";

type Props = {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
};

const ContactSearch = ({ onClick }: Props) => {
  const { searchTerm, updateSearchTerm } = useContext(ContactContext);

  return (
    <>
      <div className="flex gap-3  px-6 py-5 items-center">
        <Button
          className=" !h-8 !w-8 justify-center items-center p-0 rounded-md  lg:!hidden flex bg-primary/5 text-primary hover:text-white dark:hover:text-black"
          onClick={onClick}
        >
          <Icon icon="tabler:menu-2" height={18} />
        </Button>
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2  text-muted-foreground">
            <SearchIcon size={16}
            />
          </span>

          <PlaceholdersInput
            className="pl-9 w-full"
            value={searchTerm}
            onChange={(val) => updateSearchTerm(val)}
            placeholders={[
              "Search Contacts...",
              "Find top Contacts...",
              "Look up Contacts...",
            ]}
          />
        </div>
      </div>
    </>
  );
};
export default ContactSearch;
