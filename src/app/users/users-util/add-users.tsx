"use client";

import { useState, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { createUser } from "@/services/users";
import { DashboardUser } from "@/types/dashboard";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: (user: DashboardUser) => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
}

// Reusable form input component
const FormInput = ({
  label,
  name,
  type = "text",
  register,
  errors,
  placeholder,
  requiredMessage = `${label} is required`,
}: {
  label: string;
  name: keyof FormData;
  type?: string;
  register: ReturnType<typeof useForm<FormData>>["register"];
  errors: ReturnType<typeof useForm<FormData>>["formState"]["errors"];
  placeholder: string;
  requiredMessage?: string;
}) => (
  <div className="flex-1">
    <label className="block text-sm font-medium text-[#11453B] mb-1">
      {label}
    </label>
    <input
      type={type}
      {...register(name, { required: requiredMessage })}
      className="w-full p-2 rounded-md bg-white text-[#11453B] placeholder-gray-500 border border-[#11453B]/30 focus:outline-none focus:ring-1 focus:ring-[#11453B]/50"
      placeholder={placeholder}
    />
    {errors[name] && (
      <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>
    )}
  </div>
);

// Reusable select component
const FormSelect = ({
  label,
  name,
  options,
  register,
  errors,
}: {
  label: string;
  name: keyof FormData;
  options: { value: string; label: string }[];
  register: ReturnType<typeof useForm<FormData>>["register"];
  errors: ReturnType<typeof useForm<FormData>>["formState"]["errors"];
}) => (
  <div>
    <label className="block text-sm font-medium text-[#11453B] mb-1">
      {label}
    </label>
    <select
      {...register(name, { required: `${label} is required` })}
      className="w-full p-2 rounded-md bg-white text-[#11453B] border border-[#11453B]/30 focus:outline-none focus:ring-1 focus:ring-[#11453B]/50"
    >
      <option value="">Select a {label.toLowerCase()}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {errors[name] && (
      <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>
    )}
  </div>
);

export default function AddUserModal({
  isOpen,
  onClose,
  onUserAdded,
}: AddUserModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      status: "",
    },
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    try {
      const newUser: Partial<DashboardUser> = {
        id: Date.now().toString(),
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        role: data.role || "General Back Office",
        status: data.status || "Active",
        created_at: new Date().toISOString(),
        avatar: imagePreview || "/images/default-avatar.jpg",
      };
      const response = await createUser(newUser);
      onUserAdded(response);
      toast.success("User added successfully!", {
        position: "top-right",
        duration: 4000,
        style: { background: "#11453B", color: "#fff" },
      });
      reset();
      setImagePreview(null);
      onClose();
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user", {
        position: "top-right",
        duration: 4000,
        style: { background: "#ef4444", color: "#fff" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-[#F0F7EB] rounded-lg p-6 shadow-xl max-w-lg w-full border border-[#11453B]/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#11453B]">Add New User</h2>
          <button
            onClick={onClose}
            className="text-[#11453B] hover:text-[#11453B]/70"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Image Upload */}
          <div className="flex flex-col items-center mb-4">
            <div
              onClick={handleAvatarClick}
              className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mb-2 cursor-pointer relative hover:bg-gray-300 transition-colors"
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <Plus size={32} className="text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Add Photo</span>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            <p className="text-xs text-gray-500 mt-1">
              Click on the avatar to upload an image
            </p>
          </div>

          {/* Name */}
          <div className="flex gap-4">
            <FormInput
              label="First Name"
              name="firstName"
              register={register}
              errors={errors}
              placeholder="Enter first name"
            />
            <FormInput
              label="Last Name"
              name="lastName"
              register={register}
              errors={errors}
              placeholder="Enter last name"
            />
          </div>

          {/* Email and Role */}
          <div className="flex gap-4">
            <FormInput
              label="Email"
              name="email"
              type="email"
              register={register}
              errors={errors}
              placeholder="Enter email"
              requiredMessage="Please enter a valid email address"
            />
            <FormSelect
              label="Role"
              name="role"
              register={register}
              errors={errors}
              options={[
                { value: "General Back Office", label: "General Back Office" },
                { value: "Admin", label: "Admin" },
                { value: "General Partner", label: "General Partner" },
                { value: "Wealth Manager", label: "Wealth Manager" },
              ]}
            />
          </div>

          {/* Status */}
          <FormSelect
            label="Status"
            name="status"
            register={register}
            errors={errors}
            options={[
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
              { value: "Pending", label: "Pending" },
            ]}
          />

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#11453B] text-white rounded-md hover:bg-[#0d3b33] transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
