import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { LoginPage } from "./pages/LoginPage";
import Dashboard from "./modules/dashboard";
import Products from "./modules/products";

//import { RegisterPage } from "./pages/RegisterPage";
//import { StorePage } from "./pages/StorePage";
//import { ProfilePage } from "./pages/ProfilePage";
//import { ProtectedRoute } from "./modules/auth/components/ProtectedRoute";

// Create routes
const rootRoute = createRootRoute();

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: () => (
    <p>nada aun</p>
  ),
});

const storeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/store",
  component: () => (
    <p>nada aun</p>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: () => (
    <p>nada aun</p>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: Dashboard
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products",
  component: Products
});

// Create and export the router
const routeTree = rootRoute.addChildren([
  landingRoute,
  loginRoute,
  registerRoute,
  storeRoute,
  profileRoute,
  dashboardRoute,
  productRoute
]);

export const router = createRouter({ routeTree });

// Register router for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
