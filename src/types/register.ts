export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface FormField {
  name: keyof RegisterFormValues;
  label: string;
  type: string;
  placeholder: string;
}
