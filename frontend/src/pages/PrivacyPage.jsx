import { Link } from 'react-router-dom'

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-[#0A0F1C] text-gray-300 pt-28 pb-12 px-6 md:px-10">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-brand-copper hover:text-orange-400 mb-8">
          <i className="fa-solid fa-arrow-left text-xs"></i>
          <span>← Back to home</span>
        </Link>

        <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
        <p className="text-xs text-gray-500 mb-8">Last updated: May 2026</p>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Information We Collect</h2>
            <p>We collect your email, name, academic profile (CGPA, backlogs, IELTS), budget, and target preferences when you use the intake form. Chat conversations are stored to improve your experience.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. How We Use Your Data</h2>
            <p>Your data is used exclusively to generate personalised route matrices and to improve the GradRoute engine. We do not sell or share your personal information with third parties.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Data Storage & Security</h2>
            <p>All data is stored securely on Supabase with encryption at rest and in transit. Access is strictly controlled through Row‑Level Security policies.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. Cookies</h2>
            <p>We use essential cookies for authentication. No tracking or advertising cookies are employed.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">5. Your Rights</h2>
            <p>You can request deletion of your account and all associated data by contacting us. We will comply within 30 days.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">6. Changes to This Policy</h2>
            <p>We may update this policy occasionally. Significant changes will be communicated via email.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">7. Contact</h2>
            <p>For privacy concerns, email <a href="mailto:privacy@gradroute.com" className="text-brand-copper underline">privacy@gradroute.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage