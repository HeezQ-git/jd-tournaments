import { motion } from 'framer-motion';

const fadeUpVariants = {
  initial: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

const fadeInVariants = {
  initial: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const popInVariants = {
  initial: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const variants = {
  fadeIn: fadeInVariants,
  fadeUp: fadeUpVariants,
  popIn: popInVariants,
};

const AnimatedItem = ({
  children,
  delay = 0,
  duration = 0.25,
  animation = 'fadeUp',
  noExitAnimation = false,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  animation?: keyof typeof variants;
  noExitAnimation?: boolean;
}) => (
  <motion.div
    initial="initial"
    animate="visible"
    exit={noExitAnimation ? '' : 'exit'}
    variants={variants[animation]}
    transition={{ duration, delay }}
    style={{ willChange: 'auto' }}
  >
    {children}
  </motion.div>
);

export default AnimatedItem;
