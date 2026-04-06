import { motion } from 'framer-motion';
import { Zap, Star, Trophy, Crown, Rocket } from 'lucide-react';

const levels = [
  { level: 1, name: 'Beginner', xp: '0-100 XP', icon: Star, color: 'text-gray-400' },
  { level: 2, name: 'Explorer', xp: '100-300 XP', icon: Zap, color: 'text-blue-500' },
  { level: 3, name: 'Improver', xp: '300-600 XP', icon: Trophy, color: 'text-amber-500' },
  { level: 4, name: 'Skilled', xp: '600-1000 XP', icon: Crown, color: 'text-purple-500' },
  { level: 5, name: 'XP Master', xp: '1000+ XP', icon: Rocket, color: 'text-[#3A7BFF]' }
];

const xpBreakdown = [
  { label: 'Beginner scenarios', value: '+20 XP' },
  { label: 'Intermediate scenarios', value: '+35 XP' },
  { label: 'Advanced scenarios', value: '+50 XP' },
  { label: 'Quality bonus', value: '+5 to +15 XP' }
];

export default function XPSystemOverview() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Levels */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Level Up Your Skills
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Complete scenarios, earn XP, and track your journey from Beginner to XP Master
            </p>
            
            <div className="space-y-4">
              {levels.map((level, index) => (
                <motion.div
                  key={level.level}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center ${level.color}`}>
                    <level.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-400">LEVEL {level.level}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">{level.name}</h4>
                  </div>
                  <span className="text-sm text-gray-500 font-medium">{level.xp}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Right side - XP breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Decorative gradient */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#3A7BFF]/20 to-[#23C4C7]/20 rounded-full blur-3xl" />
            
            <div className="relative bg-gradient-to-br from-[#3A7BFF] to-[#23C4C7] rounded-3xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold">XP Rewards</h3>
              </div>
              
              <div className="space-y-4 mb-8">
                {xpBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-white/20 last:border-0">
                    <span className="text-white/80">{item.label}</span>
                    <span className="font-bold text-lg">{item.value}</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-sm text-white/80">
                  <strong className="text-white">Bonus XP</strong> is awarded based on empathy, clarity, logic, emotional intelligence, and creativity in your responses.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
