import { MENU_ITEMS } from "@/constants/nav-items";
import { STAGGER_LIST_VARIANTS } from "@/lib/animations";
import { motion } from "framer-motion";

export const NavItems = () => {
  return (
    <>
      {MENU_ITEMS.map((item) => {
        const Icon = item.icon;

        return (
          <motion.li key={item.label} variants={STAGGER_LIST_VARIANTS}>
            <a
              href={item.href}
              className="flex items-center gap-2  rounded-2xl transition-all group hover:bg-brand-foreground/5"
              download={item.label === "Exportar"}
            >
              <div className="p-2 bg-brand-surface-muted rounded-xl text-brand-foreground group-hover:scale-110 transition-transform">
                <Icon size={20} />
              </div>
              <span className="text-md font-bold text-brand-foreground group-hover:italic">
                {item.label}
              </span>
            </a>
          </motion.li>
        );
      })}
    </>
  );
};
