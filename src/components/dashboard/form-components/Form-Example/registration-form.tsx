import CodePreview from "../../shared/code-preview";
import RegistrationFormCode from "./code/registration-formcode";

function RegistrationForm() {
  return (
    <CodePreview
      component={<RegistrationFormCode />}
      filePath="\app\components\form-components\Form-Example\code\registration-formcode.tsx"
      title="Registration Form"
    />
  );
}

export default RegistrationForm;
