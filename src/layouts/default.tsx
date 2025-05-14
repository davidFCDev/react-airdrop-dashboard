import Footer from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/Navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="flex-grow bg-default-100">{children}</main>
      <Footer />
    </div>
  );
}
