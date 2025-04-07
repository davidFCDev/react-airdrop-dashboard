import { Link } from "@heroui/link";

import LanguageSelector from "@/components/LanguageSelector";
import { Navbar } from "@/components/Navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto px-6 flex-grow pt-10">{children}</main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="#"
          title="Telegram Channel"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">Chucky</p>
        </Link>
      </footer>
      <div className="absolute bottom-2 right-2">
        <LanguageSelector />
      </div>
    </div>
  );
}
