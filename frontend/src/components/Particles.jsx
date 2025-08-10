import React from 'react';
import { motion } from 'framer-motion';

const Particles = ({ colors = ["#E76F51", "#F4A261"], count = 20 }) => {
  const particles = Array(count).fill(0);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => {
        const size = Math.random() * 5 + 2;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const color = colors[Math.floor(Math.random() * colors.length)];

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              opacity: Math.random() * 0.4 + 0.1,
              left: `${x}%`,
              top: `${y}%`,
            }}
            animate={{
              y: [0, 50, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: duration,
              delay: delay,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </div>
  );
};

export default Particles;
