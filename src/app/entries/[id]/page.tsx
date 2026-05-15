import { EntryDetails } from "@/components/entryPage/EntryDetails";
import { FooterTabs } from "@/components/footerTabs.tsx";

interface EntryPageProps {
  params: Promise<{ id: string }>;
}

const EntryPage = async ({ params }: EntryPageProps) => {
  const { id } = await params;
  return (
    <main className="flex flex-col min-h-screen mt-30  ">
      <EntryDetails id={id} />
      <FooterTabs />
    </main>
  );
};

export default EntryPage;
