// Enhanced Animation Utilities for BookMyBox
export const animations = {
  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },

  // Stagger animations
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  },

  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  },

  // Card animations
  cardHover: {
    whileHover: { 
      y: -8, 
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      transition: { duration: 0.3, ease: "easeOut" }
    },
    whileTap: { scale: 0.98 }
  },

  cardFloat: {
    animate: {
      y: [0, -4, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },

  // Button animations
  buttonPrimary: {
    whileHover: { 
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)",
      transition: { duration: 0.2 }
    },
    whileTap: { scale: 0.95 },
    transition: { type: "spring", stiffness: 400, damping: 17 }
  },

  buttonSecondary: {
    whileHover: { 
      scale: 1.03,
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      transition: { duration: 0.2 }
    },
    whileTap: { scale: 0.97 }
  },

  // Modal animations
  modalOverlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },

  modalContent: {
    initial: { opacity: 0, scale: 0.8, y: 20 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 20,
      transition: { duration: 0.3 }
    }
  },

  // Form animations
  formField: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4 }
  },

  // Icon animations
  iconBounce: {
    animate: {
      y: [0, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },

  iconRotate: {
    animate: {
      rotate: 360,
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }
    }
  },

  iconPulse: {
    animate: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },

  // Loading animations
  skeleton: {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },

  spinner: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  },

  // Counter animations
  countUp: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  },

  // Reveal animations
  slideInLeft: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },

  slideInRight: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },

  slideInUp: {
    initial: { y: 100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },

  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8 }
  },

  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Intersection Observer hook for scroll animations
export const useScrollAnimation = () => {
  return {
    viewport: { once: true, amount: 0.3 },
    initial: "initial",
    whileInView: "animate"
  };
};

// Gradient text utility
export const gradientText = "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent";

// Glass morphism utility
export const glassMorphism = "backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl";

// Modern shadow utilities
export const shadows = {
  soft: "shadow-lg shadow-blue-500/10",
  medium: "shadow-xl shadow-blue-500/20",
  strong: "shadow-2xl shadow-blue-500/30",
  glow: "shadow-2xl shadow-blue-500/40 drop-shadow-lg"
};
