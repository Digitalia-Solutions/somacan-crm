import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export const MagneticButton = ({ children, className = "", ...props }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const SplitText = ({ children, className = "", delay = 0 }) => {
  return (
    <span className={`inline-block overflow-hidden py-1 ${className}`}>
      <motion.span
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
};

export const SectionLabel = ({ children, className = "" }) => (
  <div className={`flex items-center gap-4 mb-8 ${className}`}>
    <div className="w-8 h-px bg-gold-400" />
    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold-500">
      {children}
    </span>
  </div>
);

export const ScrollReveal = ({ children, delay = 0, direction = "up" }) => {
  const directions = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};
