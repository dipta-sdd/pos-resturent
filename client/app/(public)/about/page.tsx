'use client';

import React from 'react';
import { ChefHat, Leaf, Users } from 'lucide-react';
import Breadcrumb from '../../../components/common/Breadcrumb';

const AboutPage: React.FC = () => {
    const breadcrumbs = [{ name: 'About Us', path: '/about' }];

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="bg-white dark:bg-gray-900">
                {/* Hero Section */}
                <div className="relative h-80 bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/seed/about/1200/400')" }}>
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <h1 className="text-5xl font-extrabold text-white text-center">Our Story</h1>
                    </div>
                </div>

                <div className="container mx-auto py-16 px-4">
                    {/* Our Mission */}
                    <section className="max-w-4xl mx-auto text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4 dark:text-white">Crafting Culinary Memories</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Founded in 2023, FlavorFleet started with a simple idea: to share the joy of authentic, handcrafted food with our community. We believe that a great meal is more than just food; it&apos;s an experience. It’s about bringing people together, celebrating moments, and creating memories that last a lifetime.
                        </p>
                    </section>

                    {/* Core Values */}
                    <section className="grid md:grid-cols-3 gap-12 mb-20 text-center">
                        <div className="flex flex-col items-center">
                            <div className="bg-orange-100 dark:bg-orange-500/20 p-4 rounded-full mb-4">
                                <Leaf size={32} className="text-orange-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 dark:text-white">Fresh Ingredients</h3>
                            <p className="text-gray-600 dark:text-gray-400">We partner with local farmers and suppliers to source the freshest, highest-quality ingredients for every dish.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-orange-100 dark:bg-orange-500/20 p-4 rounded-full mb-4">
                                <ChefHat size={32} className="text-orange-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 dark:text-white">Passionate Chefs</h3>
                            <p className="text-gray-600 dark:text-gray-400">Our kitchen is led by a team of culinary artists who pour their hearts and expertise into every recipe.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-orange-100 dark:bg-orange-500/20 p-4 rounded-full mb-4">
                                <Users size={32} className="text-orange-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 dark:text-white">Community Focused</h3>
                            <p className="text-gray-600 dark:text-gray-400">We are proud to be a part of this neighborhood and are committed to giving back and supporting local causes.</p>
                        </div>
                    </section>

                    {/* Image Gallery */}
                    <section>
                        <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">A Glimpse Inside</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <img src="https://picsum.photos/seed/gallery1/500/500" alt="Restaurant interior" className="rounded-lg shadow-md aspect-square object-cover" />
                            <img src="https://picsum.photos/seed/gallery2/500/500" alt="Chef preparing food" className="rounded-lg shadow-md aspect-square object-cover" />
                            <img src="https://picsum.photos/seed/gallery3/500/500" alt="A finished dish" className="rounded-lg shadow-md aspect-square object-cover" />
                            <img src="https://picsum.photos/seed/gallery4/500/500" alt="Happy customers dining" className="rounded-lg shadow-md aspect-square object-cover" />
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default AboutPage;
