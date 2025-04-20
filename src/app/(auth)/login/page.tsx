// "use client";

// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/navigation";
// import { Formik, Form, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { RootState } from "@/redux/store";
// import { loginUser, cleanUpExpiredUsers } from "@/lib/api";
// import { loginSuccess } from "@/redux/slices/authSlice";
// import { LoginCredentials } from "@/types";

// const validationSchema = Yup.object({
//   email: Yup.string()
//     .email("Invalid email address")
//     .trim()
//     .required("Required"),
//   password: Yup.string().trim().required("Required"),
// });

// export default function Login() {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const isAuthenticated = useSelector(
//     (state: RootState) => state.auth.isAuthenticated
//   );

//   if (isAuthenticated) {
//     router.push("/");
//     return null;
//   }

//   const handleSubmit = async (
//     values: LoginCredentials,
//     { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
//   ) => {
//     try {
//       cleanUpExpiredUsers();
//       const response = await loginUser(values);
//       const isMockToken = response.token.startsWith("mock-token-");
//       let userName = "User";

//       if (isMockToken) {
//         userName = "Mock User"; // In a real app, fetch from mockedUsers
//       }

//       dispatch(
//         loginSuccess({
//           id: response.id,
//           email: values.email,
//           name: userName,
//           token: response.token,
//         })
//       );
//       router.push("/");
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
//           Login
//         </h2>
//         <Formik
//           initialValues={{ email: "", password: "" }}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting, values, handleChange, handleBlur }) => (
//             <Form className="space-y-4">
//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium text-black"
//                 >
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
//                 <ErrorMessage
//                   name="email"
//                   component="div"
//                   className="text-red-500 text-sm"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-medium text-black"
//                 >
//                   Password
//                 </label>
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   value={values.password}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className="w-full p-2 border rounded focus:outline-none text-black"
//                 />
//                 <ErrorMessage
//                   name="password"
//                   component="div"
//                   className="text-red-500 text-sm"
//                 />
//               </div>
//               <div className="mt-2 flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={showPassword}
//                   onChange={() => setShowPassword(!showPassword)}
//                   className="mr-2"
//                 />
//                 <label className="text-sm text-gray-600">Show Password</label>
//               </div>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full p-2 bg-[#11453B] text-white rounded hover:bg-[#0d3b33]"
//               >
//                 {isSubmitting ? "Logging in..." : "Login"}
//               </button>
//             </Form>
//           )}
//         </Formik>
//         {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
//         <p className="mt-5 text-center text-black">
//           Don't have an account?{" "}
//           <a href="/register" className="text-[#11453B] hover:underline">
//             Register
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { cleanUpExpiredUsers, loginUser } from "@/lib/api";
import { loginSuccess } from "@/redux/slices/authSlice";

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .transform((value) => value.trim())
    .email("Invalid email address")
    .required("Required"),
  password: Yup.string()
    .transform((value) => value.trim())
    .required("Required"),
});

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      cleanUpExpiredUsers();

      const response = await loginUser(values.email, values.password);
      const isMockToken = response.token.startsWith("mock-token-");

      let userName = "User";
      if (isMockToken) {
        const mockedUsers = JSON.parse(
          localStorage.getItem("mockedUsers") || "[]"
        );
        const user = mockedUsers.find(
          (u: any) => u.email.toLowerCase() === values.email.toLowerCase()
        );
        if (user?.name) userName = user.name;
      }

      dispatch(
        loginSuccess({
          user: {
            email: values.email,
            name: userName,
          },
          token: response.token,
        })
      );
      router.push("/");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#11453B]">
          Login
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4 text-black">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  className="w-full p-2 border rounded focus:outline-none"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full p-2 border rounded focus:outline-none"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={() => setShowPassword((prev) => !prev)}
                    className="mr-2"
                  />
                  <label
                    htmlFor="showPassword"
                    className="text-sm text-gray-600"
                  >
                    Show Password
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#11453B] text-white p-2 rounded hover:bg-[#0d3b33] transition"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>

        {/* Error Display */}
        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}

        {/* Redirect to Register */}
        <p className="mt-5 text-center text-black">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-[#11453B] hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
