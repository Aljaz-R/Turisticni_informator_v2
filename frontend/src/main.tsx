import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { CityPage } from "./pages/CityPage";
import AttractionsPage from "./pages/AttractionsPage";
import AttractionPage from "./pages/AttractionPage";
import AdminPage from "./pages/AdminPage";
const qc = new QueryClient();

const router = createBrowserRouter([
  { path:"/", element:<App/> },
  { path:"/city/:id", element:<CityPage/> },
  { path:"/attractions", element:<AttractionsPage/> },
  { path:"/attraction/:id", element:<AttractionPage/> },
  { path: "/admin", element: <AdminPage /> }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={qc}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
