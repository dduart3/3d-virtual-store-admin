
import { ToastProvider } from "./shared/context/ToastContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./modules/auth/context/AuthProvider";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider >
  );
}

export default App;


