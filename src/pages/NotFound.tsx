import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/BrandMark";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 mesh-bg bg-background text-center">
      <BrandMark className="mb-6 h-16 w-16 rounded-2xl" />
      <div className="font-display text-7xl font-bold gradient-text">404</div>
      <h1 className="font-display text-2xl font-bold mt-3">Page not found</h1>
      <p className="text-muted-foreground mt-2 max-w-md">The page you're looking for doesn't exist or was moved.</p>
      <Link to="/dashboard" className="mt-6">
        <Button className="bg-primary text-black border-0 hover:bg-primary/90 rounded-xl shadow-sm">Back to dashboard</Button>
      </Link>
    </div>
  );
}
