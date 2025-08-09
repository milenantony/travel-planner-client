// client/src/components/PageWrapper.jsx

import { motion } from 'framer-motion';

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Start invisible and 20px down
      animate={{ opacity: 1, y: 0 }}  // Animate to visible and original position
      transition={{ duration: 0.5 }}  // Animation will take 0.5 seconds
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;