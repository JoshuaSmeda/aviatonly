"use client";

import FileUploadMotion from "../../animated-components/file-uploadmotion";
import TitleCard from "../../shared/titleborder-card";

const AnimatedDropzone = () => {
  return (
    <>
      <TitleCard title="Animated Dropzone">
        <div>
          <FileUploadMotion />
        </div>
      </TitleCard>
    </>
  );
};

export default AnimatedDropzone;
