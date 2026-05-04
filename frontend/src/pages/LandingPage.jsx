import { Link } from 'react-router-dom'

/* ==============================
   AIMentorQuote
   ============================== */
const AIMentorQuote = () => {
  return (
    <div className="bg-brand-panel/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 max-w-3xl w-full text-left mb-12 shadow-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
          <i className="fa-solid fa-robot text-blue-400 text-sm"></i>
        </div>
        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Powered by Emergent LLM</span>
      </div>
      <p className="text-gray-300 text-sm md:text-base leading-relaxed italic">
        "Your strict zero-tuition budget of $25k and strong GPA are the exact combination for German public engineering programs. The engine is prioritizing this pathway for mathematical financial success."
      </p>
    </div>
  )
}

/* ==============================
   CTA Section
   ============================== */
const CTASection = () => {
  return (
    <section id="outcomes" className="py-32 bg-brand-dark text-center relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
      
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        <AIMentorQuote />
        
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
          Your Global Career Path. <br /> Calculated, not Guessed.
        </h2>
        <p className="text-gray-400 mb-10 max-w-md mx-auto text-sm">
          Deploy the engine to mathematically map your future. No agents. No bias.
        </p>
        
        <Link
          to="/auth"
          className="group inline-block bg-white text-brand-dark font-bold tracking-widest uppercase text-xs px-10 py-5 rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]"
        >
          Access Engine <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
        </Link>
      </div>
    </section>
  )
}

/* ==============================
   Decision Matrix
   ============================== */
