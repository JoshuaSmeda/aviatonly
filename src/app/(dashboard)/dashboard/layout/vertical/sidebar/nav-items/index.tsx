"use client";

import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ChildItem } from "../sidebaritems";

interface NavItemProps {
  item: ChildItem;
  hasChildren: boolean;
  className?: string;
}

export default function NavItem({
  item,
  hasChildren,
  className,
}: NavItemProps) {
  const { t } = useTranslation();
  return (
    <div className={cn("flex items-center gap-3 w-full ", className)}>
      {/* Icon */}
      {item.icon && (
        <Icon icon={item.icon} className={`h-5 w-5 ${item.color ?? ""}`} />
      )}

      {/* Name */}
      <span className="font-medium hide-menu">{t(item.name)}</span>

      {/* Badge */}
      {item.badge && (
        <span
          className={`ms-auto  hide-menu text-xs rounded-full px-2 py-0.5 ${item.badgeType === "filled"
            ? "bg-primary text-white dark:text-black"
            : "border border-primary text-primary"
            }`}
        >
          {item.badgeContent}
        </span>
      )}

      {/* Chevron only if it has children */}
      {hasChildren && (
        <ChevronRight className="ms-auto h-4 w-4 transition-transform duration-200 group-open/nav:rotate-90 hide-menu" />
      )}
    </div>
  );
}
