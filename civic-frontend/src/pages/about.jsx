/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import {
  HeartHandshake,
  Users,
  Target,
  Award,
  Globe,
  Clock,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react';

const AboutPage = () => {
  const stats = [
    { number: '10,000+', label: 'Issues Resolved', icon: CheckCircle },
    { number: '50+', label: 'Cities Covered', icon: MapPin },
    { number: '24h', label: 'Average Response Time', icon: Clock },
    { number: '95%', label: 'User Satisfaction', icon: Award }
  ];

  const values = [
    {
      icon: HeartHandshake,
      title: 'Community First',
      description: 'We believe in empowering communities to take charge of their surroundings and work together for better civic infrastructure.'
    },
    {
      icon: Shield,
      title: 'Transparency',
      description: 'Every complaint, assignment, and resolution is tracked transparently so citizens can see the entire process.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Bringing together citizens, municipal workers, and authorities to create sustainable solutions.'
    },
    {
      icon: Globe,
      title: 'Sustainability',
      description: 'Building systems that not only fix problems but prevent them from recurring through data-driven insights.'
    }
  ];

  const team = [
    {
      name: 'Tech Innovators',
      role: 'Technology Team',
      description: 'Building cutting-edge solutions to make civic engagement seamless and efficient.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Municipal Partners',
      role: 'Government Collaboration',
      description: 'Working with local authorities to ensure quick resolution and policy support.',
      color: 'from-green-500 to-teal-500'
    },
    {
      name: 'Community Champions',
      role: 'Ground Team',
      description: 'Local volunteers and activists who bridge the gap between citizens and authorities.',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" style={{
      '--glass-shadow': '0 40px 120px rgba(0,0,0,0.35)',
      '--glass-border': 'rgba(255,255,255,0.12)'
    }}>
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_35%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.18),_transparent_30%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/10 p-10 shadow-[var(--glass-shadow)] backdrop-blur-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"></div>
            <div className="absolute left-8 top-8 h-24 w-24 rounded-full bg-cyan-400/10 blur-3xl"></div>
            <div className="absolute right-10 bottom-10 h-28 w-28 rounded-full bg-purple-500/10 blur-3xl"></div>
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 p-5 text-cyan-300 shadow-lg shadow-cyan-500/10 mb-8"
              >
                <HeartHandshake className="w-10 h-10" />
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-6">
                About Our Mission
              </h1>
              <p className="mx-auto max-w-3xl text-base md:text-lg text-slate-300 leading-relaxed">
                We're transforming civic issue resolution with a smart, transparent platform that connects citizens, authorities, and field teams.
                Report issues, track progress, and support safer communities with a beautiful experience.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                  className="relative overflow-hidden rounded-[28px] border border-[var(--glass-border)] bg-white/10 p-6 text-center shadow-[0_24px_60px_rgba(15,23,42,0.25)] backdrop-blur-xl"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-slate-200 to-purple-500 opacity-90"></div>
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 border border-white/10 text-cyan-300 shadow-lg shadow-cyan-500/10">
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-bold text-white">{stat.number}</div>
                    <div className="text-sm uppercase tracking-[0.2em] text-slate-400">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Our Story
            </h2>
            <div className="space-y-6 text-slate-300 leading-relaxed">
              <p>
                Founded to bridge the gap between citizens and municipal authorities, our platform makes civic issue reporting fast, transparent, and easy.
              </p>
              <p>
                From simple reports of damaged roads to complex community issues, we use technology to keep people informed and empower local action.
              </p>
              <p>
                Today, we serve cities with reliable workflows, smarter assignments, and clear visibility so everyone can contribute to a safer public space.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-cyan-400 to-purple-500 px-8 py-4 text-base font-semibold text-slate-950 shadow-[0_20px_60px_rgba(56,189,248,0.25)] transition-all duration-300"
            >
              Read Our Full Story
              <ArrowRight className="ml-3 h-5 w-5" />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[40px] border border-[var(--glass-border)] bg-white/10 p-10 shadow-[var(--glass-shadow)] backdrop-blur-2xl">
              <div className="absolute left-6 top-6 h-24 w-24 rounded-full bg-cyan-400/10 blur-3xl"></div>
              <div className="absolute right-6 bottom-6 h-28 w-28 rounded-full bg-purple-500/10 blur-3xl"></div>
              <div className="relative z-10 text-white">
                <div className="text-6xl mb-5">🏙️</div>
                <h3 className="text-3xl font-bold mb-4">Building Better Cities Together</h3>
                <p className="text-slate-200 leading-relaxed">
                  Technology should serve people first. We make civic engagement accessible, transparent, and effective for every neighborhood.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Our Values
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              These core principles guide every choice we make and every feature we build.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative overflow-hidden rounded-[32px] border border-[var(--glass-border)] bg-white/10 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.25)] backdrop-blur-2xl"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-slate-200 to-purple-500 opacity-90"></div>
                <div className="relative z-10 space-y-5 text-left">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 border border-white/10 text-cyan-300 shadow-lg shadow-cyan-500/10">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{value.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Our Ecosystem
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              A connected network of people and partners advancing civic change.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="relative overflow-hidden rounded-[32px] border border-[var(--glass-border)] bg-white/10 p-8 text-center shadow-[0_24px_60px_rgba(15,23,42,0.25)] backdrop-blur-2xl"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-slate-200 to-purple-500 opacity-90"></div>
                <div className="relative z-10 space-y-5">
                  <div className={`relative mx-auto flex h-24 w-24 items-center justify-center rounded-[24px] bg-gradient-to-r ${member.color} text-white shadow-lg shadow-slate-900/20`}>
                    <Users className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{member.name}</h3>
                  <div className="text-cyan-300 font-semibold">{member.role}</div>
                  <p className="text-slate-300 leading-relaxed">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-slate-950/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[40px] border border-[var(--glass-border)] bg-white/10 p-12 text-center shadow-[var(--glass-shadow)] backdrop-blur-2xl"
          >
            <div className="absolute left-8 top-8 h-24 w-24 rounded-full bg-cyan-400/10 blur-3xl"></div>
            <div className="absolute right-8 bottom-8 h-28 w-28 rounded-full bg-purple-500/10 blur-3xl"></div>
            <div className="relative z-10">
              <Sparkles className="mx-auto mb-6 h-16 w-16 text-cyan-300" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Join the Movement</h2>
              <p className="mx-auto max-w-2xl text-slate-300 mb-10">
                Be part of the change. Together, we can build cleaner, safer, and more sustainable communities.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-cyan-400 to-purple-500 px-8 py-4 text-base font-semibold text-slate-950 shadow-[0_20px_60px_rgba(56,189,248,0.25)] transition-all duration-300"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Report an Issue
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center rounded-3xl border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-white/15"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Contact Us
                </motion.button>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3 text-slate-300">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Phone</div>
                  <div className="mt-2 text-base">+1 (555) 123-4567</div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Email</div>
                  <div className="mt-2 text-base">hello@civicresolve.com</div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Location</div>
                  <div className="mt-2 text-base">50+ Cities in India</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;