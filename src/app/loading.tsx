export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <span
        className="block size-5 rounded-full border-2 border-border border-t-foreground animate-spin"
        aria-label="Loading"
        role="status"
      />
    </div>
  );
}
