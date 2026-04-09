import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Route as rootRoute } from "./routes/__root";
import { Route as discoverRoute } from "./routes/discover";
import { Route as indexRoute } from "./routes/index";
import { Route as loginRoute } from "./routes/login";
import { Route as marketRoute } from "./routes/market";

const routeTree = rootRoute.addChildren([
  indexRoute,
  marketRoute,
  discoverRoute,
  loginRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
