import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, type Variants } from 'motion/react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { usePrefersReducedMotion } from '../motion-utils';

interface HeroProps {
  onEnterPlatform: () => void;
  onRegister: () => void;
}

const CYCLE_MS = 20000;

interface HeroPhase {
  badge: string;
  heading: React.ReactNode;
  sub: string;
}

const PHASES: HeroPhase[] = [
  {
    badge: 'Multi-Sig Escrow Validator Active',
    heading: (
      <>
        Secure Digital Trade in <span className="text-purple-300">Nigeria</span> With Absolute Trust.
      </>
    ),
    sub: 'Automated multi-signature escrows for buying and selling phones, laptops, and digital services with zero trust deficits.'
  },
  {
    badge: 'Real-Time Network Verification',
    heading: (
      <>
        Every Transaction, <span className="text-fuchsia-300">Verified In Real Time.</span>
      </>
    ),
    sub: 'Every escrow is checked, synced, and settled across a validator mesh built for zero-compromise trading.'
  },
  {
    badge: '18,000+ Verified Traders Online',
    heading: (
      <>
        A Trusted Network of <span className="text-indigo-300">Verified Traders.</span>
      </>
    ),
    sub: 'Join a growing web of buyers and sellers protected by automated, tamper-proof escrow logic.'
  }
];

export const Hero: React.FC<HeroProps> = ({ onEnterPlatform, onRegister }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [phaseIndex, setPhaseIndex] = useState(0);
  const phase = PHASES[phaseIndex];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % PHASES.length);
    }, CYCLE_MS);
    return () => clearInterval(interval);
  }, []);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } }
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <div ref={sectionRef} className="relative min-h-screen py-24 overflow-hidden text-center bg-[#0a0612]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#1e1030_0%,#0a0612_55%,#050308_100%)]" />

      <motion.div
        style={{ opacity }}
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto px-4 space-y-8 relative z-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`badge-${phaseIndex}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-purple-200 shadow-lg shadow-purple-900/20"
          >
            <motion.span
              animate={reduced ? {} : { scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ShieldCheck className="w-4 h-4 text-purple-300" />
            </motion.span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">{phase.badge}</span>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.h1
            key={`heading-${phaseIndex}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl font-display font-black text-white tracking-tight leading-[1.1] max-w-3xl mx-auto"
          >
            {phase.heading}
          </motion.h1>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={`sub-${phaseIndex}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="text-sm md:text-base text-slate-300/80 max-w-xl mx-auto leading-relaxed"
          >
            {phase.sub}
          </motion.p>
        </AnimatePresence>

        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={onEnterPlatform}
            className="w-full sm:w-auto px-8 py-4 bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold rounded-2xl shadow-xl shadow-purple-500/30 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            Launch Trading Portal <ArrowRight className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.08)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onRegister}
            className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white text-xs font-bold rounded-2xl border border-white/15 shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            Register Merchant Account
          </motion.button>
        </motion.div>

        <motion.div
          variants={item}
          className="pt-6 flex items-center justify-center gap-6 text-[10px] font-mono text-slate-400"
        >
          <span>₦2.4B+ Escrowed</span>
          <span className="w-1 h-1 rounded-full bg-purple-400/40" />
          <span>18,000+ Verified Traders</span>
        </motion.div>
      </motion.div>
    </div>
  );
};