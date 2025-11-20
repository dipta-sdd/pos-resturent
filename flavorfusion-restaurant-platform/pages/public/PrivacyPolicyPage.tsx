
import React, { useState, ReactNode } from 'react';
import Breadcrumb from '../../components/common/Breadcrumb';
import { ChevronDown } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  isOpen?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpen = false }) => {
  const [isContentOpen, setContentOpen] = useState(isOpen);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <button
        className="w-full flex justify-between items-center py-5 text-left"
        onClick={() => setContentOpen(!isContentOpen)}
        aria-expanded={isContentOpen}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
        <ChevronDown
          className={`w-6 h-6 text-gray-500 transform transition-transform duration-300 ${isContentOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isContentOpen ? 'max-h-screen' : 'max-h-0'}`}
      >
        <div className="pb-5 text-gray-600 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
};


const PrivacyPolicyPage: React.FC = () => {
  const breadcrumbs = [{ name: 'Privacy Policy', path: '/privacy-policy' }];
  const { settings } = useSettings();

  return (
    <div className="bg-gray-100 dark:bg-gray-900">
      <Breadcrumb crumbs={breadcrumbs} />
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-lg shadow-md">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Last Updated: October 26, 2023</p>
          </div>

          <p className="mb-8 text-gray-600 dark:text-gray-300">
            Welcome to {settings.restaurantName}. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services to make a reservation, or place an order. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>
          
          <div className="space-y-2">
            <AccordionItem title="Information We Collect" isOpen={true}>
              <p>We may collect personal identification information from you in a variety of ways, including, but not limited to, when you visit our site, make a reservation, place an order, or subscribe to a newsletter. You may be asked for, as appropriate:</p>
              <ul>
                <li><strong>Personal Data:</strong> Name, email address, mailing address, phone number.</li>
                <li><strong>Financial Data:</strong> Credit card information for processing payments.</li>
                <li><strong>Derivative Data:</strong> Information our servers automatically collect, like your IP address.</li>
              </ul>
            </AccordionItem>
            <AccordionItem title="How We Use Your Data">
              <p>Having accurate information permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:</p>
                <ul>
                    <li>Process your orders and manage your account.</li>
                    <li>Manage reservations and send confirmations.</li>
                    <li>Email you with special offers on other products and services we think you might like.</li>
                    <li>Improve our website and offerings.</li>
                </ul>
            </AccordionItem>
            <AccordionItem title="Data Protection & Security">
              <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
            </AccordionItem>
            <AccordionItem title="Data Sharing">
              <p>We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers for the purposes outlined above.</p>
            </AccordionItem>
            <AccordionItem title="Cookies and Tracking Technologies">
              <p>We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. When you access the Site, your personal information is not collected through the use of tracking technology.</p>
            </AccordionItem>
            <AccordionItem title="Your Rights">
               <p>You have the right to request access to your personal data, request correction of the personal data that we hold about you, and request erasure of your personal data. You also have the right to object to processing of your personal data and request restriction of processing of your personal data.</p>
            </AccordionItem>
            <AccordionItem title="Contact Us">
              <p>If you have questions or comments about this Privacy Policy, please contact us at: {settings.restaurantEmail}</p>
            </AccordionItem>
            <AccordionItem title="Changes to This Policy">
              <p>We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last Updated" date of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates.</p>
            </AccordionItem>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
