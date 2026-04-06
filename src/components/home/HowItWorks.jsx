import { motion } from 'framer-motion';
import { Search, PenLine, MessageSquare, Award } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Choose a Scenario',
    description: 'Browse our library of real-life scenarios across multiple categories and difficulty levels.',
    color: 'bg-[#3A7BFF]'
  },
  {
    icon: PenLine,
    title: 'Write Your Response',
    description: 'Think through the situation and type your open-ended response with no restrictions.',
    color: 'bg-[#23C4C7]'
  },
  {
    icon: MessageSquare,
    title: 'Get AI Feedback',
    description: 'Receive personalized, human-like feedback on your approach, reasoning, and emotional intelligence.',
    color: 'bg-[#FF7A59]'
  },
  {
    icon: Award,
    title: 'Earn XP & Level Up',
    description: 'Gain XP points based on your response quality and track your growth over time.',
    color: 'bg-gradient-to-r from-[#3A7BFF] to-[#23C4C7]'
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Four simple steps to build real-world skills through safe, guided practice
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-gray-200 to-gray-200" />
              )}
              
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow relative">
                {/* Step number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-sm font-bold text-[#3A7BFF]">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className={`w-14 h-14 ${step.color} rounded-xl flex items-center justify-center mb-4`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

