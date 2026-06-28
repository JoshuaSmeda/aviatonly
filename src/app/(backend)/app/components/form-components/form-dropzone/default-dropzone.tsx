"use client";

import TitleCard from "../../shared/titleborder-card";
import { Icon } from "@iconify/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const DefaultDropzone = () => {
  return (
    <>
      <TitleCard title="Default Dropzone">
        <div className="flex w-full items-center justify-center">
          <Label
            htmlFor="dropzone-file"
            className="flex  w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-primary bg-primary/12"
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <Icon
                icon="solar:cloud-upload-outline"
                height={32}
                className="mb-3 text-muted-foreground"
              />
              <p className="mb-2 text-sm text-muted-foreground">
                Drop Thumbnail here to upload
              </p>
            </div>
            <Input type="file" id="dropzone-file" className="hidden" />
          </Label>
        </div>
      </TitleCard>
    </>
  );
};

export default DefaultDropzone;
