import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Fingerprint, Shell, Snail, Cloud, Zap, Target, Goal, Sprout, TreePine, Bot, Rocket, Heart, Bird, SunDim, Rainbow, Copy, Check, LucideIcon } from 'lucide-react';

const SectionHeader = ({ icon: Icon, hoverIcon: HoverIcon, label }: { icon: LucideIcon; hoverIcon: LucideIcon; label: string }) => (
  <div className="group/header flex items-center gap-2 mb-3 text-xs text-muted-foreground group-hover/card:text-foreground transition-colors duration-300 cursor-default select-none">
    <Icon className="w-3.5 h-3.5" />
    <span className="max-w-0 opacity-0 group-hover/card:max-w-[20px] group-hover/card:opacity-100 transition-all duration-500 ease-out overflow-hidden whitespace-nowrap">//</span>
    <span>{label}</span>
    <div className="flex items-center gap-1.5 overflow-hidden max-w-0 opacity-0 group-hover/card:max-w-[120px] group-hover/card:opacity-100 transition-all duration-500 ease-out">
      <span className="text-muted-foreground/60">{'>'}</span>
      <HoverIcon className="w-3 h-3 text-syntax-cyan" />
      <HoverIcon className="w-3 h-3 text-syntax-purple" />
      <HoverIcon className="w-3 h-3 text-syntax-pink" />
    </div>
  </div>
);

