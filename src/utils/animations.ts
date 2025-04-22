import { Variants } from "framer-motion";

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const statVariants: Variants = {
  hidden: { scale: 0.9 },
  visible: {
    scale: 1,
    transition: { delay: 0.2, type: "spring", stiffness: 100 },
  },
};

export const progressBarVariants: Variants = {
  hidden: { width: 0 },
  visible: (width: string) => ({
    width,
    transition: { duration: 1 },
  }),
};

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

export const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};
