"use client";

import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Edit2Icon, Power } from "lucide-react";
import { loginSuccess, logout } from "@/redux/slices/authSlice";
import Loading from "@/app/loading";
import { RootState, AppDispatch } from "@/redux/store";
import { storage } from "@/utils/storage";
import { DashboardUser } from "@/types/dashboard";

// Interfaces
interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phoneNumber: string;
}

// Input Field 
const InputField = ({
  label,
  name,
  value,
  onChange,
  isEditing,
  placeholder,
  type = "text",
}: {
  label: string;
  name: keyof FormData;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
  placeholder?: string;
  type?: string;
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-500">{label}</label>
    {isEditing ? (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
        placeholder={placeholder}
      />
    ) : (
      <p className="px-4 py-2 text-gray-800 rounded-lg bg-gray-50">
        {value || "Not provided"}
      </p>
    )}
  </div>
);

// Main Component
export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [isLoading, setIsLoading] = useState(true);
  const [avatar, setAvatar] = useState("/images/default-avatar.jpg");
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    phoneNumber: "",
  });

  // Initialize user data
  useEffect(() => {
    const initializeUser = () => {
      const token = localStorage.getItem("token");
      if (!token || !isAuthenticated) {
        router.push("/login");
        return;
      }

      if (!user?.email) {
        const mockedUsers: DashboardUser[] = storage.getMockedUsers();
        const storedUser = mockedUsers.find((u) => u.email) || mockedUsers[0];
        if (storedUser) {
          dispatch(
            loginSuccess({
              user: {
                email: storedUser.email,
                name:
                  `${storedUser.first_name} ${storedUser.last_name}`.trim() ||
                  "User",
              },
              token,
            })
          );
        } else {
          router.push("/login");
        }
      } else {
        setFormData({
          first_name: user.name?.split(" ")[0] || "",
          last_name: user.name?.split(" ").slice(1).join(" ") || "",
          email: user.email || "",
          phoneNumber: localStorage.getItem(`phone-${user.email}`) || "",
        });
        setAvatar(
          localStorage.getItem(`avatar-${user.email}`) ||
            "/images/default-avatar.jpg"
        );
      }
      setIsLoading(false);
    };

    initializeUser();
  }, [dispatch, router, user, isAuthenticated]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Handle avatar upload
  const handleAvatarChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Image = reader.result as string;
          setAvatar(base64Image);
          localStorage.setItem(`avatar-${user?.email}`, base64Image);
        };
        reader.readAsDataURL(file);
      }
    },
    [user?.email]
  );

  // Handle input changes
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  // Save profile changes
  const handleSave = useCallback(() => {
    if (!user?.email) return;

    // Update localStorage
    localStorage.setItem(`phone-${user.email}`, formData.phoneNumber);
    const mockedUsers = storage.getMockedUsers();
    const userIndex = mockedUsers.findIndex((u) => u.email === user.email);
    if (userIndex !== -1) {
      mockedUsers[userIndex] = {
        ...mockedUsers[userIndex],
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
      };
      storage.setMockedUsers(mockedUsers);
    }

    // Update Redux state
    dispatch(
      loginSuccess({
        user: {
          email: formData.email,
          name: `${formData.first_name} ${formData.last_name}`.trim(),
        },
        token: localStorage.getItem("token")!,
      })
    );

    setIsEditingInfo(false);
  }, [dispatch, formData, user?.email]);

  // Cancel editing
  const handleCancel = useCallback(() => {
    setFormData({
      first_name: user?.name?.split(" ")[0] || "",
      last_name: user?.name?.split(" ").slice(1).join(" ") || "",
      email: user?.email || "",
      phoneNumber: localStorage.getItem(`phone-${user?.email}`) || "",
    });
    setIsEditingInfo(false);
  }, [user]);

  // Logout
  const handleLogout = useCallback(() => {
    dispatch(logout({ email: user?.email }));
  }, [dispatch, user?.email]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-8 text-center relative">
            <button
              onClick={handleLogout}
              className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              aria-label="Logout"
            >
              <Power className="h-4 w-4" />
              <span>Logout</span>
            </button>

            <div className="relative mx-auto w-32 h-32">
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image
                  src={avatar}
                  alt="Profile Avatar"
                  fill
                  className="object-cover"
                  style={{ objectPosition: "center" }}
                  priority
                />
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <Edit2Icon className="h-5 w-5 text-teal-600" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <h1 className="mt-6 text-3xl font-bold text-white">
              {`${formData.first_name} ${formData.last_name}`.trim() ||
                "No Name Provided"}
            </h1>
            <p className="mt-2 text-teal-100">
              {formData.email || "No Email Provided"}
            </p>
          </div>

          {/* Personal Information */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800">
                Personal Information
              </h2>
              {!isEditingInfo && (
                <button
                  onClick={() => setIsEditingInfo(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  aria-label="Edit Profile"
                >
                  <Edit2Icon className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  isEditing={isEditingInfo}
                />
                <InputField
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  isEditing={isEditingInfo}
                />
                <InputField
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  isEditing={isEditingInfo}
                  type="email"
                />
                <InputField
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  isEditing={isEditingInfo}
                  placeholder="+234 123 456 7890"
                />
              </div>

              {isEditingInfo && (
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    aria-label="Save Changes"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
