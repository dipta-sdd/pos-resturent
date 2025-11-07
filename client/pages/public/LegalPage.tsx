
import React from 'react';
import Breadcrumb from '../../components/common/Breadcrumb';

const LegalPage: React.FC = () => {
  const breadcrumbs = [{ name: 'Legal', path: '/legal' }];
  return (
    <>
      <Breadcrumb crumbs={breadcrumbs} />
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-10">Legal Information</h1>
        
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Terms of Service Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Terms of Service</h2>
            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
              <p>Welcome to FlavorFleet! These terms and conditions outline the rules and regulations for the use of FlavorFleet's Website, located at flavorfleet.com.</p>
              <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use FlavorFleet if you do not agree to take all of the terms and conditions stated on this page.</p>
              <h3 className="dark:text-white">Cookies</h3>
              <p>We employ the use of cookies. By accessing FlavorFleet, you agreed to use cookies in agreement with the FlavorFleet's Privacy Policy.</p>
              <h3 className="dark:text-white">License</h3>
              <p>Unless otherwise stated, FlavorFleet and/or its licensors own the intellectual property rights for all material on FlavorFleet. All intellectual property rights are reserved. You may access this from FlavorFleet for your own personal use subjected to restrictions set in these terms and conditions.</p>
              <p>You must not:
                <ul>
                  <li>Republish material from FlavorFleet</li>
                  <li>Sell, rent or sub-license material from FlavorFleet</li>
                  <li>Reproduce, duplicate or copy material from FlavorFleet</li>
                  <li>Redistribute content from FlavorFleet</li>
                </ul>
              </p>
            </div>
          </section>

          {/* Privacy Policy Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Privacy Policy</h2>
            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
              <p>Your privacy is important to us. It is FlavorFleet's policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.</p>
              <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>
              <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</p>
              <p>We don’t share any personally identifying information publicly or with third-parties, except when required to by law.</p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default LegalPage;
