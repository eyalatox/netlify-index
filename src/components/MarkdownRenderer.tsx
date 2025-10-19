'use client';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Enhanced markdown parser
  const parseMarkdown = (text: string): string => {
    let html = text;
    
    // Remove images and badges (they clutter the view)
    html = html.replace(/!\[.*?\]\(.*?\)/gim, '');
    
    // Code blocks (must be before inline code)
    html = html.replace(/```([a-z]*)\n([\s\S]*?)```/gim, (match, lang, code) => {
      return `<pre class="bg-gray-900 text-gray-100 px-4 py-3 rounded-lg overflow-x-auto my-4 text-sm border border-gray-700"><code>${code.trim()}</code></pre>`;
    });
    
    // Headers with better styling
    html = html.replace(/^#### (.*$)/gim, '<h4 class="text-base font-semibold text-gray-900 mt-4 mb-2">$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b border-gray-200">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-300">$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong class="font-semibold text-gray-900">$1</strong>');
    
    // Italic (be more careful to not match list items)
    html = html.replace(/(?<!\*)\*([^\*\n]+)\*(?!\*)/g, '<em class="italic">$1</em>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono whitespace-nowrap">$1</code>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 py-2 my-4 text-gray-600 italic">$1</blockquote>');
    
    // Horizontal rules
    html = html.replace(/^---$/gim, '<hr class="my-6 border-t border-gray-200" />');
    
    // Split into blocks by double newlines
    const blocks = html.split(/\n\n+/);
    const processed = [];
    
    for (let block of blocks) {
      block = block.trim();
      if (!block) continue;
      
      // Skip if already a block element
      if (block.match(/^<(h[1-6]|pre|ul|ol|hr|blockquote|div)/)) {
        processed.push(block);
        continue;
      }
      
      // Check if this is a list block
      const lines = block.split('\n');
      const listLines = [];
      const regularLines = [];
      
      for (const line of lines) {
        if (line.match(/^[\*\-] /)) {
          listLines.push(line.replace(/^[\*\-] /, '<li class="ml-5 mb-1">') + '</li>');
        } else if (line.match(/^\d+\. /)) {
          listLines.push(line.replace(/^\d+\. /, '<li class="ml-5 mb-1">') + '</li>');
        } else {
          regularLines.push(line);
        }
      }
      
      if (listLines.length > 0) {
        processed.push(`<ul class="list-disc list-outside my-3 text-gray-700 space-y-1">${listLines.join('')}</ul>`);
      }
      if (regularLines.length > 0) {
        const content = regularLines.join('<br />');
        if (content.trim()) {
          processed.push(`<p class="text-gray-700 leading-relaxed mb-3">${content}</p>`);
        }
      }
    }
    
    return processed.join('\n');
  };

  return (
    <div 
      className="readme-content text-base"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
}

