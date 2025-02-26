import { AuthProvider } from "../context/AuthContext";
import { Providers } from "../reduxToolkit/provider";
import '../styles/globals.css';


export const metadata = {
  title: "Google Girl Hackathon 2025",
  description: "Tailwind setup in Next.js 15",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body>
        <Providers>
          {children}
        </Providers>
        </body>
      </html>
    </AuthProvider>
  );
}
