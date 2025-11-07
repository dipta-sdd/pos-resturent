
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbCrumb {
  name: string;
  path: string;
}

interface BreadcrumbProps {
  crumbs: BreadcrumbCrumb[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ crumbs }) => {
  const allCrumbs = [{ name: 'Home', path: '/' }, ...crumbs];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <nav aria-label="breadcrumb" className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ol className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
            {allCrumbs.map((crumb, index) => {
            const isLast = index === allCrumbs.length - 1;
            return (
                <li key={index} className="flex items-center">
                {index > 0 && <ChevronRight size={16} className="mx-1 text-gray-400" />}
                {isLast ? (
                    <span className="font-semibold text-gray-700 dark:text-white">{crumb.name}</span>
                ) : (
                    <Link to={crumb.path} className="hover:text-orange-500 transition-colors flex items-center gap-1.5">
                      {crumb.name === 'Home' && <Home size={14} />}
                      {crumb.name}
                    </Link>
                )}
                </li>
            );
            })}
        </ol>
        </nav>
    </div>
  );
};

export default Breadcrumb;
