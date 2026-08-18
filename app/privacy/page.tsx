import type { Metadata } from 'next';
import MarketingNav from '@/components/MarketingNav';
import MarketingFooter from '@/components/MarketingFooter';
import { SITE_URL, SUPPORT_EMAIL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Privacy Policy | GEObrief.ai',
  description:
    'What data GEObrief.ai collects, where it is stored, which third parties process it, and how to have it deleted.',
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = 'August 17, 2026';

export default function Privacy() {
  return (
    <main className="min-h-screen bg-brand-dark text-white">
      <MarketingNav />

      <article className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
        <p className="text-white/40 text-sm mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="space-y-8 text-white/75 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">What we collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-white">Account data:</strong> your email address,
                and — if you sign in with Google — the basic profile information Google
                returns. Passwords are handled by our authentication provider and are never
                stored by us in readable form.
              </li>
              <li>
                <strong className="text-white">Content you submit:</strong> the keywords,
                website URLs, and niche descriptions you enter to generate briefs.
              </li>
              <li>
                <strong className="text-white">Generated briefs:</strong> the briefs
                produced for you, stored so they appear in your history.
              </li>
              <li>
                <strong className="text-white">Usage counts:</strong> how many briefs you
                have generated in the current month, used to enforce plan limits.
              </li>
              <li>
                <strong className="text-white">Purchase records:</strong> if you buy a
                paid plan, we store the identifiers our payment provider sends us so we
                can apply your plan. We never receive or store your card details.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              Third parties that process your data
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-white">Supabase</strong> — database and
                authentication. Stores your account, briefs, and usage records.
              </li>
              <li>
                <strong className="text-white">xAI (Grok API)</strong> — brief generation.
                The keyword, URL, and niche you submit are sent to xAI to produce the
                brief. Do not enter confidential information you would not want processed
                by a third-party AI provider.
              </li>
              <li>
                <strong className="text-white">Gumroad</strong> — payment processing.
                Gumroad handles the transaction and sends us the purchase email and plan
                status.
              </li>
              <li>
                <strong className="text-white">Vercel</strong> — hosting. Processes
                request logs, which may include IP addresses.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">How we use it</h2>
            <p>
              We use your data to operate the service: to authenticate you, generate and
              store your briefs, enforce plan limits, apply purchases to your account, and
              respond to support requests. We do not sell your data, and we do not use the
              content of your briefs for advertising.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Retention and deletion</h2>
            <p>
              Your account and briefs are kept until you ask us to delete them. Email{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-brand-accent hover:underline">
                {SUPPORT_EMAIL}
              </a>{' '}
              from your registered address and we will delete your account and all
              associated briefs. Deleting your account removes your data from our
              database; our providers may retain backups for a limited period under their
              own policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Your rights</h2>
            <p>
              Depending on where you live, you may have the right to access, correct,
              export, or delete your personal data, and to object to certain processing.
              To exercise any of these, contact{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-brand-accent hover:underline">
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Changes</h2>
            <p>
              If this policy changes materially, we will update the date above and notify
              registered users by email.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Contact</h2>
            <p>
              Questions about privacy:{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-brand-accent hover:underline">
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>
      </article>

      <MarketingFooter />
    </main>
  );
}
