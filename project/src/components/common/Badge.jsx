import React from 'react';
import { Trophy, Star, Target, Award, Crown, Zap } from 'lucide-react';

const Badge = ({ name, description, earned, type = 'default', size = 'md' }) => {
  const getBadgeIcon = (name) => {
    const iconName = name.toLowerCase();
    if (iconName.includes('first') || iconName.includes('timer')) return <Star className="w-full h-full" />;
    if (iconName.includes('weekly') || iconName.includes('warrior')) return <Target className="w-full h-full" />;
    if (iconName.includes('regular') || iconName.includes('player')) return <Trophy className="w-full h-full" />;
    if (iconName.includes('sports') || iconName.includes('enthusiast')) return <Zap className="w-full h-full" />;
    if (iconName.includes('spender') || iconName.includes('big')) return <Crown className="w-full h-full" />;
    if (iconName.includes('monthly') || iconName.includes('champion')) return <Award className="w-full h-full" />;
    if (iconName.includes('business') || iconName.includes('entrepreneur')) return <Target className="w-full h-full" />;
    if (iconName.includes('popular') || iconName.includes('venue')) return <Star className="w-full h-full" />;
    if (iconName.includes('revenue') || iconName.includes('milestone')) return <Crown className="w-full h-full" />;
    return <Trophy className="w-full h-full" />;
  };

  const getBadgeColor = (type, earned) => {
    if (!earned) return 'text-gray-400 bg-gray-100 border-gray-200';
    
    switch (type) {
      case 'bronze': return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'silver': return 'text-gray-700 bg-gray-100 border-gray-300';
      case 'gold': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'platinum': return 'text-purple-700 bg-purple-100 border-purple-300';
      default: return 'text-blue-700 bg-blue-100 border-blue-300';
    }
  };

  const getGlowEffect = (type, earned) => {
    if (!earned) return '';
    
    switch (type) {
      case 'bronze': return 'shadow-orange-200 shadow-lg';
      case 'silver': return 'shadow-gray-200 shadow-lg';
      case 'gold': return 'shadow-yellow-200 shadow-lg';
      case 'platinum': return 'shadow-purple-200 shadow-lg';
      default: return 'shadow-blue-200 shadow-lg';
    }
  };

  const sizeClasses = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-20 h-20 text-base'
  };

  return (
    <div className={`
      relative inline-flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300
      ${getBadgeColor(type, earned)}
      ${getGlowEffect(type, earned)}
      ${earned ? 'transform hover:scale-105' : 'opacity-60'}
    `}>
      {/* Badge Icon */}
      <div className={`
        ${sizeClasses[size]} 
        flex items-center justify-center rounded-full border-2 border-current mb-2
        ${earned ? 'animate-pulse' : ''}
      `}>
        {getBadgeIcon(name)}
      </div>
      
      {/* Badge Name */}
      <h3 className="font-semibold text-center leading-tight mb-1">
        {name}
      </h3>
      
      {/* Badge Description */}
      <p className="text-xs text-center opacity-80 leading-tight">
        {description}
      </p>
      
      {/* Earned indicator */}
      {earned && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
          ✓
        </div>
      )}
      
      {/* Special effect for newly earned badges */}
      {earned && (
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-xl pointer-events-none" />
      )}
    </div>
  );
};

export default Badge;
