import { ThemeProvider } from "@/components/theme-provider";
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from "react-error-boundary";
import App from './App.tsx';
import { Button } from "./components/ui/button.tsx";
import './index.css';



function AppWarp() {
  // new VConsole();
  console.log("window.navigator.userAgent:::", window.navigator.userAgent);
  const isMobile = /Mobile/.test(window.navigator.userAgent);
  if (isMobile) {
    return <div className="p-2">
      <Button className="border-0 shadow-none text-gray-500" variant={"outline"}>请前往电脑端企业微信打开</Button>
    </div>;
  } else {
    return <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <App />
      </ErrorBoundary>
    </ThemeProvider>;
  }
}

createRoot(document.getElementById('root')!).render(<AppWarp></AppWarp>);
