import { useAuth } from '../../context/AuthContext';

const ProfileHeader = () => {
  const { user } = useAuth();
  
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
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;