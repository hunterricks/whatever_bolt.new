import Link from "next/link";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("bg-background shadow-md mt-8", className)}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm">WHATEVER™ is the platform that connects homeowners with skilled professionals for all their home-related needs.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">For Homeowners</h3>
            <ul className="space-y-2">
              <li><Link href="/post-job" className="text-sm hover:text-primary">Post a Job</Link></li>
              <li><Link href="/how-it-works" className="text-sm hover:text-primary">How It Works</Link></li>
              <li><Link href="/safety" className="text-sm hover:text-primary">Safety</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">For Professionals</h3>
            <ul className="space-y-2">
              <li><Link href="/find-work" className="text-sm hover:text-primary">Find Work</Link></li>
              <li><Link href="/pricing" className="text-sm hover:text-primary">Pricing</Link></li>
              <li><Link href="/resources" className="text-sm hover:text-primary">Resources</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-sm hover:text-primary">Help Center</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-primary">Contact Us</Link></li>
              <li><Link href="/privacy" className="text-sm hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} WHATEVER™. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}