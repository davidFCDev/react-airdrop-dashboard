import { Link } from "@heroui/link";

import { Navbar } from "@/components/Navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
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
    </div>
  );
}
