export default function notFound() {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-900 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
          <p className="text-zinc-400 mt-2">The page you are looking for does not exist.</p>
        </div>
      </div>
    );
  }