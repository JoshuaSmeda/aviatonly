import React from "react";
import EmployeeRepeaterFormCode from "./code/employeerepeater-formcode";
import CodePreview from "../../shared/code-preview";

function EmployeeRepeaterForm() {
  return (
    <CodePreview
      component={<EmployeeRepeaterFormCode />}
      filePath="\app\components\form-components\Form-Repeater\code\employeerepeater-formcode.tsx"
      title="Registration Form"
    />
  );
}

export default EmployeeRepeaterForm;
