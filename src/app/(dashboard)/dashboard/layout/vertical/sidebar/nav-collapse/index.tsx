"use client";

import Link from "next/link";
import NavItem from "../nav-items/index";
import { cn, withDashboardBase } from "@/lib/utils";
import { useContext, useEffect } from "react";
import { CustomizerContext } from "@/app/context/customizer-context";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { MenuItem, ChildItem } from "../sidebaritems";
import { useTranslation } from "react-i18next";

interface NavCollapseProps {
  menu: MenuItem[];
  className?: string;
}

export default function NavCollapse({ menu, className }: NavCollapseProps) {
  const pathname = usePathname();
  const { isCollapse } = useContext(CustomizerContext);
  const { t } = useTranslation();

  // 🔍 Check active recursively (for parent auto-open)
  const isActiveRoute = (item: ChildItem): boolean => {
    if (item.url && !item.external && pathname === withDashboardBase(item.url))
      return true;
    if (item.items) return item.items.some(isActiveRoute);
    return false;
  };
  const { setOpen } = useSidebar();

  useEffect(() => {
    if (isCollapse) {
      setOpen(false);
    }
  }, [isCollapse]);

  return (
    <>
      {menu.map((section, index) => (
        <div key={index}>
          {/* Heading */}

          <span className={cn(
            "px-3 text-xs uppercase block mt-4 font-semibold text-muted-foreground mb-2 transition-all duration-200",
            isCollapse ? "text-center group-hover:text-start group-data-[state=expanded]:text-start" : ""
          )}>
            {isCollapse ? (
              <>
                <span className="group-hover:hidden group-data-[state=expanded]:hidden">...</span>
                <span className="hidden group-hover:inline group-data-[state=expanded]:inline">{t(section.heading ?? "")}</span>
              </>
            ) : (
              t(section.heading ?? "")
            )}
          </span>

          {section.items?.map((item: ChildItem, index) => {
            const hasChildren =
              Array.isArray(item.items) && item.items.length > 0;
            const active = isActiveRoute(item); // ⭐ detect active state

            // 👉 No children → direct link
            if (!hasChildren)
              return (
                <Link
                  key={index}
                  href={item.external ? item.url || "#" : withDashboardBase(item.url)}
                  target={item.external ? "_blank" : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 my-1 rounded-md hover:transform hover:translate-x-1 transition-all duration-200 ease-in-out ",
                    active
                      ? "bg-primary text-background font-medium"
                      : "hover:bg-primary/5 hover:text-primary",
                    className,
                  )}
                >
                  <NavItem item={item} hasChildren={false} />
                </Link>
              );

            // 👉 With children → collapsible
            return (
              <details
                key={index}
                className="group/nav"
                open={active || item.isActive}
              >
                <summary
                  className={cn(
                    "cursor-pointer px-3 py-2 mt-1 rounded-md flex items-center hover:transform hover:translate-x-1 transition-all duration-200 ease-in-out",
                    active
                      ? "bg-primary text-background font-medium"
                      : "hover:bg-primary/5 hover:text-primary",
                  )}
                >
                  <NavItem
                    item={item}
                    hasChildren={true}
                    className={className}
                  />
                </summary>

                <div className="pl-3 py-1 ml-5 space-y-1 border-l border-border">
                  {item.items?.map((sub: ChildItem, index) =>
                    sub.items ? (
                      <NavCollapse
                        key={index}
                        menu={[{ items: [sub] }]}
                        className={className}
                      />
                    ) : (
                      <Link
                        key={index}
                        href={sub.external ? sub.url || "#" : withDashboardBase(sub.url)}
                        target={sub.external ? "_blank" : undefined}
                        className={cn(
                          "block px-2 py-1 rounded-md hover:transform hover:translate-x-1 transition-all duration-200 ease-in-out",
                          !sub.external && pathname === withDashboardBase(sub.url)
                            ? "font-medium bg-primary/5 text-primary"
                            : "hover:bg-primary/5 hover:text-primary",
                          className,
                        )}
                      >
                        <NavItem item={sub} hasChildren={false} />
                      </Link>
                    )
                  )}
                </div>
              </details>
            );
          })}
        </div>
      ))}
    </>
  );
}
