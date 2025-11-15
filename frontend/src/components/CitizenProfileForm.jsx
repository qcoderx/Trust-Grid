import { useState, useEffect } from 'react';

const CitizenProfileForm = ({ userId, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    country: 'Nigeria',
    postal_code: '',
    bvn: '',
    nin: '',
    passport_number: '',
    drivers_license: '',
    voters_card: '',
    bank_account_number: '',
    bank_name: '',
    occupation: '',
    employer: '',
    monthly_income: '',
    blood_type: '',
    medical_conditions: '',
    emergency_contact: '',
    marital_status: '',
    education_level: '',
    social_media_handles: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load existing profile data
    const loadProfile = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/citizen/${userId}/profile`);
        if (response.ok) {
          const userData = await response.json();
          setFormData(prev => ({ ...prev, ...userData }));
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };
    
    if (userId) loadProfile();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/citizen/${userId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        onSave?.(updatedUser);
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    {
      title: 'Personal Information',
      fields: [
        { name: 'first_name', label: 'First Name', type: 'text' },
        { name: 'last_name', label: 'Last Name', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'phone_number', label: 'Phone Number', type: 'tel' },
        { name: 'date_of_birth', label: 'Date of Birth', type: 'date' },
        { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] }
      ]
    },
    {
      title: 'Address Information',
      fields: [
        { name: 'address', label: 'Address', type: 'textarea' },
        { name: 'city', label: 'City', type: 'text' },
        { name: 'state', label: 'State', type: 'text' },
        { name: 'country', label: 'Country', type: 'text' },
        { name: 'postal_code', label: 'Postal Code', type: 'text' }
      ]
    },
    {
      title: 'Identity Documents',
      fields: [
        { name: 'bvn', label: 'BVN', type: 'text' },
        { name: 'nin', label: 'NIN', type: 'text' },
        { name: 'passport_number', label: 'Passport Number', type: 'text' },
        { name: 'drivers_license', label: 'Driver\'s License', type: 'text' },
        { name: 'voters_card', label: 'Voter\'s Card', type: 'text' }
      ]
    },
    {
      title: 'Financial Information',
      fields: [
        { name: 'bank_account_number', label: 'Bank Account Number', type: 'text' },
        { name: 'bank_name', label: 'Bank Name', type: 'text' }
      ]
    },
    {
      title: 'Employment Information',
      fields: [
        { name: 'occupation', label: 'Occupation', type: 'text' },
        { name: 'employer', label: 'Employer', type: 'text' },
        { name: 'monthly_income', label: 'Monthly Income', type: 'text' }
      ]
    },
    {
      title: 'Health Information',
      fields: [
        { name: 'blood_type', label: 'Blood Type', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
        { name: 'medical_conditions', label: 'Medical Conditions', type: 'textarea' },
        { name: 'emergency_contact', label: 'Emergency Contact', type: 'text' }
      ]
    },
    {
      title: 'Social Information',
      fields: [
        { name: 'marital_status', label: 'Marital Status', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed'] },
        { name: 'education_level', label: 'Education Level', type: 'text' },
        { name: 'social_media_handles', label: 'Social Media Handles', type: 'textarea' }
      ]
    },
    {
      title: 'Privacy Preferences',
      fields: [
        { name: 'manual_approval_required', label: 'Require Manual Approval', type: 'checkbox', description: 'When enabled, you will need to manually approve each data request. When disabled, requests that pass AI compliance checks will be auto-approved.' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white">Complete Your Profile</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white text-2xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6 space-y-8">
            {sections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">{section.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.fields.map((field) => (
                    <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                      <label className="block text-sm font-medium text-white mb-1">
                        {field.label}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">Select {field.label}</option>
                          {field.options.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      ) : field.type === 'checkbox' ? (
                        <div className="space-y-2">
                          <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              name={field.name}
                              checked={formData[field.name] || false}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-green-500 bg-white/10 border-white/20 rounded focus:ring-green-500 focus:ring-2"
                            />
                            <span className="text-white">{field.label}</span>
                          </label>
                          {field.description && (
                            <p className="text-sm text-white/60 ml-7">{field.description}</p>
                          )}
                        </div>
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="mx-6 mb-4 p-3 bg-red-400/10 border border-red-400/20 rounded-lg text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-4 p-6 border-t border-white/20 bg-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CitizenProfileForm;