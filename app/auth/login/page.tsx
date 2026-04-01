import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Sign In</h1>
          <p className="text-white/60">Access your GEO briefs</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input type="password" placeholder="••••••••" className="w-full" />
          </div>

          <button className="w-full bg-brand-accent text-brand-dark py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">
            Sign In
          </button>

          <div className="text-center">
            <p className="text-white/60 text-sm">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-brand-accent font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
