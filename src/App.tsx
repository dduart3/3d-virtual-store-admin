
import { ToastProvider } from "./shared/context/ToastContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./modules/auth/context/AuthProvider";
import { SearchProvider } from "./contexts/SearchContext";
import { ThemeProvider } from "./components/theme-provider";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { NavigationProvider } from "./contexts/NavigationContext";


function App() {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
              <SearchProvider>
                <NavigationProvider>
                  <RouterProvider router={router} />
                </NavigationProvider>
              </SearchProvider>
            </ThemeProvider>
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;





