import { CommunityMapWorkspace } from "@/components/community-map-workspace";
import { getMapMarkers } from "@/lib/services/map";
import { getSiteSettings } from "@/lib/services/settings";
import { FeatureDisabled } from "@/components/feature-disabled";
export default async function PlayerMapPage() {
  const settings = await getSiteSettings();
  if (!(settings.publicToolToggles || []).includes("map_tool"))
    return <FeatureDisabled title="Interactive Map" />;
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">My map</h1>
        <p className="mt-2 text-sm text-slate-400">
          Keep private planning pins, favorite locations and notes in your
          account. Editorial map coordinates remain provisional.
        </p>
      </div>
      <CommunityMapWorkspace playerMode markers={await getMapMarkers()} />
    </div>
  );
}
