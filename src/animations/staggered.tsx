import { Variants } from "framer-motion";

// Animação para o Container (Pai)
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      // O SEGREDO: Staggered Children
      staggerChildren: 0.08, // Atraso de 0.08s entre cada filho
      delayChildren: 0.15, // Espera 0.2s antes de começar a cascata
    },
  },
};

// Animação para cada Item (Filho: Tag ou Card)
export const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 15, // Começa um pouco abaixo
    scale: 0.95, // Começa um pouco menor
  },
  visible: {
    opacity: 1,
    y: 0, // Sobe para a posição final
    scale: 1, // Volta ao tamanho normal
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 0.8,
    },
  },
};