const DecisionMatrix = () => {
  return (
    <section id="capabilities" className="py-32 bg-brand-dark text-white border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-copper/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-20 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Decision Matrix</h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            We leverage deterministic modeling to engineer scalable, high-performance career outcomes that dominate legacy consulting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-brand-panel/50 backdrop-blur-sm border border-white/5 rounded-3xl p-10 relative overflow-hidden group hover:border-brand-copper/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
            <p className="text-brand-copper font-bold text-sm mb-4 tracking-widest">01</p>
            <h3 className="text-3xl font-bold tracking-tight mb-4">Hard Gatekeepers</h3>
            <p className="text-gray-400 leading-relaxed max-w-md mb-12">
              Scalable, secure filtering powered by your exact academic and financial constraints. We drop 90% of unviable routes instantly.
            </p>
            <div className="bg-brand-dark/50 border border-white/5 rounded-xl p-4 flex flex-wrap gap-4 w-fit items-center">
              <div className="px-4 py-2 bg-gray-800/50 rounded-lg text-sm font-medium"><span className="text-gray-500 mr-2 text-xs uppercase tracking-widest">CGPA</span> 8.25</div>
              <div className="px-4 py-2 bg-gray-800/50 rounded-lg text-sm font-medium"><span className="text-gray-500 mr-2 text-xs uppercase tracking-widest">Budget</span> ₹25L</div>
              <div className="px-4 py-2 bg-brand-copper/10 text-brand-copper rounded-lg text-xs font-bold tracking-widest uppercase border border-brand-copper/20 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-copper animate-pulse"></span> Processing Filters
              </div>
            </div>
          </div>

          <div className="bg-brand-panel/50 backdrop-blur-sm border border-white/5 rounded-3xl p-10 relative overflow-hidden group hover:border-brand-copper/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
            <p className="text-brand-copper font-bold text-sm mb-4 tracking-widest">02</p>
            <h3 className="text-2xl font-bold tracking-tight mb-4">ROI Index</h3>
            <p className="text-gray-400 leading-relaxed text-sm mb-8">
              Calculates Expected ROI by mapping target roles (e.g., Quant Dev) against regional salary data.
            </p>
            <div className="border-t border-white/5 pt-6 space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-500"><span>Market Demand</span><span className="text-green-400">High</span></div>
                <div className="w-full h-1.5 bg-brand-dark rounded-full overflow-hidden">
                  <div className="w-[85%] h-full bg-green-500 rounded-full"></div>
                </div>
              </div>
              <p className="text-xs font-bold text-white">€65k - €85k <span className="text-gray-500 font-normal">Expected Base</span></p>
            </div>
          </div>

          <div className="md:col-span-3 bg-brand-panel/50 backdrop-blur-sm border border-white/5 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between group hover:border-brand-copper/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
            <div className="max-w-xl mb-10 md:mb-0">
              <p className="text-brand-copper font-bold text-sm mb-4 tracking-widest">03</p>
              <h3 className="text-2xl font-bold tracking-tight mb-4">The PR Horizon</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Visualize the exact chronological timeline from student visa to permanent residency. Eliminate the risk of forced return.
              </p>
            </div>
            <div className="flex items-center w-full md:w-auto">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-brand-dark border border-white/10 flex items-center justify-center text-gray-500 mb-3"><i className="fa-solid fa-graduation-cap"></i></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Study</span>
              </div>
              <div className="w-12 md:w-20 h-px bg-white/10 -mt-6"></div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-brand-dark border border-white/10 flex items-center justify-center text-gray-500 mb-3"><i className="fa-solid fa-briefcase"></i></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Work</span>
              </div>
              <div className="w-12 md:w-20 h-px bg-brand-copper/30 -mt-6"></div>
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-brand-copper/10 border border-brand-copper text-brand-copper flex items-center justify-center shadow-[0_0_20px_rgba(224,93,54,0.3)] mb-3"><i className="fa-solid fa-passport text-lg"></i></div>
                <span className="text-[10px] font-bold text-brand-copper uppercase tracking-widest">Settle</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ==============================
   Hero Section
   ============================== */
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden border-b border-white/5 bg-brand-dark">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-copper/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        <div className="space-y-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/80">
            <span className="w-2 h-2 rounded-full bg-brand-copper animate-pulse"></span>
            Deterministic Decision Engine
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-white">
            Architecting <br /> Your <br />
            <span className="text-brand-copper relative inline-block">
              Digital Reality.
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-brand-copper/40 rounded-full"></div>
            </span>
          </h1>

          <p className="text-lg text-gray-300 font-medium leading-relaxed max-w-xl">
            GradRoute engineers mathematically viable pathways to top-tier universities and permanent residency. Stop guessing. Start calculating.
          </p>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-brand-dark bg-gray-700">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="user" />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-brand-dark bg-gray-700">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="user" />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-brand-dark bg-brand-copper/20 text-white flex items-center justify-center text-xs font-bold backdrop-blur-sm">12k+</div>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Routes Processed</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              to="/auth"
              className="group relative inline-block px-8 py-4 bg-gradient-to-r from-brand-copper to-orange-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_0_30px_rgba(224,93,54,0.4)] hover:shadow-[0_0_50px_rgba(224,93,54,0.6)] hover:-translate-y-1 text-sm uppercase tracking-wider"
            >
              <span className="relative z-10">Generate My Route</span>
              <i className="fa-solid fa-arrow-right ml-2 relative z-10 group-hover:translate-x-1 transition-transform"></i>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-copper to-orange-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
            </Link>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <i className="fa-regular fa-clock"></i> Takes 2 minutes
            </span>
          </div>
        </div>

        <div className="relative h-[500px] lg:h-[600px] w-full flex items-center justify-center">
          <img
            src="/process-flow.png"
            alt="GradRoute Process"
            className="relative z-20 w-full max-w-md h-auto object-contain drop-shadow-2xl"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300/0A0F1C/E05D36?text=GradRoute+Flow'
            }}
          />

          <div className="absolute top-4 -left-2 lg:top-12 lg:-left-12 bg-brand-slate/90 backdrop-blur-md text-white border border-white/10 rounded-2xl p-4 lg:p-5 shadow-2xl z-30 animate-float transform -rotate-2">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
              <i className="fa-solid fa-wallet text-brand-copper"></i> Budget Delta
            </p>
            <div className="text-lg lg:text-xl font-bold mb-1">-₹2.5L</div>
            <p className="text-[9px] text-gray-400">Minor deficit. Part-time feasible.</p>
          </div>

          <div className="absolute top-0 -right-2 lg:top-8 lg:-right-10 bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-2xl p-4 lg:p-5 shadow-2xl z-30 animate-float-delayed transform rotate-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <i className="fa-solid fa-passport"></i>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">PR Horizon</p>
                <p className="font-bold text-sm">~45 Months</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-12 -left-2 lg:bottom-16 lg:-left-14 bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-2xl p-4 lg:p-5 shadow-2xl z-30 animate-float transform rotate-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                <i className="fa-solid fa-star"></i>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">GPA Match</p>
                <p className="font-bold text-sm text-green-400">92% Fit</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ==============================
   Live Interpretation
   ============================== */
