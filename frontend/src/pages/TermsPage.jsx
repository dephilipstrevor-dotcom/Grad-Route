import { Link } from 'react-router-dom'

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-[#0A0F1C] text-gray-300 pt-28 pb-12 px-6 md:px-10">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-brand-copper hover:text-orange-400 mb-8">
          <i className="fa-solid fa-arrow-left text-xs"></i>
          <span>← Back to home</span>
        </Link>

        <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
        <p className="text-xs text-gray-500 mb-8">Last updated: May 2026</p>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Acceptance of Terms</h2>
            <p>By accessing or using GradRoute, you agree to be bound by these Terms. If you do not agree, do not use the platform.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. Service Description</h2>
            <p>GradRoute provides a mathematical filtering engine that maps graduate‑school pathways based on your academic and financial profile. All displayed routes are estimates and do not guarantee admission, visa approval, or employment.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your login credentials. You agree to provide accurate information during sign‑up and to keep your profile updated.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. Intellectual Property</h2>
            <p>All algorithms, data visualisations, and the GradRoute brand are proprietary. You may not reverse‑engineer, copy, or resell any part of the service without written permission.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">5. Limitation of Liability</h2>
            <p>GradRoute shall not be held liable for any decisions made based on the platform's output. Use the information at your own discretion.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">6. Changes to Terms</h2>
            <p>We may update these Terms at any time. Continued use after changes constitutes acceptance of the new Terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">7. Contact</h2>
            <p>Questions? Reach out at <a href="mailto:support@gradroute.com" className="text-brand-copper underline">support@gradroute.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default TermsPage