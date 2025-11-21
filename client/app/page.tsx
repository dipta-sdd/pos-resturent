'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { UtensilsCrossed, Truck, Users, Star, Quote, ChevronLeft, ChevronRight, MapPin, Phone, Clock, Plus } from 'lucide-react';
import { MenuItem, ItemVariant } from '../types';
import { api } from '../services/api';
import { useSettings } from '../contexts/SettingsContext';
import { useCart } from '../contexts/CartContext';
import VariantSelectionModal from '../components/common/VariantSelectionModal';

const slides = [
  {
    imageUrl: 'https://picsum.photos/seed/indian-food/1920/1080',
    title: 'Experience Authentic Flavors',
    subtitle: 'A culinary journey through India, where every dish tells a story.',
  },
  {
    imageUrl: 'https://picsum.photos/seed/spices/1920/1080',
    title: 'Crafted with the Freshest Spices',
    subtitle: 'Our chefs use time-honored recipes and the finest ingredients.',
  },
  {
    imageUrl: 'https://picsum.photos/seed/dining/1920/1080',
    title: 'An Unforgettable Dining Experience',
    subtitle: 'Elegant ambiance and impeccable service for any occasion.',
  },
];

const MenuItemCard: React.FC<{ item: MenuItem; onAddToCartClick: (item: MenuItem) => void }> = ({ item, onAddToCartClick }) => {
  const { settings } = useSettings();
  const variant = item.variants?.[0];
  if (!variant) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
      <Link href={`/menu/${item.id}`} className="relative overflow-hidden block">
        <img src={item.image_url} alt={item.name} className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <span className="absolute bottom-4 left-4 text-xl font-serif font-bold text-white tracking-wider">{item.name}</span>
        <span className="absolute top-4 right-4 text-lg font-bold text-white bg-orange-500 rounded-full px-3 py-1">{settings.currencySymbol}{variant.price.toFixed(2)}</span>
      </Link>
      <div className="p-5">
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm h-10 overflow-hidden">{item.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <Link href={`/menu/${item.id}`} className="font-semibold text-orange-500 hover:text-orange-600 transition-colors">
            View Details &rarr;
          </Link>
          <button
            onClick={() => onAddToCartClick(item)}
            className="bg-orange-100 text-orange-600 rounded-full w-10 h-10 flex items-center justify-center hover:bg-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:hover:bg-orange-900/60 transition-colors"
            aria-label={`Add ${item.name} to cart`}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const TestimonialCard: React.FC<{ quote: string; author: string; }> = ({ quote, author }) => (
  <div className="bg-white dark:bg-gray-800 p-8 rounded-lg text-center relative border border-gray-200 dark:border-gray-700">
    <Quote className="absolute top-4 left-4 h-10 w-10 text-gray-200 dark:text-gray-700 transform -scale-x-100" />
    <div className="flex justify-center mb-4 text-yellow-400">
      {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" />)}
    </div>
    <p className="text-gray-600 dark:text-gray-300 italic mb-6">"{quote}"</p>
    <p className="font-semibold text-gray-800 dark:text-white">- {author}</p>
  </div>
);

const HomePage: React.FC = () => {
  const { settings } = useSettings();
  const { addItem } = useCart();
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [variantModalItem, setVariantModalItem] = useState<MenuItem | null>(null);

  const handleAddToCartClick = (item: MenuItem) => {
    if (item.variants.length > 1) {
      setVariantModalItem(item);
    } else if (item.variants.length === 1) {
      addItem(item, item.variants[0], 1, []);
    }
  };

  const handleVariantSelected = (variant: ItemVariant) => {
    if (variantModalItem) {
      addItem(variantModalItem, variant, 1, []);
    }
    setVariantModalItem(null);
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const fetchItems = async () => {
      const items = await api.getMenuItems();
      const sortedItems = items.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
      setFeaturedItems(sortedItems.slice(0, 8));
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [nextSlide]);

  const addressParts = settings.restaurantAddress.split(',');
  const addressLine1 = addressParts[0];
  const addressLine2 = addressParts.slice(1).join(',').trim();

  const workingHoursOrder = ['Mon - Thu', 'Fri - Sat', 'Sunday'];


  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {variantModalItem && (
        <VariantSelectionModal
          item={variantModalItem}
          onClose={() => setVariantModalItem(null)}
          onAddToCart={handleVariantSelected}
        />
      )}
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Image Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
          />
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white z-10 p-4 pb-20 px-8 sm:px-16">
          <div className="relative h-48 w-full max-w-4xl flex items-center justify-center overflow-hidden">
            {slides.map((slide, index) => (
              <div key={index} className={`absolute inset-0 transition-all duration-1000 ease-in-out flex flex-col items-center justify-center ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold leading-tight mb-4 tracking-wider">
                  {slide.title}
                </h1>
                <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-200">
                  {slide.subtitle}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/reserve" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full text-lg transition-transform transform hover:scale-105 shadow-lg">
              Book a Table
            </Link>
            <Link href="/menu" className="bg-transparent border-2 border-white text-white font-bold py-4 px-10 rounded-full text-lg transition-transform transform hover:scale-105 hover:bg-white hover:text-black">
              Order Online
            </Link>
          </div>
        </div>

        {/* Slider Controls */}
        <button onClick={prevSlide} className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20 p-3 bg-black/30 rounded-full text-white hover:bg-black/50 transition-colors" aria-label="Previous slide">
          <ChevronLeft size={32} />
        </button>
        <button onClick={nextSlide} className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20 p-3 bg-black/30 rounded-full text-white hover:bg-black/50 transition-colors" aria-label="Next slide">
          <ChevronRight size={32} />
        </button>

        {/* Slider Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50 hover:bg-white'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-24 bg-zinc-100 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-16">
            Whether you want to dine with us, order delivery, or host an event, we have the perfect option
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Dine In Card */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg transition-shadow hover:shadow-xl">
              <UtensilsCrossed className="h-10 w-10 text-red-600 mb-6" strokeWidth={1.5} />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Dine In</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Experience our beautifully designed dining space with attentive service</p>
              <Link href="/reserve" className="font-semibold text-red-600 hover:text-red-700 transition-colors">
                Book Table →
              </Link>
            </div>

            {/* Delivery Card */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg transition-shadow hover:shadow-xl">
              <Truck className="h-10 w-10 text-red-600 mb-6" strokeWidth={1.5} />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Delivery</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Fresh meals delivered to your door. Order online and enjoy at home</p>
              <Link href="/menu" className="font-semibold text-red-600 hover:text-red-700 transition-colors">
                Order Now →
              </Link>
            </div>

            {/* Catering Card */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg transition-shadow hover:shadow-xl">
              <Users className="h-10 w-10 text-red-600 mb-6" strokeWidth={1.5} />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Catering</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Perfect for events and gatherings. Customizable menus available</p>
              <Link href="/contact" className="font-semibold text-red-600 hover:text-red-700 transition-colors">
                Inquire →
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* About & Stats Section */}
      <section className="py-24 bg-white dark:bg-gray-800 relative">
        <div className="w-full h-[10vw]">
          <div className="custom-shape-divider-top-1762513684">
            <svg className="text-zinc-100 dark:text-gray-900" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="currentColor">
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor" className="shape-fill"></path>
              <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor" className="shape-fill"></path>
              <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor" className="shape-fill"></path>
            </svg>
          </div>
        </div>
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <img src="https://picsum.photos/seed/indian-chef/600/700" alt="Chef preparing a dish" className="rounded-lg shadow-2xl object-cover w-full h-full" />
          </div>
          <div>
            <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-6">A Story of Passion & Spice</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              {settings.restaurantName} is more than a restaurant; it's a celebration of India's rich culinary heritage. We are committed to providing an exceptional experience, combining traditional recipes with modern innovation.
            </p>
            <div className="grid grid-cols-2 gap-8 text-center">
              <div>
                <p className="text-5xl font-bold text-orange-500">20+</p>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Years of Experience</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-orange-500">100k+</p>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Happy Guests Served</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-orange-500">4.9<span className="text-3xl text-yellow-400">&#9733;</span></p>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Average Rating</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-orange-500">100%</p>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Authentic Spices</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-24 bg-zinc-100 dark:bg-gray-900 relative">
        <div className="w-full h-[10vw]">
          <div className="custom-shape-divider-top-1762513684">
            <svg className="text-white dark:text-gray-800" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="currentColor">
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor" className="shape-fill"></path>
              <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor" className="shape-fill"></path>
              <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor" className="shape-fill"></path>
            </svg>
          </div>
        </div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">Chef's Specials</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Discover a selection of our most beloved creations, each telling a story of flavor and finesse.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {featuredItems.map(item => <MenuItemCard key={item.id} item={item} onAddToCartClick={handleAddToCartClick} />)}
          </div>
          <div className="text-center mt-16">
            <Link href="/menu" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full text-lg transition-transform transform hover:scale-105 shadow-lg">
              Explore The Full Menu
            </Link>
          </div>
        </div>

      </section>

      {/* Photo Gallery Section */}
      <section className="py-24 bg-white dark:bg-gray-800 relative">
        <div className="w-full h-[10vw]">
          <div className="custom-shape-divider-top-1762513684">
            <svg className="text-zinc-100 dark:text-gray-900" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="currentColor">
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor" className="shape-fill"></path>
              <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor" className="shape-fill"></path>
              <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor" className="shape-fill"></path>
            </svg>
          </div>
        </div>
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-center text-gray-900 dark:text-white mb-16">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <img src="https://picsum.photos/seed/indian-gallery1/500/500" alt="Indian dish 1" className="rounded-lg shadow-md aspect-square object-cover hover:scale-105 transition-transform duration-300" />
            <img src="https://picsum.photos/seed/indian-gallery2/500/500" alt="Indian restaurant interior" className="rounded-lg shadow-md aspect-square object-cover hover:scale-105 transition-transform duration-300" />
            <img src="https://picsum.photos/seed/indian-gallery3/500/500" alt="Indian dish 2" className="rounded-lg shadow-md aspect-square object-cover hover:scale-105 transition-transform duration-300" />
            <img src="https://picsum.photos/seed/indian-gallery4/500/500" alt="Indian spices" className="rounded-lg shadow-md aspect-square object-cover hover:scale-105 transition-transform duration-300" />
            <img src="https://picsum.photos/seed/indian-gallery5/500/500" alt="Indian dish 3" className="rounded-lg shadow-md aspect-square object-cover hover:scale-105 transition-transform duration-300" />
            <img src="https://picsum.photos/seed/indian-gallery6/500/500" alt="Close-up of a meal" className="rounded-lg shadow-md aspect-square object-cover hover:scale-105 transition-transform duration-300" />
            <img src="https://picsum.photos/seed/indian-gallery7/500/500" alt="Tandoor oven" className="rounded-lg shadow-md aspect-square object-cover hover:scale-105 transition-transform duration-300" />
            <img src="https://picsum.photos/seed/indian-gallery8/500/500" alt="Dining table setup" className="rounded-lg shadow-md aspect-square object-cover hover:scale-105 transition-transform duration-300" />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-zinc-100 dark:bg-gray-900 relative">
        <div className="w-full h-[10vw]">
          <div className="custom-shape-divider-top-1762513684">
            <svg className="text-white dark:text-gray-800" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="currentColor">
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor" className="shape-fill"></path>
              <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor" className="shape-fill"></path>
              <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor" className="shape-fill"></path>
            </svg>
          </div>
        </div>
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-center text-gray-900 dark:text-white mb-16">What Our Guests Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="The best butter chicken I've ever had! The spices were perfectly balanced, and the service was impeccable."
              author="Priya Sharma"
            />
            <TestimonialCard
              quote="A true taste of India. The ambiance felt so authentic, and every dish was a delight. We will be coming back soon!"
              author="Rohan Mehta"
            />
            <TestimonialCard
              quote="We ordered delivery for a family dinner, and it was a huge hit! The food was hot, fresh, and absolutely delicious."
              author="Anjali Gupta"
            />
          </div>
        </div>
      </section>

      {/* Reservation Section */}
      <section
        className="relative py-24 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('https://picsum.photos/seed/indian-restaurant-bg/1920/1080')" }}
      >

        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif font-bold text-white mb-4">Book Your Table</h2>
          <p className="text-lg text-gray-200 mb-10 max-w-2xl mx-auto">Book your table for an unforgettable dining experience. We look forward to welcoming you.</p>
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl">
            <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="text-left"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label><input type="text" placeholder="John Doe" className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded-md" /></div>
              <div className="text-left"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label><input type="date" className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded-md" /></div>
              <div className="text-left"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label><input type="time" className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded-md" /></div>
              <div className="text-left"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Party Size</label><input type="number" placeholder="2" min="1" className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded-md" /></div>
              <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 rounded-md hover:bg-orange-600 transition-colors h-full">Find a Table</button>
            </form>
          </div>
        </div>
      </section>

      {/* Contact & Location Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-center text-gray-900 dark:text-white mb-16">Contact & Location</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            {/* Contact Info */}
            <div className="space-y-10">
              <div className="flex items-start gap-5">
                <MapPin className="text-orange-600 h-7 w-7 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Address</h3>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">{addressLine1}</p>
                  <p className="text-gray-700 dark:text-gray-300">{addressLine2}</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <Phone className="text-orange-600 h-7 w-7 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Phone</h3>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">{settings.restaurantPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <Clock className="text-orange-600 h-7 w-7 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Hours</h3>
                  <div className="mt-1 space-y-1">
                    {workingHoursOrder.map(days => (
                      settings.workingHours[days] && <p key={days} className="text-gray-700 dark:text-gray-300">{days}: {settings.workingHours[days]}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Map */}
            <div>
              <iframe
                className="w-full h-96 rounded-lg shadow-lg border dark:border-gray-700"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.333039641491!2d-74.00923568459505!3d40.71077367933211!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a1e27a61dc1%3A0x1d6911142da5a41c!2sNew%20York%20City%20Hall!5e0!3m2!1sen!2sus!4v1622559771691!5m2!1sen!2sus"
                allowFullScreen
                loading="lazy"
                title="Restaurant Location"
              ></iframe>
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-orange-700 text-white p-10 rounded-lg shadow-xl max-w-4xl mx-auto">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-2">Subscribe to Our Newsletter</h3>
              <p className="mb-6 opacity-90">Get exclusive offers, new menu items, and special events delivered to your inbox.</p>
            </div>
            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full flex-grow px-4 py-3 rounded-md text-gray-800 bg-white border-transparent focus:ring-2 focus:ring-rose-400 focus:outline-none"
                required
                aria-label="Email for newsletter"
              />
              <button type="submit" className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-8 rounded-md transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
