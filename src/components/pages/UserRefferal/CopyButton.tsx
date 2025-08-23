import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ 
  text, 
  size = 'md', 
  className = '' 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const sizeClass = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  if (copied) {
    return (
      <div className="flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded text-green-400">
        <Check className={sizeClass} />
        <span className="text-xs font-medium whitespace-nowrap">Text copied</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center justify-center p-1 rounded hover:bg-gray-600/50 transition-colors ${className}`}
      title="Copy to clipboard"
    >
      <Copy className={`${sizeClass} text-gray-400 hover:text-white`} />
    </button>
  );
};