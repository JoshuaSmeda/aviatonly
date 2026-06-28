"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FileUploadMotion from "@/components/dashboard/animated-components/file-uploadmotion";

const Media = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <h5>Cover Image</h5>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FileUploadMotion />
        </CardContent>
      </Card>
    </>
  );
};

export default Media;
