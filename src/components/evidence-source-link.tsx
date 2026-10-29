"use client";
import type { AnchorHTMLAttributes } from "react";
import { trackPublicEvent } from "@/lib/public-events";

export function EvidenceSourceLink(
  props: AnchorHTMLAttributes<HTMLAnchorElement>,
) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackPublicEvent("evidence_source_open");
        props.onClick?.(event);
      }}
    />
  );
}
