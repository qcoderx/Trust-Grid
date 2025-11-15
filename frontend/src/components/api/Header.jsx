
const Header = () => {
    return (
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-800 px-4 sm:px-10 py-3">
        {/* Logo */}
        <div className="flex items-center gap-4 text-white">
          <div className="size-6 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">TrustGrid for Developers</h2>
        </div>
  
        {/* Navigation */}
        <div className="flex flex-1 items-center justify-end gap-4 sm:gap-8">
          <div className="hidden items-center gap-9 md:flex">
            <a className="text-gray-300 hover:text-primary text-sm font-medium leading-normal" href="/docs">API Reference</a>
            <a className="text-gray-300 hover:text-primary text-sm font-medium leading-normal" href="#">Guides</a>
            <a className="text-gray-300 hover:text-primary text-sm font-medium leading-normal" href="#">SDKs</a>
            <a className="text-gray-300 hover:text-primary text-sm font-medium leading-normal" href="#">Changelog</a>
          </div>
          
          <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-gray-900 text-gray-300 hover:text-primary gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0">
            <span className="material-symbols-outlined text-xl">notifications</span>
          </button>
          
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary bg-gradient-to-br from-primary to-green-300"></div>
        </div>
      </header>
    );
  };
  
  export default Header;