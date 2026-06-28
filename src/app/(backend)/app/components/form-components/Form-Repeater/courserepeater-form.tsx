import React from "react";
import CodePreview from "../../shared/code-preview";

import CourseRepeaterFormCode from "./code/courserepeater-formcode";

function CourseRepeaterForm() {
  return (
    <CodePreview
      component={<CourseRepeaterFormCode />}
      filePath="\app\components\form-components\Form-Repeater\code\courserepeater-formcode.tsx"
      title="CourseRepeater Form "
    />
  );
}

export default CourseRepeaterForm;
