import Link from 'next/link';


export const Footer = () => {
  return (
    <footer className="bg-primary text-white py-20 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-3xl font-bold mb-6 block">
              <span className="text-accent italic font-serif">Digital</span>Heroes
            </Link>
            <p className="text-gray-400 max-w-sm leading-relaxed">
              Tracking performance, winning prizes, and making a real-world impact. Join thousands of golfers playing with purpose.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-accent uppercase tracking-widest text-xs">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How it Works</Link></li>
              <li><Link href="/charities" className="hover:text-white transition-colors">Partner Charities</Link></li>
              <li><Link href="/signup" className="hover:text-white transition-colors">Join Now</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Admin Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-accent uppercase tracking-widest text-xs">Connect</h4>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary transition-all text-xs font-bold">
                FB
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary transition-all text-xs font-bold">
                X
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary transition-all text-xs font-bold">
                IG
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary transition-all text-xs font-bold">
                LI
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 GolfDraw. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
