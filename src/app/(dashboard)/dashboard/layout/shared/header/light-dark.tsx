import { CustomizerContext } from "@/app/context/customizer-context";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { Icon } from "@iconify/react";
import { Moon, Sun } from "lucide-react";

const LightDark = () => {
  const { activeMode, setActiveMode } = useContext(CustomizerContext);
  const toggleMode = () => {
    setActiveMode(activeMode === "light" ? "dark" : "light");
  };
  return (
    <div>
      {/* Theme Toggle */}
      {activeMode === "light" ? (
        <Button
          variant="ghost"
          className=" h-10 w-10  hover:bg-primary/5  rounded-full cursor-pointer"
          onClick={toggleMode}
        >
          <Moon className="size-5" />
        </Button>
      ) : (
        // Dark Mode Button
        <Button
          variant="ghost"
          className=" h-10 w-10  hover:bg-primary/5  rounded-full cursor-pointer"
          onClick={toggleMode}
        >
          <Sun className="size-5" />
        </Button>
      )}
    </div>
  );
};

export default LightDark;
