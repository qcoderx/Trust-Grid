import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import VerificationForm from '../VerificationForm';

const ProfileHeader = () => {
  const { user } = useAuth();
  const [showVerificationForm, setShowVerificationForm] = useState(false);

  const handleVerificationSuccess = () => {
    setShowVerificationForm(false);
    window.location.reload(); // Refresh to show updated status
  };
  
  return (
    <div className="flex p-4 @container mb-8">
      <div className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:items-center">
        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 bg-gradient-to-br from-primary to-green-300 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">
            {user?.org_name ? user.org_name.charAt(0).toUpperCase() : 'O'}
          </span>
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-white text-2xl sm:text-3xl font-bold leading-tight tracking-[-0.015em]">
            {user?.org_name || 'Organization'}
          </p>
          <p className="text-gray-400 text-base font-normal leading-normal">
            Status: <span className={`capitalize ${
              user?.verification_status === 'verified' ? 'text-green-400' :
              user?.verification_status === 'pending' ? 'text-yellow-400' :
              user?.verification_status === 'rejected' ? 'text-red-400' :
              'text-gray-400'
            }`}>
              {user?.verification_status || 'unverified'}
            </span>
          </p>
          {user?.company_category && (
            <p className="text-gray-500 text-sm font-normal leading-normal">
              {user.company_category}
            </p>
          )}
          {user?.verification_status !== 'verified' && (
            <div className="mt-4 p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
              <p className="text-yellow-400 text-sm font-medium mb-2">🔒 Verification Required</p>
              <p className="text-gray-300 text-sm mb-3">
                To access data requests and compliance features, verify your organization with:
              </p>
              <ul className="text-gray-300 text-sm space-y-1 mb-3">
                <li>• Company registration certificate (CAC)</li>
                <li>• Business registration number</li>
                <li>• Company website and description</li>
              </ul>
              <button 
                onClick={() => setShowVerificationForm(true)}
                className="bg-primary hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Start Verification
              </button>
            </div>
          )}
        </div>
      </div>
      
      {showVerificationForm && (
        <VerificationForm
          onClose={() => setShowVerificationForm(false)}
          onSuccess={handleVerificationSuccess}
        />
      )}
    </div>
  );
};

export default ProfileHeader;