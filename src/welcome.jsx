// Welcome / splash screen — full-screen brand card shown when the user
// clicks the Kingmaker wordmark in the sidebar. Used as the demo outro:
// shell drops away, you see only the brand + tagline + the throughline
// that the demo just argued.
import React from 'react';
import { Link } from 'react-router-dom';

export default function Welcome() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 isolate">
      {/* Atmospheric gradient — cyan + violet glow over slate-950 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 20% 18%, rgba(34,211,238,0.18) 0%, transparent 60%),' +
            'radial-gradient(ellipse 55% 45% at 82% 80%, rgba(167,139,250,0.20) 0%, transparent 60%),' +
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(15,23,42,0) 30%, rgba(2,6,23,0.6) 100%)',
        }}
      />
      {/* Subtle grid texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,1) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(148,163,184,1) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 80%)',
        }}
      />

      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-6">
        {/* Gemstone mark */}
        <div className="mb-8 relative">
          <span
            aria-hidden="true"
            className="absolute inset-0 -m-6 rounded-full blur-3xl opacity-50"
            style={{
              background:
                'radial-gradient(circle, rgba(34,211,238,0.35), transparent 70%)',
            }}
          />
          <svg viewBox="0 0 24 24" className="relative h-24 w-24 drop-shadow-[0_0_24px_rgba(34,211,238,0.35)]">
            <defs>
              <linearGradient id="welcome-opalg" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#22d3ee" />
                <stop offset="0.5" stopColor="#a78bfa" />
                <stop offset="1" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            <path
              d="M12 2 22 9l-4 12H6L2 9z"
              fill="none"
              stroke="url(#welcome-opalg)"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path
              d="M12 2v19M2 9h20M6 21l6-12 6 12M12 9l-5 12M12 9l5 12"
              fill="none"
              stroke="url(#welcome-opalg)"
              strokeWidth="0.55"
              opacity="0.55"
            />
          </svg>
        </div>

        <h1 className="text-[64px] md:text-[88px] font-bold tracking-[0.18em] text-slate-100 leading-none">
          KINGMAKER
        </h1>

        <p className="mt-5 text-[15px] md:text-[17px] text-slate-300 tracking-wide text-center max-w-xl">
          Mission control for federal R&amp;D proposals.
        </p>

        <p className="mt-2 text-[12.5px] md:text-[13px] text-slate-500 text-center max-w-md">
          From discovery to submission, on the agency's cycle.
        </p>

        <Link
          to="/"
          className="mt-12 inline-flex items-center gap-2 text-[12px] text-slate-400 hover:text-cyan-300 transition"
        >
          <span>Enter workspace</span>
          <span aria-hidden="true">→</span>
        </Link>

        <div className="absolute bottom-6 left-0 right-0 text-center text-[10.5px] tracking-[0.18em] text-slate-600 italic">
          Built for Mars. Deployed on Earth.
        </div>
      </div>
    </div>
  );
}
