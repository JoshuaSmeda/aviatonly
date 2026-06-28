import CodePreview from "../../shared/code-preview";
import StudentEnrollmentFormCode from "./code/studentenrollment-formcode";

function StudentEnrollmentForm() {
  return (
    <CodePreview
      component={<StudentEnrollmentFormCode />}
      filePath="/app/components/form-components/Form-Example/code/studentenrollment-formcode.tsx"
      title="Registration Form"
    />
  );
}

export default StudentEnrollmentForm;
