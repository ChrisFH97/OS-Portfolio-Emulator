// app/layout.js
import OSLayout from './components/OSLayout';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Use OSLayout as the main wrapper for children */}
        <OSLayout>
          {children}
        </OSLayout>
      </body>
    </html>
  );
}
