export const scalarDepth = {
  farBackground: 0.05,
  midEnvironment: 0.2,
  mainContent: 0.4,
  foreground: 0.7,
  particles: 1.0
};

export const springConfigs = {
  cinematic: { mass: 1, stiffness: 50, damping: 20 },
  responsive: { type: "spring", stiffness: 300, damping: 25 },
  slow: { type: "spring", stiffness: 50, damping: 20 }
};

export const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: springConfigs.cinematic }
  },
  inkReveal: {
    hidden: { clipPath: "circle(0% at 50% 50%)" },
    visible: { clipPath: "circle(150% at 50% 50%)", transition: { duration: 2, ease: [0.6, 0.01, 0.05, 0.95] as const } }
  }
};
