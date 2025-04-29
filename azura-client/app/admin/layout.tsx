import "../globals.css";
import AdminLayout from "./shared/components/AdminLayout";
import Header from "./shared/components/Header";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <AdminLayout>
        <div>{children}</div>
      </AdminLayout>
    </div>
  );
}
