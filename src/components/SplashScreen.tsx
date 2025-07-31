import { motion } from 'motion/react';
import { useEffect } from 'react';
import IconCards from './IconCards';

import { useTranslation } from '@/hooks/useTranslation';

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      sessionStorage.setItem('splashShown', 'true');
      onFinish();
    }, 3000);
    return () => clearTimeout(timeout);
  }, [onFinish]);
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white text-gray-800 dark:bg-[#1f2937] dark:text-white transition-colors duration-300"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="text-center space-y-3"
      >
        <div className="flex items-center justify-center">
          <motion.h1
            className="text-3xl md:text-5xl font-semibold text-[#00b33e]"
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t({ en: 'Uzla ', uz: 'Uzla ', ru: 'Uzla ' })}
          </motion.h1>{' '}
          <motion.h1
            className="text-3xl md:text-5xl font-semibold"
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t({
              uz: " bilan o'rganing",
              ru: ' учитесь с Uzla',
              en: ' learn with Uzla'
            })}
          </motion.h1>
        </div>
        <motion.div className="mt-6">
          <IconCards />
        </motion.div>

        <motion.h3
          className="text-sm md:text-base text-gray-500 dark:text-gray-400"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {t({
            uz: 'Loyiha mualifi - muhandis Sarvarbek Xazratov',
            ru: 'Автор проекта - инженер Сарварбек Хазратов',
            en: 'Project author - engineer Sarvarbek Xazratov'
          })}
        </motion.h3>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
