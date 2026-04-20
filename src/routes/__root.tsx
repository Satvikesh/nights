import { Outlet, Link, createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { MarketStatusBar } from "@/components/stockpulse/MarketStatusBar";

import appCss from "../styles.css?url";

interface RouterContext {
  queryClient: QueryClient;
}

function NotFoundComponent() {
  return (
    <div className="sp-bg flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="mono text-7xl font-bold">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm dim">The page you're looking for doesn't exist.</p>
        <div className="mt-6">
          <Link to="/" className="sp-btn primary">Go to terminal</Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "StockPulse — Real-Time Stock Terminal" },
      { name: "description", content: "Bloomberg-style real-time stock tracker." },
      { name: "author", content: "StockPulse" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "StockPulse — Real-Time Stock Terminal" },
      { name: "twitter:title", content: "StockPulse — Real-Time Stock Terminal" },
      { property: "og:description", content: "Bloomberg-style real-time stock tracker." },
      { name: "twitter:description", content: "Bloomberg-style real-time stock tracker." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d2c93b52-4b4e-485d-af54-3052555dcc3b/id-preview-4686b221--dfb120c2-a3d8-44db-9678-3d40a82d2ee8.lovable.app-1776710939836.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d2c93b52-4b4e-485d-af54-3052555dcc3b/id-preview-4686b221--dfb120c2-a3d8-44db-9678-3d40a82d2ee8.lovable.app-1776710939836.png" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="sp-bg min-h-screen pb-8">
        <MarketStatusBar />
        <Outlet />
        <Toaster theme="dark" position="top-right" />
      </div>
    </QueryClientProvider>
  );
}
