import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { useContext } from "react";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from "@/components/ui/menubar";

import Menuitems, { MenuItem } from "../menudata";
import Link from "next/link";
import { CustomizerContext } from "@/app/context/customizer-context";

const Navigation = () => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { activeDir } = useContext(CustomizerContext);
  const isRTL = activeDir === "rtl";

  const isActive = (href: string) => pathname === href;
  const hasChildren = (item: MenuItem) =>
    Array.isArray(item.children) && item.children.length > 0;

  const isItemActive = (item: MenuItem): boolean =>
    isActive(item.href) ||
    (hasChildren(item) &&
      item.children!.some(
        (child) =>
          isActive(child.href) ||
          (child.children && child.children.some((grand) => isActive(grand.href)))
      ));

  return (
    <div className="xl:px-0 mx-auto">
      <Menubar className="border-0 shadow-none bg-transparent p-0 h-auto min-h-0 gap-1 flex flex-wrap md:flex-nowrap">
        {Menuitems.map((item) => {
          const itemActive = isItemActive(item);
          const isExternal = /^https?:\/\//.test(item.href);

          return (
            <MenubarMenu key={item.id}>
              {hasChildren(item) ? (
                <>
                  {/* Top-level trigger with children */}
                  <MenubarTrigger
                    className={`capitalize font-medium flex gap-2 items-center py-2 px-3 rounded-md cursor-pointer transition-colors whitespace-nowrap
                      ${
                        itemActive
                          ? "text-white! dark:text-black! bg-primary! data-[state=open]:text-white! data-[state=open]:bg-primary!"
                          : "text-primary hover:text-primary data-[state=open]:bg-primary/5 data-[state=open]:text-primary"
                      }`}
                  >
                    {item.icon && (
                      <Icon icon={item.icon} className="w-5 h-5 shrink-0" />
                    )}
                    <span>{t(item.title)}</span>
                    <Icon
                      icon="lucide:chevron-down"
                      className="w-4 h-4 shrink-0 opacity-60"
                    />
                  </MenubarTrigger>

                  <MenubarContent
                    align={isRTL ? "end" : "start"}
                    className="bg-card shadow-lg min-w-[200px] p-2 rounded-lg z-50"
                  >
                    {item.children?.map((child) => {
                      const childActive =
                        isActive(child.href) ||
                        (child.children &&
                          child.children.some((sub) => isActive(sub.href)));
                      const childExternal = /^https?:\/\//.test(child.href);

                      if (hasChildren(child)) {
                        return (
                          <MenubarSub key={child.id}>
                            <MenubarSubTrigger
                              className={`text-sm flex items-center gap-2 rounded-md px-2 py-2 cursor-pointer transition-colors w-full
                                ${
                                  childActive
                                    ? "text-primary font-semibold"
                                    : "text-primary"
                                }`}
                            >
                              {child.icon && (
                                <Icon
                                  icon={child.icon}
                                  className="w-5 h-5 shrink-0 transition-colors"
                                />
                              )}
                              <span className="transition-colors">
                                {t(child.title)}
                              </span>
                            </MenubarSubTrigger>

                            <MenubarSubContent
                              className="bg-card min-w-[200px] p-2 rounded-lg ml-1 shadow-lg"
                            >
                              {child.children?.map((sub) => {
                                const subActive = isActive(sub.href);
                                const subExternal = /^https?:\/\//.test(sub.href);
                                return (
                                  <MenubarItem key={sub.id} >
                                    <Link
                                      href={sub.href}
                                      target={subExternal ? "_blank" : "_self"}
                                      className={`group text-sm flex items-center gap-3 rounded-md cursor-pointer transition-colors w-full
                                        ${
                                          subActive
                                            ? "text-primary font-semibold"
                                            : "text-primary"
                                        }`}
                                    >
                                      <Icon
                                        icon="icon-park-outline:dot"
                                        className="text-primary transition-colors"
                                      />
                                      <span className="transition-colors group-hover:text-primary">
                                        {t(sub.title)}
                                      </span>
                                    </Link>
                                  </MenubarItem>
                                );
                              })}
                            </MenubarSubContent>
                          </MenubarSub>
                        );
                      }

                      return (
                        <MenubarItem key={child.id} className={"px-0 py-0"}>
                          <Link
                            href={child.href}
                            target={childExternal ? "_blank" : "_self"}
                            className={`group text-sm flex items-center gap-2 rounded-md px-2 py-2 cursor-pointer transition-colors w-full
                              ${
                                childActive
                                  ? "text-primary font-semibold"
                                  : "text-primary"
                              }`}
                          >
                            {child.icon && (
                              <Icon
                                icon={child.icon}
                                className="w-5 h-5 shrink-0 transition-colors group-hover:text-primary"
                              />
                            )}
                            <span className="transition-colors group-hover:text-primary">
                              {t(child.title)}
                            </span>
                          </Link>
                        </MenubarItem>
                      );
                    })}
                  </MenubarContent>
                </>
              ) : (
                /* Leaf item — no children, render trigger as a Link */
                <MenubarTrigger>
                  <Link
                    href={item.href}
                    target={isExternal ? "_blank" : "_self"}
                    className={`capitalize font-medium flex gap-2 items-center py-2 px-3 rounded-md cursor-pointer transition-colors whitespace-nowrap
                      ${
                        itemActive
                          ? "text-white! dark:text-black! bg-primary!"
                          : "text-primary hover:text-primary"
                      }`}
                  >
                    {item.icon && (
                      <Icon icon={item.icon} className="w-5 h-5 shrink-0" />
                    )}
                    <span>{t(item.title)}</span>
                  </Link>
                </MenubarTrigger>
              )}
            </MenubarMenu>
          );
        })}
      </Menubar>
    </div>
  );
};

export default Navigation;
