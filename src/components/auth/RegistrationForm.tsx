import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  countryCode: string;
  mobileNumber: string;
  companyName: string;
  position: string;
  state: string;
  country: string;
}

interface RegistrationFormProps {
  onComplete: (data: FormData) => void;
}

// Country codes data
const countryCodes = [
  { code: '+1', country: 'USA/Canada', maxLength: 10 },
  { code: '+44', country: 'UK', maxLength: 10 },
  { code: '+91', country: 'India', maxLength: 10 },
  { code: '+61', country: 'Australia', maxLength: 9 },
  { code: '+86', country: 'China', maxLength: 11 },
  { code: '+49', country: 'Germany', maxLength: 11 },
  { code: '+33', country: 'France', maxLength: 9 },
  { code: '+81', country: 'Japan', maxLength: 10 },
  // Add more country codes as needed
];

export function RegistrationForm({ onComplete }: RegistrationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    username: '',
    countryCode: '+1',
    mobileNumber: '',
    companyName: '',
    position: '',
    state: '',
    country: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = async () => {
    const newErrors: Partial<FormData> = {};

    // Required fields
    const requiredFields: (keyof FormData)[] = [
      'firstName', 'lastName', 'username', 'mobileNumber',
      'state', 'country'
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    // Mobile number validation based on country code
    const selectedCountry = countryCodes.find(c => c.code === formData.countryCode);
    if (selectedCountry && formData.mobileNumber) {
      const numberRegex = new RegExp(`^\\d{${selectedCountry.maxLength}}$`);
      if (!numberRegex.test(formData.mobileNumber)) {
        newErrors.mobileNumber = `Phone number must be ${selectedCountry.maxLength} digits for ${selectedCountry.country}`;
      }
    }

    // Username validation (alphanumeric and underscores only)
    if (formData.username && !/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
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

      // Store form data in localStorage for later use
      localStorage.setItem('registrationData', JSON.stringify({
        ...formData,
        mobileNumber: `${formData.countryCode}${formData.mobileNumber}`
      }));

      // Trigger Google OAuth
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;

    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ username: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const selectedCountry = countryCodes.find(c => c.code === formData.countryCode);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">First Name *</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-dark-100 border border-white/10 text-white px-3 py-2 focus:ring-2 focus:ring-white focus:border-white"
            required
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Last Name *</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-dark-100 border border-white/10 text-white px-3 py-2 focus:ring-2 focus:ring-white focus:border-white"
            required
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Username *</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-dark-100 border border-white/10 text-white px-3 py-2 focus:ring-2 focus:ring-white focus:border-white"
          required
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-400">{errors.username}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Mobile Number *</label>
        <div className="grid grid-cols-3 gap-2">
          <select
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-dark-100 border border-white/10 text-white px-3 py-2 focus:ring-2 focus:ring-white focus:border-white"
          >
            {countryCodes.map(({ code, country }) => (
              <option key={code} value={code}>
                {code} ({country})
              </option>
            ))}
          </select>
          <div className="col-span-2">
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              maxLength={selectedCountry?.maxLength}
              placeholder={`${selectedCountry?.maxLength} digits`}
              className="mt-1 block w-full rounded-md bg-dark-100 border border-white/10 text-white px-3 py-2 focus:ring-2 focus:ring-white focus:border-white"
              required
            />
          </div>
        </div>
        {errors.mobileNumber && (
          <p className="mt-1 text-sm text-red-400">{errors.mobileNumber}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Company Name</label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-dark-100 border border-white/10 text-white px-3 py-2 focus:ring-2 focus:ring-white focus:border-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Position</label>
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-dark-100 border border-white/10 text-white px-3 py-2 focus:ring-2 focus:ring-white focus:border-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">State *</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-dark-100 border border-white/10 text-white px-3 py-2 focus:ring-2 focus:ring-white focus:border-white"
            required
          />
          {errors.state && (
            <p className="mt-1 text-sm text-red-400">{errors.state}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Country *</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-dark-100 border border-white/10 text-white px-3 py-2 focus:ring-2 focus:ring-white focus:border-white"
            required
          />
          {errors.country && (
            <p className="mt-1 text-sm text-red-400">{errors.country}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Connecting to Google...
          </>
        ) : (
          'Continue with Google'
        )}
      </button>
    </form>
  );
}