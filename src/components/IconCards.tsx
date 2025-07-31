'use client';

import { motion } from 'framer-motion';
import { LayoutDashboard, Users, BookOpen, FileText } from 'lucide-react';

// Bu komponent SplashScreen ichida ishlatiladi.
// Hozircha oddiy joylashtiruvchi versiyasini yarataman.
export default function IconCards() {
  const icons = [
    { icon: LayoutDashboard, color: 'text-blue-500' },
    { icon: Users, color: 'text-green-500' },
    { icon: BookOpen, color: 'text-purple-500' },
    { icon: FileText, color: 'text-orange-500' }
  ];

  return (
    <motion.div
      className="flex justify-center gap-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className={`p-3 rounded-full ${item.color} bg-opacity-10`}
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 }
          }}
        >
          <item.icon size={32} />
        </motion.div>
      ))}
    </motion.div>
  );
}
