import type React from "react";
import { LayoutDashboard, CheckSquare, Activity, FileText, Tag, Image as ImageIcon, Car, Crosshair, MapPin, Users, Compass, GitCompare, Sliders, Map, CheckCircle2, Shield, BarChart3, Search, Settings, Mail, MailPlus, Database, BookOpen, Building2, Package, Radio as RadioIcon } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: "primary" | "warning" | "default";
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const ADMIN_NAV_SECTIONS: NavSection[] = [
  {
    title: "Workspace",
    items: [
      { label: "All admin tools", href: "/admin/manage", icon: LayoutDashboard },
      { label: "Overview", href: "/admin", icon: LayoutDashboard },
      { label: "Tasks", href: "/admin/tasks", icon: CheckSquare },
      { label: "Activity", href: "/admin/activity", icon: Activity },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Articles", href: "/admin/articles", icon: FileText },
      { label: "Categories & Tags", href: "/admin/categories", icon: Tag },
      { label: "Guides", href: "/admin/guides", icon: BookOpen },
      { label: "Properties", href: "/admin/properties", icon: Building2 },
      { label: "Collectibles", href: "/admin/collectibles", icon: Package },
      { label: "Radio Stations", href: "/admin/radio", icon: RadioIcon },
      { label: "Media", href: "/admin/media", icon: ImageIcon },
      { label: "Messages", href: "/admin/messages", icon: Mail },
      { label: "Subscribers", href: "/admin/subscribers", icon: MailPlus },
    ],
  },
  {
    title: "Game Database",
    items: [
      { label: "Vehicles", href: "/admin/vehicles", icon: Car },
      { label: "Weapons", href: "/admin/weapons", icon: Crosshair },
      { label: "Locations", href: "/admin/locations", icon: MapPin },
      { label: "Characters", href: "/admin/characters", icon: Users },
      { label: "Missions", href: "/admin/missions", icon: Compass },
    ],
  },
  {
    title: "Tools",
    items: [
      { label: "Comparisons", href: "/admin/comparisons", icon: GitCompare },
      { label: "Comparison Settings", href: "/admin/comparison", icon: Sliders },
      { label: "Interactive Map", href: "/admin/map", icon: Map },
      { label: "Completion Tracker", href: "/admin/tracker", icon: CheckCircle2 },
    ],
  },
  {
    title: "Administration",
    items: [
      { label: "Users & Roles", href: "/admin/users", icon: Shield },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "SEO", href: "/admin/seo", icon: Search },
      { label: "Site Settings", href: "/admin/settings", icon: Settings },
      { label: "Database", href: "/admin/database", icon: Database },
    ],
  },
];
