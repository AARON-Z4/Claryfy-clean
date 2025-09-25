import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Globe from 'react-globe.gl';

const LandingPage = () => {
  const globeEl = useRef();
  const [arcsData, setArcsData] = useState([]);

  useEffect(() => {

    if (globeEl.current) {
        globeEl.current.controls().autoRotate = true;
        globeEl.current.controls().autoRotateSpeed = 0.4;
        globeEl.current.pointOfView({ altitude: 2.5 });
    }
    const N_ARCS = 20;
    const gData = [...Array(N_ARCS).keys()].map(() => ({
      startLat: (Math.random() - 0.5) * 180,
      startLng: (Math.random() - 0.5) * 360,
      endLat: (Math.random() - 0.5) * 180,
      endLng: (Math.random() - 0.5) * 360,
      color: [['#818cf8', '#c084fc', '#f472b6', '#38bdf8'][Math.round(Math.random() * 3)], ['#818cf8', '#c084fc', '#f472b6', '#38bdf8'][Math.round(Math.random() * 3)]]
    }));
    setArcsData(gData);
  
    const handleScroll = () => {
      const elements = document.querySelectorAll('.scroll-fade-in');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          el.classList.add('is-visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page-dark">
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
          <div className="container mx-auto flex items-center h-24 px-6">
              <Link to="/" className="text-3xl font-bold tracking-tighter animated-gradient-text">
                  Clarifyt
              </Link>
              <nav className="hidden md:flex items-center space-x-8 ml-10">
                  <a href="#features" className="nav-link">Features</a>
                  <a href="#how-it-works" className="nav-link">How It Works</a>
              </nav>
              <div className="ml-auto">
                <Link to="/app" className="cta-button">
                    <span>Login</span>
                </Link>
              </div>
          </div>
      </header>

      <main>
        {/* MODIFIED: Hero Section with 3D Globe */}
        <section className="relative hero-content container mx-auto px-6">
            <div className="hero-text-panel z-10">
                <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-4 animated-gradient-text-hero">
                The World's Information, Clarified.
                </h1>
                <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-2xl">
                In an era of digital noise, Clarifyt is your signal. Our AI instantly analyzes global news, articles, and posts, giving you the clarity to distinguish fact from fiction.
                </p>
                <div className="mt-10">
                <Link to="/app" className="cta-button-large">
                    Start Analyzing
                </Link>
                </div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full z-0">
                <Globe
                    ref={globeEl}
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                    backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                    arcsData={arcsData}
                    arcColor={'color'}
                    arcDashLength={() => Math.random()}
                    arcDashGap={() => Math.random()}
                    arcDashAnimateTime={() => Math.random() * 4000 + 500}
                    arcStroke={0.4}
                />
            </div>
        </section>

        <section id="how-it-works" className="py-32">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white scroll-fade-in">A Seamless Path to Clarity</h2>
              <p className="mt-4 text-lg text-slate-400 scroll-fade-in">
                Uncovering the truth is just a few clicks away. Our intuitive process is designed for speed and accuracy.
              </p>
            </div>
            <div className="mt-20 grid md:grid-cols-3 gap-8 text-center">
              <div className="step-card scroll-fade-in" style={{ transitionDelay: '0ms' }}>
                <div className="step-card-animation">
                    <svg className="w-10 h-10 icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold mt-8">Provide Your Source</h3>
                <p className="mt-3 text-slate-400">
                  Paste any news article URL, text, or social media link into our analysis engine.
                </p>
              </div>
              <div className="step-card scroll-fade-in" style={{ transitionDelay: '200ms' }}>
                <div className="step-card-animation">
                    <svg className="w-10 h-10 icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold mt-8">AI-Powered Dissection</h3>
                <p className="mt-3 text-slate-400">
                  Our model cross-references sources, detects bias, and analyzes sentiment in real-time.
                </p>
              </div>
              <div className="step-card scroll-fade-in" style={{ transitionDelay: '400ms' }}>
                 <div className="step-card-animation">
                    <svg className="w-10 h-10 icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 </div>
                <h3 className="text-2xl font-bold mt-8">Receive Your Verdict</h3>
                <p className="mt-3 text-slate-400">
                  Get a clear FAKE or REAL classification, complete with a confidence score and a detailed breakdown.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-32">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-white scroll-fade-in">More Than a Verdict</h2>
                <p className="mt-4 text-lg text-slate-400 scroll-fade-in">
                    Go beyond a simple "real" or "fake" label. Our AI provides the tools you need to understand the full story.
                </p>
            </div>
            <div className="mt-20 features-reimagined">
                <div className="feature-list space-y-4 scroll-fade-in">
                    <div className="feature-item">
                        <div className="feature-icon"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div>
                        <div>
                            <h3 className="text-xl font-bold">Bias Detection</h3>
                            <p className="mt-1 text-slate-400">Uncover political and ideological slants.</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
                        <div>
                            <h3 className="text-xl font-bold">Source Vetting</h3>
                            <p className="mt-1 text-slate-400">Assess the credibility of the news source.</p>
                        </div>
                    </div>
                    <div className="feature-item">
                       <div className="feature-icon"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
                        <div>
                            <h3 className="text-xl font-bold">Sentiment Analysis</h3>
                            <p className="mt-1 text-slate-400">Understand the emotional tone of the writing.</p>
                        </div>
                    </div>
                </div>
                <div className="feature-visual-panel scroll-fade-in" style={{ transitionDelay: '200ms' }}>
                   <p className="animated-gradient-text">Ask anything.</p>
                   <p className="mt-4 text-slate-300">Clarifyt's AI can answer follow-up questions to help you dig deeper into any story.</p>
                </div>
            </div>
          </div>
        </section>

        <section className="qa-section">
            <div className="qa-container scroll-fade-in">
                 <h2 className="text-3xl font-bold text-center text-white mb-2">Dig Deeper with Follow-up Questions</h2>
                 <p className="text-center text-slate-400 mb-10">Get the context you need to form your own informed opinion.</p>

                <div className="qa-item">
                    <p className="qa-question">"What is the general political bias of this source?"</p>
                    <p className="qa-answer">AI Response: This source is widely considered to have a left-leaning bias, often focusing on social issues and progressive viewpoints. It is rated as generally reliable in its factual reporting.</p>
                </div>
                <div className="qa-item">
                    <p className="qa-question">"Are there other outlets reporting on this story?"</p>
                    <p className="qa-answer">AI Response: Yes, similar reports have been published by Reuters and Associated Press, both of which are globally recognized as centrist, fact-based news agencies. However, coverage from right-leaning outlets is currently limited.</p>
                </div>
                <div className="qa-item">
                    <p className="qa-question">"Summarize the main arguments in this article."</p>
                    <p className="qa-answer">AI Response: The article's central argument is that the proposed new city tax will disproportionately affect low-income families while providing minimal benefit to public services. It cites data from a recent university study to support this claim.</p>
                </div>
            </div>
        </section>

        <section className="final-cta-section">
            <div className="background-animation">
                <div className="circle-1"></div>
                <div className="circle-2"></div>
            </div>
            <div className="container mx-auto px-6 z-10 relative">
                <h2 className="text-4xl md:text-5xl font-bold text-white scroll-fade-in">Ready to See Clearly?</h2>
                <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto scroll-fade-in">
                    Stop the spread of misinformation. Start your first analysis now and join a community dedicated to truth and clarity.
                </p>
                <div className="mt-10 scroll-fade-in">
                    <Link to="/app" className="cta-button-large">
                        Get Started for Free
                    </Link>
                </div>
            </div>
        </section>
      </main>

      <footer className="bg-slate-900/50 border-t border-slate-800 text-slate-400 py-12">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} Clarifyt. A Final Year M.Tech Project. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;