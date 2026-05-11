import { User } from "lucide-react";

export const ProfileDisplay = ({}) => {
  return (
    <section className="text-brand-foreground">
      <div className="bg-brand-foreground w-fit rounded-full">
        <User size={60} className="text-brand-surface p-2" />
      </div>
      <p className="text-xl font-bold mt-2">Nome do usuário</p>
      <p className="font-light italic">nome-usuário@email.com</p>
    </section>
  );
};
