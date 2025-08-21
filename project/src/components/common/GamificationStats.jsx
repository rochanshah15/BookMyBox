import React from 'react';
import { Trophy, Zap, TrendingUp, Star } from 'lucide-react';

const GamificationStats = ({ userStats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-8 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Trophy size={48} className="mx-auto mb-4 opacity-50" />
        <p>No gamification stats available yet.</p>
        <p className="text-sm">Start booking to see your progress!</p>
      </div>
    );
  }

  const getLevel = (points) => {
    if (points >= 1000) return { level: 5, name: 'Sports Legend', color: 'text-purple-600', bgColor: 'bg-purple-100' };
    if (points >= 500) return { level: 4, name: 'Sports Master', color: 'text-gold-600', bgColor: 'bg-yellow-100' };
    if (points >= 200) return { level: 3, name: 'Sports Expert', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (points >= 50) return { level: 2, name: 'Sports Enthusiast', color: 'text-green-600', bgColor: 'bg-green-100' };
    return { level: 1, name: 'Beginner', color: 'text-gray-600', bgColor: 'bg-gray-100' };
  };

  const currentLevel = getLevel(userStats.points || 0);
  const nextLevelPoints = [50, 200, 500, 1000, 2000][currentLevel.level - 1] || 2000;
  const progressPercentage = Math.min(((userStats.points || 0) / nextLevelPoints) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Level and Progress Bar */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">Level {currentLevel.level}</h3>
            <p className="opacity-90">{currentLevel.name}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{userStats.points || 0}</p>
            <p className="text-sm opacity-90">Points</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-3 mb-2">
          <div 
            className="bg-white h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-sm opacity-90">
          {nextLevelPoints - (userStats.points || 0)} points to next level
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Points</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.points || 0}</p>
            </div>
            <Zap className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Level</p>
              <p className="text-2xl font-bold text-gray-900">{currentLevel.level}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Badges Earned</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.badges_earned || 0}</p>
            </div>
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Achievements</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.total_achievements || 0}</p>
            </div>
            <Star className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      {userStats.weekly_bookings !== undefined && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="mr-2 text-blue-500" />
            This Week's Progress
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Bookings this week</span>
              <span className="font-semibold">{userStats.weekly_bookings}/3</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((userStats.weekly_bookings / 3) * 100, 100)}%` }}
              />
            </div>
            {userStats.weekly_bookings >= 3 && (
              <p className="text-green-600 text-sm font-medium">
                🎉 Weekly Warrior badge earned!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GamificationStats;
