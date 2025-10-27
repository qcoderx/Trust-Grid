const ProfileHeader = () => {
    return (
      <div className="flex p-4 @container mb-8">
        <div className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:items-center">
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 bg-gradient-to-br from-primary to-green-300"></div>
          <div className="flex flex-col justify-center">
            <p className="text-white text-2xl sm:text-3xl font-bold leading-tight tracking-[-0.015em]">Developer Name</p>
            <p className="text-gray-400 text-base font-normal leading-normal">developer.name@email.com</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default ProfileHeader;