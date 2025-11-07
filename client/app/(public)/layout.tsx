import FloatingCart from "@/components/common/FloatingCart";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <FloatingCart />
      </div>
    </>
  );
}
