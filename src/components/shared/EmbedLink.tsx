import { ExternalLink } from "lucide-react";

interface EmbedLinkProps {
  href: string;
  label: string;
}

export function EmbedLink({ href, label }: EmbedLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={href}
      className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5 text-[12px] text-muted max-w-48 truncate"
    >
      {label}
      <ExternalLink size={10} className="shrink-0 opacity-50" />
    </a>
  );
}
