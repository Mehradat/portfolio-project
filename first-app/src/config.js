export const REVEAL_FROM_LEFT = {
  hidden: { opacity: 0, x: -70 },
  visible: { opacity: 1, x: 0 },
};

export const REVEAL_FROM_RIGHT = {
  hidden: { opacity: 0, x: 70 },
  visible: { opacity: 1, x: 0 },
};

export const FADE_IN_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const FADE_IN = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const HERO_INTRO = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

export const HERO_ACCENT_LINE = {
  hidden: { width: 0 },
  visible: { width: "100px" },
};

export const GRADIENT_TEXT_REVEAL = {
  hidden: { backgroundSize: "0% 100%" },
  visible: { backgroundSize: "100% 100%" },
};

export const HERO_PORTRAIT = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export const FLOATING_BLOB = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 90, 0],
  },
};

export const PHILOSOPHY_ORB = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.1, 0.2, 0.1],
  },
};

export const DRAW_PATH = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1 },
};

export const TIMELINE_ITEM = (index) => ({
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: index * 0.2 },
});

/** @type {import('framer-motion').Transition} */
export const REVEAL_TRANSITION = {
  duration: 0.8,
  ease: "easeOut",
};

/** @type {import('framer-motion').Transition} */
export const HERO_LINE_TRANSITION = {
  delay: 0.5,
  duration: 1,
};

/** @type {import('framer-motion').Transition} */
export const GRADIENT_TEXT_TRANSITION = {
  duration: 1,
  delay: 0.8,
};

/** @type {import('framer-motion').Transition} */
export const HERO_PORTRAIT_TRANSITION = {
  duration: 1,
  type: "spring",
};

/** @type {(delay?: number) => import('framer-motion').Transition} */
export const FLOATING_BLOB_TRANSITION = (delay = 0) => ({
  duration: 8,
  repeat: Infinity,
  delay,
});

/** @type {import('framer-motion').Transition} */
export const PHILOSOPHY_ORB_TRANSITION = {
  duration: 8,
  repeat: Infinity,
};

/** @type {import('framer-motion').Transition} */
export const DRAW_PATH_TRANSITION = {
  duration: 1.5,
  ease: "easeInOut",
};

/** @type {import('framer-motion').Transition} */
export const TEXT_REVEAL_TRANSITION = {
  delay: 0.3,
};

/** @type {import('framer-motion').Transition} */
export const TEXT_FADE_TRANSITION = {
  delay: 0.5,
};

export const SECTION_VIEWPORT = {
  once: true,
  amount: 0.1,
};

export const TIMELINE_VIEWPORT = {
  once: true,
  margin: "-100px",
};

// Toggle these depending on whether you are testing locally or deploying
// export const API_URL = "https://portfolio-project-3otb.onrender.com";
("https://portfolio-project-3otb.onrender.com");
export const API_URL = "http://localhost:5005";
