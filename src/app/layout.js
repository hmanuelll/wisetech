import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "WISE-TECH | Smart Solutions, Better Future",
  description: "Computer sales in Lusaka, Zambia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <ShopProvider>
            <Toaster position="top-center" toastOptions={{ style: { padding: '16px', fontSize: '1.1rem', background: '#fff', color: '#333' } }} />
            <Header />
            <main>{children}</main>
            <footer>
              <div className="container">
                <div className="logo">
                  <span className="wise">WISE</span><span className="tech">-TECH</span>
                </div>
                <p>&copy; {new Date().getFullYear()} WISE-TECH. All rights reserved.</p>
              </div>
            </footer>
          </ShopProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
