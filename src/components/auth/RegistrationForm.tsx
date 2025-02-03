import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  username: string;
  mobileNumber: string;
}

interface RegistrationFormProps {
  onComplete: (data: FormData) => void;
}

export function RegistrationForm({ onComplete }: RegistrationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    username: '',
    mobileNumber: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = async () => {
    const newErrors: Partial<FormData> = {};

    // Required fields
    Object.keys(formData).forEach((key) => {
      if (!formData[key as keyof FormData]) {
        newErrors[key as keyof FormData] = 'This field is required';
      }
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    // Password match
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Mobile number format
    const mobileRegex = /^\+?[\d\s-]{10,}$/;
    if (formData.mobileNumber && !mobileRegex.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Invalid mobile number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isValid = await validateForm();
      if (!isValid) {
        setLoading(false);
        return;
      }

      await onComplete(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-dark-100 border border-white/10 text-white px-3 py-2 focus:ring-2 focus:ring-white focus:border-white"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-dark-100 border border-white/10 text-white px-3 py-2 focus:ring-2 focus:ring-white focus:border-white"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-dark-100 border border-white/10 text-white px-3 py-2 focus:ring-2 focus:ring-white focus:border-white"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-400">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-dark-100 border border-white/10 text-white px-3 py-2 focus:ring-2 focus:ring-white focus:border-white"
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-400">{errors.username}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Mobile Number</label>
        <input
          type="tel"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-dark-100 border border-white/10 text-white px-3 py-2 focus:ring-2 focus:ring-white focus:border-white"
        />
        {errors.mobileNumber && (
          <p className="mt-1 text-sm text-red-400">{errors.mobileNumber}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-dark-100 border border-white/10 text-white px-3 py-2 focus:ring-2 focus:ring-white focus:border-white"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-400">{errors.password}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-dark-100 border border-white/10 text-white px-3 py-2 focus:ring-2 focus:ring-white focus:border-white"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
}