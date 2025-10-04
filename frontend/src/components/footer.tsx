import { LeLoLogo } from "./lelo-logo"

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <LeLoLogo className="mb-4" />
            <p className="text-white/70 mb-4 max-w-md">
              Advancing high-performance image processing with Python, FastAPI, React, and PostgreSQL — engineered for precision, speed, and complete data autonomy.
            </p>
            <p className="text-sm text-white/50 italic">"Driving innovation through high-resolution computational imaging."</p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2 text-white/70">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">EYES OF GOD</h3>
            <ul className="space-y-2 text-white/70">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/50">
          <p>&copy; 2025 Eyes of God. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
