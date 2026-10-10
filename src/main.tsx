import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";
import { queryClient } from "./lib/queryClient.ts";
import { Layout } from "./components/Layout.tsx";
import { EventsListPage } from "./pages/EventsListPage.tsx";
import { EventCreatePage } from "./pages/EventCreatePage.tsx";
import { EventDetailPage } from "./pages/EventDetailPage.tsx";
import { ZoneDetailPage } from "./pages/ZoneDetailPage.tsx";
import "./index.css";

const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <EventsListPage /> },
        { path: "/events/new", element: <EventCreatePage /> },
        { path: "/events/:eventId", element: <EventDetailPage /> },
        { path: "/events/:eventId/zones/:zoneId", element: <ZoneDetailPage /> },
      ],
    },
  ],
  {
    basename: "/admin",
  }
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
