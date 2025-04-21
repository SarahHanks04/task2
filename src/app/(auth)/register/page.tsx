// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { useDispatch } from "react-redux";
// import { registerUser } from "@/services/auth";

// export default function Register() {
//   const router = useRouter();
//   const dispatch = useDispatch();

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const initialValues = {
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   };

//   const validationSchema = Yup.object({
//     name: Yup.string()
//       .transform((value) => value.trim())
//       .required("Required"),
//     email: Yup.string()
//       .transform((value) => value.trim())
//       .email("Invalid email address")
//       .required("Required"),
//     password: Yup.string()
//       .transform((value) => value.trim())
//       .min(8, "At least 8 characters")
//       .matches(/[A-Z]/, "Must include an uppercase letter")
//       .matches(/[a-z]/, "Must include a lowercase letter")
//       .matches(/[0-9]/, "Must include a number")
//       .matches(/[!@#$%^&*(),.?":{}|<>]/, "Must include a special character")
//       .required("Required"),
//     confirmPassword: Yup.string()
//       .transform((value) => value.trim())
//       .oneOf([Yup.ref("password"), undefined], "Passwords must match")
//       .required("Required"),
//   });

//   const formFields = [
//     {
//       name: "name",
//       label: "Name",
//       type: "text",
//       placeholder: "Enter your name",
//     },
//     {
//       name: "email",
//       label: "Email",
//       type: "email",
//       placeholder: "Enter your email",
//     },
//     {
//       name: "password",
//       label: "Password",
//       type: "password",
//       placeholder: "Create a strong password",
//     },
//     {
//       name: "confirmPassword",
//       label: "Confirm Password",
//       type: "password",
//       placeholder: "Re-enter your password",
//     },
//   ];

//   const handleSubmit = async (
//     values: typeof initialValues,
//     { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
//   ) => {
//     try {
//       const response = await registerUser(values.email, values.password);

//       const newUser = {
//         id: response.id,
//         email: values.email,
//         name: values.name,
//         password: values.password,
//         createdAt: new Date().toISOString(),
//       };

//       interface MockedUser {
//         id: string;
//         email: string;
//         name: string;
//         password: string;
//         createdAt: string;
//       }

//       const mockedUsers: MockedUser[] = JSON.parse(
//         localStorage.getItem("mockedUsers") || "[]"
//       );

//       const existingUserIndex: number = mockedUsers.findIndex(
//         (u: MockedUser) => u.email.toLowerCase() === values.email.toLowerCase()
//       );

//       if (existingUserIndex !== -1) {
//         mockedUsers[existingUserIndex] = newUser;
//       } else {
//         mockedUsers.push(newUser);
//       }

//       localStorage.setItem("mockedUsers", JSON.stringify(mockedUsers));

//       setSuccess("Account created successfully! Redirecting to login...");
//       setTimeout(() => router.push("/login"), 2000);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Something went wrong.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center text-[#11453B]">
//           Register
//         </h2>

//         <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting }) => (
//             <Form className="space-y-4 text-black">
//               {formFields.map((field) => (
//                 <div key={field.name}>
//                   <label
//                     htmlFor={field.name}
//                     className="block text-sm font-medium"
//                   >
//                     {field.label}
//                   </label>
//                   <Field
//                     type={
//                       field.type === "password" && showPassword
//                         ? "text"
//                         : field.type
//                     }
//                     name={field.name}
//                     placeholder={field.placeholder}
//                     className="w-full p-2 border rounded focus:outline-none"
//                   />
//                   <ErrorMessage
//                     name={field.name}
//                     component="div"
//                     className="text-red-500 text-sm"
//                   />
//                 </div>
//               ))}

//               <div className="mt-2 flex items-center text-sm">
//                 <input
//                   type="checkbox"
//                   checked={showPassword}
//                   onChange={() => setShowPassword(!showPassword)}
//                   className="mr-2"
//                 />
//                 <label>Show Password</label>
//               </div>

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full bg-[#11453B] text-white p-2 rounded hover:bg-[#0d3b33]"
//               >
//                 {isSubmitting ? "Registering..." : "Register"}
//               </button>
//             </Form>
//           )}
//         </Formik>

//         {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
//         {success && (
//           <div className="mt-4 text-[#11453B] text-center">{success}</div>
//         )}

//         <p className="mt-5 text-center text-black">
//           Already have an account?{" "}
//           <a href="/login" className="text-[#11453B] hover:underline">
//             Login
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

// components/Register.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { registerUser } from "@/services/auth";
import { RegisterFormValues, FormField } from "@/types/register";

export default function Register() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const initialValues: RegisterFormValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .transform((value) => value.trim())
      .required("Required"),
    email: Yup.string()
      .transform((value) => value.trim())
      .email("Invalid email address")
      .required("Required"),
    password: Yup.string()
      .transform((value) => value.trim())
      .min(8, "At least 8 characters")
      .matches(/[A-Z]/, "Must include an uppercase letter")
      .matches(/[a-z]/, "Must include a lowercase letter")
      .matches(/[0-9]/, "Must include a number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/, "Must include a special character")
      .required("Required"),
    confirmPassword: Yup.string()
      .transform((value) => value.trim())
      .oneOf([Yup.ref("password"), undefined], "Passwords must match")
      .required("Required"),
  });

  const formFields: FormField[] = [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter your name",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter your email",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Create a strong password",
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "Re-enter your password",
    },
  ];

  const handleSubmit = async (
    values: RegisterFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      await registerUser(values.email, values.password);
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#11453B]">
          Register
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4 text-black">
              {formFields.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium"
                  >
                    {field.label}
                  </label>
                  <Field
                    type={
                      field.type === "password" && showPassword
                        ? "text"
                        : field.type
                    }
                    name={field.name}
                    placeholder={field.placeholder}
                    className="w-full p-2 border rounded focus:outline-none"
                  />
                  <ErrorMessage
                    name={field.name}
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              ))}

              <div className="mt-2 flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="mr-2"
                />
                <label>Show Password</label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#11453B] text-white p-2 rounded hover:bg-[#0d3b33]"
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>

        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
        {success && (
          <div className="mt-4 text-[#11453B] text-center">{success}</div>
        )}

        <p className="mt-5 text-center text-black">
          Already have an account?{" "}
          <a href="/login" className="text-[#11453B] hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}