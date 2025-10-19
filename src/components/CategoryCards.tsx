'use client';

import Link from "next/link";

interface Category {
  name: string;
  icon: string;
  count: number;
  description: string;
}

interface CategoryCardsProps {
  categories: Category[];
}

export default function CategoryCards({ categories }: CategoryCardsProps) {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-5">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Popular Categories
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow group"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center text-2xl group-hover:bg-blue-50 transition-colors">
                {category.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{category.description}</p>
              <div className="text-lg font-bold text-gray-900">{category.count}</div>
              <div className="text-xs text-gray-500">servers</div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link 
            href="/categories" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            View All Categories
            <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
