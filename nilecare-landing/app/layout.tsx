import "./globals.css";

export const metadata = {
  title: "NileCare",
  description: "Clinic coordination platform"
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body>{children}</body></html>;
}
