"use client";
import { Input } from "@/components/ui/input";
import React, { useContext } from "react";
import { Icon } from "@iconify/react";
import { EmailContext } from "@/app/context/email-context/index";
import { Button } from "@/components/ui/button";
import PlaceholdersInput from "@/components/dashboard/animated-components/animatedinput-placeholder";
import { SearchIcon } from "lucide-react";

type Props = {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
};
const EmailSearch = ({ onClick }: Props) => {
  const { setSearchQuery, searchQuery } = useContext(EmailContext);

  const handleSearchChange = (event: { target: { value: string } }) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  };

  return (
    <>
      <div className="flex gap-3 px-6 py-5 items-center">
        <Button
          className="!h-8 !w-8 justify-center items-center  p-0 lg:!hidden flex bg-primary/5 text-primary hover:text-white dark:hover:text-black"
          onClick={onClick}
        >
          <Icon icon="tabler:menu-2" height={18} />
        </Button>
        <div className="relative w-full">

          <SearchIcon size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2  text-muted-foreground"
          />

          <PlaceholdersInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholders={[
              "Search Mail...",
              "Find From Your Mails...",
              "Look up Mails...",
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default EmailSearch;
