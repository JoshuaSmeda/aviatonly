import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Mic, ArrowUp, Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ChatAiMsgSent = ({
  onSearchSubmit,
  onFileUpload,
}: {
  onSearchSubmit: (text: string) => void;
  onFileUpload?: (file: File) => void;
}) => {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("Gemini 1.5");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const models = [
    { name: "Claude 3.5 sonnet", icon: Globe },
    { name: "Gemini 1.5 Pro", icon: Globe },
    { name: "GPT-4o", icon: Globe },
    { name: "Llama 3.1", icon: Globe },
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    onSearchSubmit(input);
    setInput("");
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
  };

  return (
    <div className="p-5 w-full">


      {/* Input Container */}
      <div className="bg-background rounded-xl border  shadow-none">
        <Textarea
          placeholder="Ask me anything..."
          className="border-0 shadow-none  focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-auto text-base p-4 bg-transparent placeholder:text-muted-foreground w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        {/* Actions Footer */}
        <div className="flex items-center justify-between gap-1 p-2 sm:p-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full text-foreground transition-colors shrink-0"
              onClick={handleImageClick}
            >
              <Paperclip size={20} />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 sm:h-9 gap-1.5 sm:gap-2 rounded-full px-2 sm:px-3 text-sm font-semibold border-border text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 shrink-0"
                >
                  <Globe size={14} className="text-muted-foreground shrink-0" />
                  <span className="truncate">{selectedModel}</span>
                  <ChevronDown size={14} className="text-muted-foreground ml-0.5 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-auto rounded-xl border-border shadow-xs">
                {models.map((model) => (
                  <DropdownMenuItem
                    key={model.name}
                    className="flex items-center gap-3 p-2.5 cursor-pointer rounded-lg"
                    onClick={() => setSelectedModel(model.name)}
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full">
                      <model.icon size={14} className="text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium">{model.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full shrink-0"
            >
              <Mic size={20} />
            </Button>
            <Button
              size="icon"
              className={cn(
                "h-9 w-9 sm:h-10 sm:w-10 rounded-full transition-all duration-300 shrink-0",
                input.trim()
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-primary/5 text-primary cursor-not-allowed"
              )}
              onClick={handleSend}
              disabled={!input.trim()}
            >
              <ArrowUp size={20} />
            </Button>
          </div>
        </div>
      </div>

    </div >
  );
};

export default ChatAiMsgSent;
