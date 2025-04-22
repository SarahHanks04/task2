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
