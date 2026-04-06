import { motion } from 'framer-motion';
import { 
  Brain, 
  MessageCircle, 
  TrendingUp, 
  Shield, 
  Lightbulb,
  Heart
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Feedback',
    description: 'Get personalized, human-like feedback that analyzes your approach, reasoning, and emotional intelligence.'
  },
  {
    icon: MessageCircle,
    title: 'Open-Ended Responses',
    description: 'Express yourself freely with no word limits or multiple choice restrictions.'
  },
  {
    icon: TrendingUp,
    title: 'XP & Leveling System',
    description: 'Track your progress, earn XP, and level up as you complete scenarios.'
  },
  {
    icon: Shield,
    title: 'Safe Learning Environment',
    description: 'Practice handling tough situations without real-world consequences.'
  },
  {
    icon: Lightbulb,
    title: 'Multiple Perspectives',
    description: 'Gain insights from different viewpoints to broaden your understanding.'
  },
  {
    icon: Heart,
    title: 'Emotional Intelligence',
    description: 'Develop empathy, self-awareness, and social skills through practice.'
  }
];

export default function FeaturesOverview() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose XP PLUS?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to build confidence and real-world skills
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-2xl border border-gray-100 hover:border-[#3A7BFF]/20 hover:bg-gradient-to-br hover:from-[#3A7BFF]/5 hover:to-transparent transition-all duration-300"
            >
              <div className="w-12 h-12 bg-[#3A7BFF]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#3A7BFF] group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-6 h-6 text-[#3A7BFF] group-hover:text-white transition-colors" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

