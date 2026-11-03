import { SafeImage } from "./safe-image";
import {
  getWorldMedia,
  mediaSourceLabel,
  mediaWatchUrl,
} from "@/lib/world-media";

export function WorldMediaFigure({
  path,
  priority = false,
}: {
  path: string;
  priority?: boolean;
}) {
  const media = getWorldMedia(path);
  if (!media) return null;
  return (
    <figure className="overflow-hidden rounded-2xl border border-border bg-card">
      <SafeImage
        src={media.src}
        alt={media.alt}
        width={media.width}
        height={media.height}
        sizes="(max-width: 768px) 100vw, 1200px"
        priority={priority}
        className="h-auto w-full object-cover"
      />
      <figcaption className="space-y-1 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        <p>
          <a
            href={mediaWatchUrl(media)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
          >
            {mediaSourceLabel(media)}
          </a>{" "}
          · © {media.credit}
        </p>
        <p>{media.note}</p>
      </figcaption>
    </figure>
  );
}
