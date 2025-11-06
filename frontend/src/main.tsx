import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { CityPage } from "./pages/CityPage";

const qc = new QueryClient();

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/city/:id", element: <CityPage /> }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={qc}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
