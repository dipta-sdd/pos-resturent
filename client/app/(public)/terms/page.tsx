'use client';

import React, { useState, ReactNode } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import { useSettings } from '@/contexts/SettingsContext';
import { ChevronDown } from 'lucide-react';

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


const TermsOfServicePage: React.FC = () => {
    const breadcrumbs = [{ name: 'Terms of Service', path: '/terms' }];
    const { settings } = useSettings();

    return (
        <div className="bg-gray-100 dark:bg-gray-900">
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="container mx-auto py-16 px-4">
                <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-lg shadow-md">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Terms and Conditions</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Last updated: October 26, 2023</p>
                    </div>

                    <p className="mb-8 text-gray-600 dark:text-gray-300">
                        Welcome to {settings.restaurantName}. These terms and conditions outline the rules and regulations for the use of our website and services. By accessing this website, we assume you accept these terms and conditions. Do not continue to use our services if you do not agree to all of the terms and conditions stated on this page.
                    </p>

                    <div className="space-y-2">
                        <AccordionItem title="1. Introduction" isOpen={true}>
                            <p>Welcome to {settings.restaurantName}. These terms and conditions outline the rules and regulations for the use of our website and services. By accessing this website, we assume you accept these terms and conditions. Do not continue to use our services if you do not agree to all of the terms and conditions stated on this page.</p>
                        </AccordionItem>
                        <AccordionItem title="2. User Obligations">
                            <p>You are responsible for your account and any activity on it. You must provide accurate information when creating an account and keep it updated. By using our services, you agree to the following:</p>
                            <ul>
                                <li>You must be at least 18 years old to use our services.</li>
                                <li>You are not allowed to share your account credentials with anyone else.</li>
                                <li>You must not use our service for any illegal or unauthorized purpose.</li>
                            </ul>
                        </AccordionItem>
                        <AccordionItem title="3. Privacy Policy Summary">
                            <p>Our Privacy Policy, which is incorporated into these Terms and Conditions, describes how we collect, use, and protect your personal information. Please review our full Privacy Policy for detailed information on our practices. Your use of our services constitutes your agreement to the Privacy Policy.</p>
                        </AccordionItem>
                        <AccordionItem title="4. Limitation of Liability">
                            <p>In no event shall {settings.restaurantName}, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this website. {settings.restaurantName} shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this website.</p>
                        </AccordionItem>
                        <AccordionItem title="5. Governing Law">
                            <p>These Terms will be governed by and interpreted in accordance with the laws of the State, and you submit to the non-exclusive jurisdiction of the state and federal courts located in the State for the resolution of any disputes.</p>
                        </AccordionItem>
                        <AccordionItem title="6. Contact Information">
                            <p>If you have any questions about these Terms, please contact us at: <a href={`mailto:${settings.restaurantEmail}`}>{settings.restaurantEmail}</a>.</p>
                        </AccordionItem>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfServicePage;
