import type { Metadata } from 'next';
import MarketingNav from '@/components/MarketingNav';
import MarketingFooter from '@/components/MarketingFooter';
import { FREE_BRIEF_LIMIT, SITE_URL, SUPPORT_EMAIL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Terms of Service | GEObrief.ai',
  description:
    'The terms that apply when you use GEObrief.ai: plans and limits, payments and refunds, acceptable use, and ownership of generated briefs.',
  alternates: { canonical: `${SITE_URL}/terms` },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = 'August 17, 2026';

export default function Terms() {
  return (
    <main className="min-h-screen bg-ui-paper text-ui-ink">
      <MarketingNav />

      <article className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl font-bold tracking-tight mb-3">Terms of Service</h1>
        <p className="text-ui-faint text-sm mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="space-y-8 text-ui-body leading-relaxed">
          <section>
            <h2 className="font-serif text-xl font-semibold text-ui-ink mb-3">The service</h2>
            <p>
              GEObrief.ai generates content briefs intended to help you structure content
              for AI answer engines. Briefs are produced by an AI model with live web
              search, and are recommendations, not guarantees of ranking, citation, or
              traffic.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-ui-ink mb-3">Accounts</h2>
            <p>
              You need an account to generate briefs. You are responsible for keeping your
              credentials secure and for activity under your account. Provide an email
              address you control; we use it for account recovery and for applying
              purchases.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-ui-ink mb-3">Plans and limits</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-ui-ink">Free:</strong> {FREE_BRIEF_LIMIT} briefs per
                calendar month. The counter resets on the first day of each month.
              </li>
              <li>
                <strong className="text-ui-ink">Pro ($15/month):</strong> unlimited briefs
                while the subscription is active.
              </li>
              <li>
                <strong className="text-ui-ink">Lifetime ($59, one-time):</strong> unlimited
                briefs with no recurring charge.
              </li>
            </ul>
            <p className="mt-3">
              &ldquo;Unlimited&rdquo; means without a fixed monthly cap, subject to the fair
              use provision below.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-ui-ink mb-3">Payments and refunds</h2>
            <p>
              Payments are processed by Gumroad under their terms; we never handle your
              card details. Use the same email address for your purchase as for your
              account so your plan applies automatically. Subscriptions renew monthly until
              cancelled, and you can cancel any time through Gumroad; access continues to
              the end of the paid period. Lifetime purchases are one-time and
              non-refundable. If a charge was made in error, contact us and we will work
              with you to resolve it.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-ui-ink mb-3">Fair use</h2>
            <p>
              Unlimited plans are for individual and team use of the product as intended.
              We may rate-limit or suspend accounts that automate bulk generation, resell
              or redistribute access, share one account across an organisation in place of
              multiple seats, or place a disproportionate load on the service. We will
              contact you before taking action wherever practical.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-ui-ink mb-3">Acceptable use</h2>
            <p>Do not use GEObrief.ai to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>generate content designed to deceive, impersonate, or defraud</li>
              <li>produce material that is unlawful where you or your readers are</li>
              <li>attempt to breach, probe, or disrupt the service or its providers</li>
              <li>reverse engineer or resell the underlying model access</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-ui-ink mb-3">Ownership</h2>
            <p>
              You own the briefs generated for you and may use them commercially, including
              for client work. We retain ownership of the software, prompts, and interface.
              Because briefs are AI-generated, similar inputs may produce similar outputs
              for other users, so we cannot grant exclusivity over any brief&apos;s content.
              Verify facts, statistics, and cited sources before publishing.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-ui-ink mb-3">
              Availability and disclaimer
            </h2>
            <p>
              The service is provided &ldquo;as is.&rdquo; We depend on third-party
              providers, including our AI, database, and hosting vendors, and cannot
              guarantee uninterrupted availability or that any brief will be accurate,
              complete, or effective. To the fullest extent permitted by law, our total
              liability is limited to the amount you paid us in the twelve months before
              the claim.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-ui-ink mb-3">Termination</h2>
            <p>
              You may stop using the service and request deletion at any time. We may
              suspend or terminate accounts that breach these terms. If we terminate your
              account without cause while you hold a paid plan, we will refund the unused
              portion.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-ui-ink mb-3">Changes</h2>
            <p>
              We may update these terms. Material changes will be reflected in the date
              above and notified to registered users by email. Continuing to use the
              service after a change means you accept the updated terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-ui-ink mb-3">Contact</h2>
            <p>
              Questions about these terms:{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-ui-accent hover:underline">
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
