import "@/app/_styles/globals.css";
import { AppProviders } from "./providers";
import { Toaster } from "sonner";

export const metadata = {
  title: {
    template: "Coffee App",
    default: "Welcome / Best Coffee ",
  },
  description:
    "Luxurious coffee, made for everyone who loves coffee, and drink it every day ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          {children}
          <Toaster position="top-right" richColors duration={1200} />
        </AppProviders>
      </body>
    </html>
  );
}
