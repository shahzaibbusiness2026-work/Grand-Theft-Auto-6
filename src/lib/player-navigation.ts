/** Shared tools have public and authenticated shells; only the feature body is reused. */
export function dashboardToolPath(path: string): string {
  const routes: Record<string, string> = {
    "/map": "/dashboard/map",
    "/tracker": "/dashboard/progress",
    "/vehicles": "/dashboard/vehicles",
    "/weapons": "/dashboard/weapons",
    "/locations": "/dashboard/locations",
    "/tools/loadout-builder": "/dashboard/loadouts",
    "/compare/vehicles": "/dashboard/compare/vehicles",
    "/compare/weapons": "/dashboard/compare/weapons",
  };
  const [base] = path.split(/[?#]/);
  if (/^\/(?:vehicles|weapons|guides|news)\//.test(base))
    return `/dashboard${path}`;
  if (
    [
      "/missions",
      "/properties",
      "/collectibles",
      "/guides",
      "/news",
      "/tools",
    ].includes(base)
  )
    return `/dashboard${path}`;
  return routes[base] ? routes[base] + path.slice(base.length) : path;
}
