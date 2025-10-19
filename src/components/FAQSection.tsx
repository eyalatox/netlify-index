'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is MCP?",
    answer: "Model Context Protocol (MCP) is a standardized way for AI applications to connect to external data sources and tools, enabling seamless integration and enhanced capabilities."
  },
  {
    question: "Is MCP well maintained?",
    answer: "We found that MCP demonstrated a healthy version release cadence and project activity because the last version was released recently. It has multiple open source maintainers collaborating on the project."
  },
  {
    question: "How do I install MCP packages?",
    answer: "You can install MCP packages using npm, pip, or other package managers depending on the package type. Each package page includes specific installation instructions."
  },
  {
    question: "Are MCP packages secure?",
    answer: "We provide security scores for each package based on supply chain security, vulnerability assessment, code quality, and maintenance activity. Always review these scores before installation."
  },
  {
    question: "How can I contribute to MCP?",
    answer: "You can contribute by creating new packages, improving existing ones, or contributing to the core MCP specification. Check our documentation for detailed contribution guidelines."
  }
];

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-5">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900">{item.question}</h3>
                {openItems.has(index) ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              {openItems.has(index) && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Package last updated on {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
