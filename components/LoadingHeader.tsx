export function LoadingHeader() {
  return (
    <header className="bg-background shadow-md animate-pulse sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 bg-muted rounded" />
          <div className="h-8 w-32 bg-muted rounded" />
          <div className="h-10 w-10 bg-muted rounded" />
        </div>
      </div>
    </header>
  );
}