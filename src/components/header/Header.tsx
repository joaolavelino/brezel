"use client";

import { useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { MenuIcon, Moon, Sun, X } from "lucide-react";
import headerLogo from "@/assets/header-logo.png";
import Image from "next/image";
import { ResponsiveDialog } from "../ResponsiveDialog";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "../ui/sheet";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { motion } from "framer-motion";
import { MENU_ITEMS } from "@/constants/nav-items";
import { STAGGER_LIST_VARIANTS } from "@/lib/animations";
import { NavItems } from "./NavItems";
import { ProfileDisplay } from "./ProfileDisplay";
import { Switch } from "../ui/switch";
import { SwitchBrand } from "../ui/switchBrand";
import { useRouter } from "next/navigation";

const subscribeToNothing = () => () => {};

function useClientMounted() {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
}

export const Header = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useClientMounted();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  return (
    <>
      <header className="fixed top-0 w-full p-3 px-8 pt-12  bg-brand-surface rounded-b-2xl flex justify-between items-center">
        <h1 onClick={() => router.push("/")}>
          <Image src={headerLogo} alt="Logo do brezel" />
        </h1>
        <Button
          variant={"default"}
          className="rounded-full bg-brand-foreground text-brand-surface hover:bg-transparent hover:text-brand-foreground"
          size={"icon-lg"}
          onClick={() => setIsMenuOpen(true)}
        >
          <MenuIcon />
        </Button>
      </header>
      <Sheet open={isMenuOpen && !isDesktop} onOpenChange={setIsMenuOpen}>
        <SheetContent
          className="p-6 py-12 !h-[100%] bg-brand-surface h-full border-2 flex flex-col justify-between"
          side="top"
          showCloseButton={false}
        >
          <SheetTitle className="flex justify-between items-center p-1">
            <div>
              <Image src={headerLogo} alt="Logo do brezel" />
            </div>
            <Button
              variant={"default"}
              className="rounded-full bg-brand-foreground text-brand-surface hover:bg-transparent hover:text-brand-foreground"
              size={"icon-lg"}
              onClick={() => setIsMenuOpen(false)}
            >
              <X />
            </Button>
          </SheetTitle>

          <div className="space-y-4">
            <ProfileDisplay />
            <hr className="text-brand-foreground" />
            <motion.ul
              initial="closed"
              animate="open"
              exit="closed"
              variants={STAGGER_LIST_VARIANTS}
              className="space-y-2"
            >
              <NavItems />
            </motion.ul>
            <div className="pl-2 flex items-center  gap-3">
              <span className="text-sm text-brand-foreground">
                {resolvedTheme == "dark" ? <Moon /> : <Sun />}
              </span>
              <SwitchBrand
                checked={mounted ? resolvedTheme === "dark" : false}
                onCheckedChange={(on) => setTheme(on ? "dark" : "light")}
                disabled={!mounted}
                aria-label="Alternar tema escuro"
                className="bg-brand-surface"
                size="lg"
              />
            </div>
            <div className="flex flex-col space-y-4 mt-8">
              <Button variant={"brand"} className="rounded-full ">
                Log out
              </Button>
              <Button variant={"brandOutline"} className="rounded-full ">
                Excluir conta
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
