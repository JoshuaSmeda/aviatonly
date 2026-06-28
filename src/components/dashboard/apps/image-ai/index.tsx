"use client";
import { useContext } from "react";
import { Activity } from "@/components/dashboard/activity";
import ImagePrompt from "./image-prompt";
import GeneratedImageDisplay from "./generated-imagedisplay";
import DefaultImageDisplay from "./default-imagedisplay";
import { Card } from "@/components/ui/card";
import { ImageContext } from "@/app/context/imageai-context";

function ImageAiApp() {
  const { displayedImages, isGenerating } = useContext(ImageContext);

  const hasGeneratedImages = displayedImages && displayedImages.length > 0;
  return (
    <Card className="p-6">
      <div className="h-full flex flex-auto flex-col gap-5">
        <ImagePrompt />
        <Activity
          mode={isGenerating || hasGeneratedImages ? "visible" : "hidden"}
        >
          <GeneratedImageDisplay />
        </Activity>
        <DefaultImageDisplay />
      </div>
    </Card>
  );
}

export default ImageAiApp;
