// 'use client';

// import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useRouter } from 'next/navigation';
// import { Formik, Form, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { cleanUpExpiredUsers, registerUser } from '@/lib/api';
// import { RegisterCredentials } from '@/types';
// import { loginSuccess } from '@/redux/slices/authSlice';
// import { RootState } from '@/redux/store';

// const validationSchema = Yup.object({
//   name: Yup.string().trim().required('Required'),
//   email: Yup.string()
//     .email('Invalid email address')
//     .trim()
//     .required('Required'),
//   password: Yup.string()
//     .min(8, 'Password must be at least 8 characters')
//     .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
//     .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
//     .matches(/[0-9]/, 'Password must contain at least one number')
//     .matches(
//       /[!@#$%^&*(),.?":{}|<>]/,
//       'Password must contain at least one special character'
//     )
//     .trim()
//     .required('Required'),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref('password')], 'Passwords must match')
//     .trim()
//     .required('Required'),
// });

// export default function Register() {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

//   if (isAuthenticated) {
//     router.push('/');
//     return null;
//   }

//   const handleSubmit = async (
//     values: RegisterCredentials,
//     { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
//   ) => {
//     try {
//       cleanUpExpiredUsers();
//       const response = await registerUser({
//         email: values.email,
//         password: values.password,
//       });

//       dispatch(
//         loginSuccess({
//           id: response.id,
//           email: values.email,
//           name: values.name,
//           token: response.token,
//         })
//       );

//       setSuccess('Account created successfully! Redirecting to dashboard...');
//       setTimeout(() => router.push('/'), 2000);
//     } catch (err: any) {
//       setError(err.message);
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
//           initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting, values, handleChange, handleBlur }) => (
//             <Form className="space-y-4">
//               <div>
//                 <label htmlFor="name" className="block text-sm font-medium text-black">
//                   Name
//                 </label>
//                 <input
//                   id="name"
//                   name="name"
//                   type="text"
//                   value={values.name}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className="w-full p-2 border rounded focus:outline-none text-black"
//                 />
//                 <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
//               </div>
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-black">
//                   Email
//                 </label>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   value={values.email}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className="w-full p-2 border rounded focus:outline-none text-black"
//                 />
//                 <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
//               </div>
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-black">
//                   Password
//                 </label>
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? 'text' : 'password'}
//                   value={values.password}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className="w-full p-2 border rounded focus:outline-none text-black"
//                 />
//                 <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
//               </div>
//               <div>
//                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-black">
//                   Confirm Password
//                 </label>
//                 <input
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type={showPassword ? 'text' : 'password'}
//                   value={values.confirmPassword}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className="w-full p-2 border rounded focus:outline-none text-black"
//                 />
//                 <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
//               </div>
//               <div className="mt-2 flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={showPassword}
//                   onChange={() => setShowPassword(!showPassword)}
//                   className="mr-2"
//                 />
//                 <label className="text-sm text-black">Show Password</label>
//               </div>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full p-2 bg-[#11453B] text-white rounded hover:bg-[#0d3b33]"
//               >
//                 {isSubmitting ? 'Registering...' : 'Register'}
//               </button>
//             </Form>
//           )}
//         </Formik>
//         {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
//         {success && <div className="mt-4 text-[#11453B] text-center">{success}</div>}
//         <p className="mt-5 text-center text-black">
//           Already have an account?{' '}
//           <a href="/login" className="text-[#11453B] hover:underline">
//             Login
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { cleanUpExpiredUsers, registerUser } from "@/lib/api";

export default function Register() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  //   const validationSchema = Yup.object({
  //     name: Yup.string().required("Required"),
  //     email: Yup.string().email("Invalid email address").required("Required"),
  //     password: Yup.string()
  //       .min(8, "At least 8 characters")
  //       .matches(/[A-Z]/, "Must include an uppercase letter")
  //       .matches(/[a-z]/, "Must include a lowercase letter")
  //       .matches(/[0-9]/, "Must include a number")
  //       .matches(/[!@#$%^&*(),.?":{}|<>]/, "Must include a special character")
  //       .required("Required"),
  //     confirmPassword: Yup.string()
  //       .oneOf([Yup.ref("password"), undefined], "Passwords must match")
  //       .required("Required"),
  //   });

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

  const formFields = [
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
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      cleanUpExpiredUsers();
      const response = await registerUser(values.email, values.password);

      const newUser = {
        id: response.id,
        email: values.email,
        name: values.name,
        password: values.password,
        createdAt: new Date().toISOString(),
      };

      interface MockedUser {
        id: string;
        email: string;
        name: string;
        password: string;
        createdAt: string;
      }

      const mockedUsers: MockedUser[] = JSON.parse(
        localStorage.getItem("mockedUsers") || "[]"
      );

      const existingUserIndex: number = mockedUsers.findIndex(
        (u: MockedUser) => u.email.toLowerCase() === values.email.toLowerCase()
      );

      if (existingUserIndex !== -1) {
        mockedUsers[existingUserIndex] = newUser;
      } else {
        mockedUsers.push(newUser);
      }

      localStorage.setItem("mockedUsers", JSON.stringify(mockedUsers));

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
                    // onChange={(e) => {
                    //   e.target.value = e.target.value.replace(/\s/g, ""); // Remove all spaces
                    //   // Update Formik field value
                    //   document.getElementsByName(field.name)[0].value =
                    //     e.target.value;
                    // }}
                    className="w-full p-2 border rounded focus:outline-none"
                  />
                  <ErrorMessage
                    name={field.name}
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              ))}

              {/* Show Password Toggle */}
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
