import { useContext } from "react";
import { Icon } from "@iconify/react";
import Messages from "./notifications";
import Profile from "./profile";
import { Language } from "./language";

import { CustomizerContext } from "@/app/context/customizer-context";
import { Button } from "@/components/ui/button";

const MobileHeaderItems = () => {
  const { setActiveMode, activeMode } = useContext(CustomizerContext);

  const toggleMode = () => {
    setActiveMode(activeMode === "light" ? "dark" : "light");
  };

  return (
    <nav className="rounded-none bg-card dark:bg-chart-4 flex-1 px-9 ">
      {/* Toggle Icon   */}

      <div className="xl:hidden block w-full">
        <div className="flex justify-center items-center">
          {/* Theme Toggle */}
          {activeMode === "light" ? (
            <Button
              variant="ghost"
              className="relative h-10 w-10 text-muted-foreground hover:bg-primary/5 hover:text-primary dark:hover:bg-primary/5 dark:hover:text-primary rounded-full cursor-pointer"
              onClick={toggleMode}
            >
              <Icon icon="solar:moon-line-duotone" className="size-5" />
            </Button>
          ) : (
            // Dark Mode Button
            <Button
              variant="ghost"
              className="relative h-10 w-10 text-muted-foreground hover:bg-primary/5 hover:text-primary dark:hover:bg-primary/5 dark:hover:text-primary rounded-full cursor-pointer"
              onClick={toggleMode}
            >
              <Icon
                icon="solar:sun-2-line-duotone"
                className="size-5"
              // className='group-hover:text-primary'
              />
            </Button>
          )}

          {/* Notification Dropdown */}

          {/* Messages Dropdown */}
          <Messages />

          {/* Language Dropdown*/}
          <Language />

          {/* Profile Dropdown */}
          <Profile />
        </div>
      </div>
    </nav>
  );
};

export default MobileHeaderItems;
