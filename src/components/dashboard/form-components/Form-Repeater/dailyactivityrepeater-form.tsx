import React from "react";
import CodePreview from "../../shared/code-preview";

import DailyActivityRepeaterFormCode from "./code/dailyactivityrepeater-formcode";

function DailyActivityRepeaterForm() {
  return (
    <CodePreview
      component={<DailyActivityRepeaterFormCode />}
      filePath="\app\components\form-components\Form-Repeater\code\dailyactivityrepeater-formcode.tsx"
      title="DailyActivityRepeater Form "
    />
  );
}

export default DailyActivityRepeaterForm;
