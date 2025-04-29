import Navbar from "./shared/Layout/Navbar";
import "../globals.css";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      <div>{children}</div>
    </div>
  );
}
