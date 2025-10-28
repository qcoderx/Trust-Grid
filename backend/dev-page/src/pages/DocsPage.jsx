// pages/DocsPage.jsx
import DocsSidebar from '../components/docs/DocsSidebar';
import DocsContent from '../components/docs/DocsContent';

const DocsPage = () => {
  return (
    <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark">
      <DocsSidebar />
      <DocsContent />
    </div>
  );
};

export default DocsPage;