"use client";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CustomizerContext } from "@/app/context/customizer-context";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const Languages = [
  {
    flagname: "English (UK)",
    icon: "/images/flag/icon-flag-en.svg",
    value: "en",
  },
  {
    flagname: "中国人 (Chinese)",
    icon: "/images/flag/icon-flag-cn.svg",
    value: "ch",
  },
  {
    flagname: "français (French)",
    icon: "/images/flag/icon-flag-fr.svg",
    value: "fr",
  },
  {
    flagname: "عربي (Arabic)",
    icon: "/images/flag/icon-flag-sa.svg",
    value: "ar",
  },
];

export const Language = () => {
  const { i18n } = useTranslation();
  const { isLanguage, setIsLanguage } = useContext(CustomizerContext);

  const currentLang =
    Languages.find((_lang) => _lang.value === isLanguage) || Languages[1];

  useEffect(() => {
    if (i18n && typeof i18n.changeLanguage === "function") {
      i18n.changeLanguage(isLanguage);
    }
  }, [isLanguage, i18n]);

  return (
    <div className="relative ">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="h-10 w-10 text-muted-foreground hover:bg-primary/5 hover:text-primary dark:hover:bg-primary/5 dark:hover:text-primary rounded-full transition cursor-pointer flex items-center justify-center">
            <Image
              src={currentLang.icon}
              alt="language"
              width={40}
              height={40}
              className="rounded-full h-5 w-5 shrink-0 object-cover cursor-pointer"
            />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56 rounded-sm p-1 z-50">
          {Languages.map((item, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => setIsLanguage(item.value)}
              className="flex gap-3 items-center py-2 px-4 cursor-pointer hover:bg-muted"
            >
              <Image
                src={item.icon}
                alt={item.flagname}
                width={40}
                height={40}
                className="rounded-full object-cover h-5 w-5"
              />
              <span className="text-sm text-muted-foreground group-hover:text-primary font-medium leading-[25px]">
                {item.flagname}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
