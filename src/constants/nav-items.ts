import {
  Home,
  Info,
  Library,
  RefreshCw,
  Download,
  LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  onClick?: () => void; // Para ações como Exportar
}

export const MENU_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Sobre", href: "/about", icon: Info },
  // { label: "Biblioteca", href: "/library", icon: Library },
  { label: "Restaurar Entrada", href: "/restore", icon: RefreshCw },
  //   {
  //     label: "Exportar",
  //     icon: Download,
  //     // Se for um download direto, você pode usar um href para a rota da API
  //     // ou deixar o componente lidar com uma função de exportação
  //     href: "/api/export",
  //   },
];