const About = () => {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState('welcome');

  const sectionIds = ['welcome', 'features', 'solve-for-pain', 'why-build', 'built-with', 'feedback', 'support'];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background font-mono">
      <Header />

      <main className="container py-8 max-w-2xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Fingerprint className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">{'>'}</span>
          <span className="text-syntax-cyan">about</span>
        </div>

        {/* Section navigation */}
        <nav className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-dashed border-border/50 -mx-5 px-5 py-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          {[
            { id: 'welcome', label: 'welcome' },
            { id: 'features', label: 'features' },
            { id: 'solve-for-pain', label: 'solve_for(pain)' },
            { id: 'why-build', label: 'why_build' },
            { id: 'built-with', label: 'built_with' },
            { id: 'feedback', label: 'feedback' },
            { id: 'support', label: 'support' },
          ].map((item, i) => (
            <span key={item.id} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-muted-foreground/40">/</span>}
              <button
                onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className={`transition-colors duration-200 ${activeSection === item.id ? 'text-foreground' : 'hover:text-foreground'}`}
              >
                {activeSection === item.id && <span className="text-syntax-cyan">{'> '}</span>}
                {item.label}
              </button>
            </span>
          ))}
        </nav>

        <div className="grid gap-6">
          {/* // welcome */}
          <section id="welcome" className="group/card border border-transparent border-dashed hover:border-border p-5 transition-colors duration-300 scroll-mt-14">
            <SectionHeader icon={Shell} hoverIcon={Snail} label="welcome" />
            <p className="text-sm text-foreground/80 leading-relaxed mb-4">
              welcome <span className="text-syntax-purple">traveler</span>, your anime ended
            </p>
            <ul className="space-y-1.5 text-sm text-foreground/70 mb-5">
              <li className="flex gap-2">
                <span className="text-muted-foreground">→</span>
                <span>another season is far away</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">→</span>
                <span>what if it never comes?</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">→</span>
                <span>the fabric of your being fades each waiting moment...</span>
              </li>
            </ul>
            <p className="text-sm text-foreground/80 leading-relaxed mb-3">
              still yourself, consult your <span className="text-syntax-cyan">mapper</span>
            </p>
            <ul className="space-y-1.5 text-sm text-foreground/70">
              <li className="flex gap-2">
                <span className="text-muted-foreground">→</span>
                <span>find where the <span className="text-syntax-amber">anime leaves…</span> and the <span className="text-syntax-green">manga enters</span></span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">→</span>
                <span>this your defining moment</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">→</span>
                <span>dive back into the exact chapter</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">→</span>
                <span><span className="text-foreground">reignite your soul</span> and fulfill what was written</span>
              </li>
            </ul>
          </section>

          {/* // features */}
          <section id="features" className="group/card border border-transparent border-dashed hover:border-border p-5 transition-colors duration-300 scroll-mt-4">
            <SectionHeader icon={Cloud} hoverIcon={Zap} label="features" />
            <ul className="space-y-1.5 text-sm text-foreground/70">
              <li className="flex gap-2">
                <span className="text-muted-foreground">→</span>
                <span>match anime episode to manga chapters</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">→</span>
                <span>track your favorite series in library</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">→</span>
                <span>save last_watched and last_read progress</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">→</span>
                <span>manage manga readers for favorite series</span>
              </li>
            </ul>
          </section>

          {/* // pain_points_solved */}
          <section id="solve-for-pain" className="group/card border border-transparent border-dashed hover:border-border p-5 transition-colors duration-300 scroll-mt-4">
            <SectionHeader icon={Target} hoverIcon={Goal} label="solve_for(pain)" />
            <ul className="space-y-2.5 text-sm text-foreground/70">
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">→</span>
                <span>existing anime DBs are robust and feature rich, inconvenient for simple anime to manga tracking</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">→</span>
                <span>long URLs or nested series links are hard to manage, need clean reader management</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">→</span>
                <span>reader sites change URLs, mirror links shift, disappear, or get shut down, no easy way to migrate links and bookmarks</span>
              </li>
            </ul>
          </section>

          {/* // why_build */}
          <section id="why-build" className="group/card border border-transparent border-dashed hover:border-border p-5 transition-colors duration-300 scroll-mt-4">
            <SectionHeader icon={SunDim} hoverIcon={Rainbow} label="why_build" />
            <ul className="space-y-2.5 text-sm text-foreground/70">
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">→</span>
                <span>no more notepads and browser bookmarks to track favorite anime/manga series</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">→</span>
                <span>personal project to experiment with AI coding, coding was not possible for me before</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">→</span>
                <span>very niche, will any find it of use?</span>
              </li>
            </ul>
          </section>

          {/* // built_with */}
          <section id="built-with" className="group/card border border-transparent border-dashed hover:border-border p-5 transition-colors duration-300 scroll-mt-4">
            <SectionHeader icon={Bot} hoverIcon={Rocket} label="built_with" />
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-muted-foreground">→</span>
                <span><span className="text-syntax-purple">frontend</span>: <span className="text-syntax-green">"react, typescript, tailwind css"</span></span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">→</span>
                <span><span className="text-syntax-purple">backend</span>: <span className="text-syntax-green">"supabase, aniDB api"</span></span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">→</span>
                <span><span className="text-syntax-purple">deployment</span>: <span className="text-syntax-green">"vercel"</span></span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">→</span>
                <span><span className="text-syntax-purple">dev_flow</span>: <span className="text-syntax-green">"VSCode, github"</span></span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">→</span>
                <span><span className="text-syntax-purple">ai_flow</span>: <span className="text-syntax-green">"lovable, claude"</span></span>
              </li>
            </ul>
          </section>

          {/* // feedback */}
          <section id="feedback" className="group/card border border-transparent border-dashed hover:border-border p-5 transition-colors duration-300 scroll-mt-4">
            <SectionHeader icon={Sprout} hoverIcon={TreePine} label="feedback" />
            <ul className="space-y-1.5 text-sm text-foreground/70 mb-4">
              <li className="flex gap-2">
                <span className="text-muted-foreground">→</span>
                <span>feedback, suggestions, bug reports, feature requests welcome</span>
              </li>
            </ul>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">{'>'} </span>
              <span className="text-syntax-amber">send_to</span>
              <span className="text-muted-foreground">(</span>
              <span className="text-syntax-green">"newestArc@gmail.com"</span>
              <span className="text-muted-foreground">)</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('newestArc@gmail.com');
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="ml-1 text-muted-foreground hover:text-foreground transition-colors duration-200"
                title="Copy email"
              >
                {copied ? <Check className="w-3 h-3 text-syntax-green" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </section>

          {/* // support */}
          <section id="support" className="group/card border border-transparent border-dashed hover:border-border p-5 transition-colors duration-300 scroll-mt-4">
            <SectionHeader icon={Bird} hoverIcon={Heart} label="support" />
            <p className="text-sm text-foreground/70 mb-3">
              $$$ for <span className="text-syntax-amber">sushi</span>, <span className="text-syntax-amber">ai tokens</span>, <span className="text-syntax-amber">api credits</span>, <span className="text-syntax-amber">hosting</span>
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="text-syntax-purple">donations</span>: <span className="text-syntax-amber">coming_soon</span>
              <span className="text-foreground/30"> // payment link TBD</span>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-dashed mt-16">
        <div className="container py-6 text-center text-xs text-muted-foreground">
          <p>
            <span className="text-foreground/40">mangaMapper</span>{' '}
            <span>// your journey continues</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