const LiveInterpretation = () => {
  return (
    <section id="process" className="py-24 bg-[#050810] text-white border-t border-white/5">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        
        <div className="space-y-6">
          <div className="text-[10px] font-bold text-brand-copper uppercase tracking-widest">Single Intelligent Canvas</div>
          <h2 className="text-4xl font-bold tracking-tight">Stop filling out forms. <br /> Start configuring systems.</h2>
          <p className="text-gray-400 leading-relaxed text-sm max-w-md">
            Our Intake Engine computes your feasibility in real-time. As you adjust your budget or target roles, the system actively recalculates your global probability stack.
          </p>
          <ul className="space-y-4 pt-4 text-sm font-medium text-gray-300">
            <li className="flex items-center gap-3"><i className="fa-solid fa-check text-brand-copper"></i> No multi-page wizards.</li>
            <li className="flex items-center gap-3"><i className="fa-solid fa-check text-brand-copper"></i> Live interpretation panel.</li>
            <li className="flex items-center gap-3"><i className="fa-solid fa-check text-brand-copper"></i> Instant system warnings.</li>
          </ul>
        </div>

        <div className="relative flex justify-center">
          <div className="bg-brand-panel/30 backdrop-blur-sm border border-white/10 rounded-3xl p-6 shadow-2xl max-w-sm">
            <img 
              src="/girl-illustration.png" 
              alt="Analytics illustration" 
              className="w-full h-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="hidden space-y-4 font-mono text-xs">
              <div className="flex items-start gap-3 text-gray-400">
                <span className="text-brand-copper">&gt;</span>
                <p>Analyzing parameter: <span className="text-white">GPA 8.25</span></p>
              </div>
              <div className="flex items-start gap-3 text-green-400 bg-green-400/5 p-2 rounded border border-green-400/10">
                <span>✓</span>
                <p>Elite academic standing detected. Tier-1 EU pathways unlocked.</p>
              </div>
              <div className="flex items-start gap-3 text-gray-400 mt-4">
                <span className="text-brand-copper">&gt;</span>
                <p>Analyzing constraint: <span className="text-white">Budget $25,000</span></p>
              </div>
              <div className="flex items-start gap-3 text-yellow-400 bg-yellow-400/5 p-2 rounded border border-yellow-400/10">
                <span>⚠</span>
                <p>Budget restricts USA options. Redirecting to German public systems.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ==============================
   NAVBAR (inlined for landing – no user menu)
   ============================== */
const Navbar = () => {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-full px-6 py-3 flex justify-between items-center z-50">
      <Link to="/" className="flex items-center gap-3 font-bold text-sm tracking-widest uppercase text-white">
        <div className="w-8 h-8 bg-brand-copper/20 rounded-lg flex items-center justify-center border border-brand-copper/30 overflow-hidden">
          <img src="/logo.svg" alt="GradRoute" className="w-full h-full object-cover" />
        </div>
        <span>GRADROUTE <span className="text-brand-copper font-black"></span></span>
      </Link>
      
      <div className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-widest text-gray-300 uppercase">
        <a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a>
        <a href="#process" className="hover:text-white transition-colors">Process</a>
        <a href="#outcomes" className="hover:text-white transition-colors">Outcomes</a>
      </div>

      <Link
        to="/auth"
        className="bg-brand-copper hover:bg-brand-copper/90 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(224,93,54,0.3)] hover:shadow-[0_0_30px_rgba(224,93,54,0.5)]"
      >
        Initialize Engine <i className="fa-solid fa-arrow-right"></i>
      </Link>
    </nav>
  )
}

/* ==============================
   LANDING PAGE
   ============================== */
const LandingPage = () => {
  return (
    <main className="font-sans antialiased bg-[#FAFAFA] text-brand-slate selection:bg-brand-copper selection:text-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <DecisionMatrix />
      <LiveInterpretation />
      <CTASection />
    </main>
  )
}

export default LandingPage