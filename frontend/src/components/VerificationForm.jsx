import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api';

const VerificationForm = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    org_name: user?.org_name || '',
    company_description: '',
    company_category: 'Other',
    website_url: '',
    business_registration_number: '',
    cac_certificate: null,
    policy_text: '',
    data_types_collected: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Fintech', 'E-commerce', 'Social Media', 'Dating', 
    'Healthcare', 'Gaming', 'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, cac_certificate: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });

      const result = await apiClient.submitForVerification(submitData);
      onSuccess?.(result);
    } catch (err) {
      setError(err.message || 'Verification submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Organization Verification</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white text-2xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Organization Name</label>
            <input
              type="text"
              name="org_name"
              value={formData.org_name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">Company Description</label>
            <textarea
              name="company_description"
              value={formData.company_description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary"
              placeholder="Describe your company's business and services"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">Company Category</label>
            <select
              name="company_category"
              value={formData.company_category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary"
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">Website URL</label>
            <input
              type="url"
              name="website_url"
              value={formData.website_url}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary"
              placeholder="https://yourcompany.com"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">Business Registration Number</label>
            <input
              type="text"
              name="business_registration_number"
              value={formData.business_registration_number}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary"
              placeholder="RC123456 or BN123456"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">CAC Certificate</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white hover:file:bg-green-600"
              required
            />
            <p className="text-white/60 text-xs mt-1">Upload PDF, JPG, or PNG (max 10MB)</p>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">Privacy Policy</label>
            <textarea
              name="policy_text"
              value={formData.policy_text}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary"
              placeholder="Enter your organization's privacy policy detailing how you collect, use, and protect user data..."
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">Data Types You Collect</label>
            <textarea
              name="data_types_collected"
              value={formData.data_types_collected}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary"
              placeholder="List the types of data you collect (e.g., email, phone, BVN, NIN, address, etc.) and their purposes..."
              required
            />
            <p className="text-white/60 text-xs mt-1">Be specific about what data you collect and why</p>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
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
              className="flex-1 bg-primary hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit for Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerificationForm;