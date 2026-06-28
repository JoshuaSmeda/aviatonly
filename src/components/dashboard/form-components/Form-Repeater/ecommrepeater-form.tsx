import React from "react";
import CodePreview from "../../shared/code-preview";

import EmployeeRepeaterFormCode from "./code/employeerepeater-formcode";

function EcommRepeaterForm() {
  return (
    <CodePreview
      component={<EmployeeRepeaterFormCode />}
      filePath="\app\components\form-components\Form-Repeater\code\employeerepeater-formcode.tsx"
      title="EcommRepeater Form"
    />
  );
}

export default EcommRepeaterForm;
