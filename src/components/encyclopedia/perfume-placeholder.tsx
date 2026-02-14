import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface PerfumePlaceholderProps {
  name: string;
  brand: string;
  family?: string; // e.g. "Woody Aromatic", "Floral", etc.
  className?: string;
}

const getGradient = (family: string = ''): string => {
  const lower = family.toLowerCase();

  if (lower.includes('citrus') || lower.includes('fresh')) return 'from-yellow-400 via-orange-300 to-yellow-200';
  if (lower.includes('floral') || lower.includes('rose')) return 'from-pink-400 via-rose-300 to-pink-200';
  if (lower.includes('wood') || lower.includes('chypre')) return 'from-amber-700 via-orange-900 to-amber-800';
  if (lower.includes('amber') || lower.includes('oriental')) return 'from-orange-500 via-amber-600 to-yellow-600';
  if (lower.includes('aquatic') || lower.includes('marine') || lower.includes('blue')) return 'from-blue-400 via-cyan-300 to-blue-200';
  if (lower.includes('green') || lower.includes('herbal') || lower.includes('aromatic')) return 'from-green-500 via-emerald-400 to-green-300';
  if (lower.includes('fruity') || lower.includes('berry')) return 'from-red-400 via-pink-400 to-orange-300';
  if (lower.includes('spicy')) return 'from-red-600 via-orange-700 to-red-500';
  if (lower.includes('gourmand') || lower.includes('sweet') || lower.includes('vanilla')) return 'from-amber-200 via-yellow-400 to-orange-200';
  if (lower.includes('leather') || lower.includes('smoke')) return 'from-slate-700 via-gray-800 to-slate-900';
  if (lower.includes('musk') || lower.includes('powdery')) return 'from-slate-200 via-gray-300 to-white';

  // Default gradient
  return 'from-slate-400 via-slate-300 to-slate-200';
};

const getTextColor = (family: string = ''): string => {
   const lower = family.toLowerCase();
   // Dark backgrounds need light text
   if (lower.includes('wood') || lower.includes('leather') || lower.includes('spicy') || lower.includes('amber')) {
     return 'text-white/90';
   }
   // Light backgrounds need dark text
   return 'text-slate-900/80';
}

export function PerfumePlaceholder({ name, brand, family, className }: PerfumePlaceholderProps) {
  const gradient = getGradient(family);
  const textColor = getTextColor(family);
  const initials = name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={cn("w-full h-full relative overflow-hidden flex flex-col items-center justify-center p-6 text-center select-none", className)}>
       {/* Background */}
       <div className={cn("absolute inset-0 bg-gradient-to-br transition-all duration-500", gradient)} />

       {/* Texture Overlay (noise or pattern) */}
       <div className="absolute inset-0 opacity-20 mix-blend-overlay"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
       />

       {/* Content */}
       <div className={cn("relative z-10 flex flex-col items-center gap-2", textColor)}>
          <div className="text-5xl font-bold tracking-tighter opacity-40 mix-blend-multiply filter blur-[1px]">
             {initials}
          </div>
          <div className="mt-2 flex flex-col items-center">
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 mb-1 line-clamp-1 max-w-[120px]">{brand}</span>
             <h3 className="text-lg font-serif leading-tight font-medium line-clamp-2 max-w-[180px]">
               {name}
             </h3>
          </div>
       </div>

       {/* Accent Icon */}
       <div className="absolute bottom-3 right-3 opacity-20">
          <Sparkles className={cn("w-6 h-6", textColor)} />
       </div>
    </div>
  );
}
