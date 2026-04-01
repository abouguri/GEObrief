import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-white/60">Start generating GEO briefs free</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input type="text" placeholder="Your name" className="w-full" />
          </div>

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
            Create Account
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-brand-dark text-white/60">Or continue with</span>
            </div>
          </div>

          <button className="w-full border border-white/20 text-white py-3 rounded-lg font-semibold hover:border-brand-accent hover:bg-white/5 transition-all">
            Continue with Google
          </button>

          <div className="text-center">
            <p className="text-white/60 text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-brand-accent font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
