import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categories = [
  { id: 'workplace', name: 'Workplace', icon: '💼', color: 'from-blue-500 to-blue-600', description: 'Office dynamics, meetings, deadlines' },
  { id: 'conflict_resolution', name: 'Conflict Resolution', icon: '🤝', color: 'from-purple-500 to-purple-600', description: 'Disagreements, negotiations, mediation' },
  { id: 'communication', name: 'Communication', icon: '💬', color: 'from-teal-500 to-teal-600', description: 'Difficult conversations, feedback' },
  { id: 'leadership', name: 'Leadership', icon: '👑', color: 'from-amber-500 to-amber-600', description: 'Team management, decision making' },
  { id: 'ethical_dilemmas', name: 'Ethical Dilemmas', icon: '⚖️', color: 'from-indigo-500 to-indigo-600', description: 'Moral choices, values conflicts' },
  { id: 'crisis_management', name: 'Crisis Management', icon: '🚨', color: 'from-red-500 to-red-600', description: 'Emergency situations, pressure' },
  { id: 'daily_life', name: 'Daily Life', icon: '🏠', color: 'from-green-500 to-green-600', description: 'Personal decisions, relationships' }
];

export default function CategoriesPreview() {
  return (
    <section className="py-20 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Explore Scenario Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from a wide range of real-life situations to practice
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/scenarios?category=${category.id}`}>
                <div className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-[#3A7BFF] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link to="/scenarios">
            <Button
              size="lg"
              className="bg-[#3A7BFF] hover:bg-[#2a6ae8] text-white font-semibold px-8 rounded-xl group"
            >
              View All Scenarios
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
