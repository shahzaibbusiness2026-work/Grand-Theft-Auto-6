import SavedWorkspacePage from "../saved/page";
export default function PlayerPropertiesPage() {
  return (
    <SavedWorkspacePage
      searchParams={Promise.resolve({ type: "properties" })}
    />
  );
}
