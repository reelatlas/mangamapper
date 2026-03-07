import { Header } from '@/components/Header';
import { Fingerprint, Zap, Target, HelpCircle, Code, MessageSquare, Heart, LucideIcon } from 'lucide-react';

const SectionHeader = ({ icon: Icon, label }: { icon: LucideIcon; label: string }) => (
  <div className="group/header flex items-center gap-2 mb-3 text-xs text-muted-foreground hover:text-foreground transition-colors duration-300 cursor-default select-none">
    <Icon className="w-3.5 h-3.5 transition-colors duration-300" />
    <span className="max-w-0 opacity-0 group-hover/header:max-w-[20px] group-hover/header:opacity-100 transition-all duration-500 ease-out overflow-hidden whitespace-nowrap">//</span>
    <span>{label}</span>
    <div className="flex items-center gap-1.5 overflow-hidden max-w-0 opacity-0 group-hover/header:max-w-[120px] group-hover/header:opacity-100 transition-all duration-500 ease-out">
      <span className="text-muted-foreground/60">{'>'}</span>
      <Icon className="w-3 h-3 text-syntax-cyan" />
      <Icon className="w-3 h-3 text-syntax-purple" />
      <Icon className="w-3 h-3 text-syntax-pink" />
    </div>
  </div>
);

const About = () => {
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

        <div className="grid gap-6">
          {/* // welcome */}
          <section className="border border-dashed p-5">
            <SectionHeader icon={Fingerprint} label="welcome" />
            <p className="text-sm text-foreground/80 leading-relaxed mb-4">
              welcome <span className="text-syntax-purple">traveler</span>, your anime has ended
            </p>
            <ul className="space-y-1.5 text-sm text-foreground/70 mb-5">
              <li className="flex gap-2">
                <span className="text-muted-foreground">→</span>
                <span>another season is far away</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">→</span>
                <span>what if it never comes</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">→</span>
                <span>the fabric of your being fades each waiting moment</span>
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
                <span>to <span className="text-foreground">reignite your soul</span> and fulfill what was written</span>
              </li>
            </ul>
          </section>

          {/* // features */}
          <section className="border border-dashed p-5">
            <SectionHeader icon={Zap} label="features" />
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
                <span>save <span className="text-syntax-purple">last_watched</span> and <span className="text-syntax-purple">last_read</span> progress</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">→</span>
                <span>manage manga readers of choice for favorite series</span>
              </li>
            </ul>
          </section>

          {/* // pain_points_solved */}
          <section className="border border-dashed p-5">
            <SectionHeader icon={Target} label="pain_points_solved" />
            <ul className="space-y-2.5 text-sm text-foreground/70">
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">→</span>
                <span>existing anime DBs are robust and feature rich, inconvenient for simple anime to manga comparison and tracking</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">→</span>
                <span>manga readers can have long URLs or require many clicks and searches, use readers in the library for cleaner reader management</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">→</span>
                <span>migrate links and bookmarks easily if a manga reader site changes URLs, mirror links shift, disappears, or gets shut down</span>
              </li>
            </ul>
          </section>

          {/* // why_build */}
          <section className="border border-dashed p-5">
            <SectionHeader icon={HelpCircle} label="why_build" />
            <ul className="space-y-2.5 text-sm text-foreground/70">
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">→</span>
                <span>remove the need for a notepad or browser bookmarks to track and manage my favorite anime/manga series</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">→</span>
                <span>a personal project to experiment with and learn AI coding, coding was not possible for me before</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">→</span>
                <span>very niche, curious if any other will find it of use</span>
              </li>
            </ul>
          </section>

          {/* // built_with */}
          <section className="border border-dashed p-5">
            <SectionHeader icon={Code} label="built_with" />
            <div className="text-xs text-muted-foreground space-y-1">
              <p><span className="text-syntax-purple">stack</span>: <span className="text-syntax-green">"React + TypeScript + Tailwind, aniDB API"</span></p>
              <p><span className="text-syntax-purple">tools</span>: <span className="text-syntax-green">"Lovable, Claude, Vercel, Supabase, VSCode, GitHub"</span></p>
            </div>
          </section>

          {/* // feedback */}
          <section className="border border-dashed p-5">
            <SectionHeader icon={MessageSquare} label="feedback" />
            <ul className="space-y-1.5 text-sm text-foreground/70 mb-4">
              <li className="flex gap-2">
                <span className="text-muted-foreground">→</span>
                <span>feedback, suggestions, bug reporting, feature requests all welcome</span>
              </li>
            </ul>
            <p className="text-xs">
              <span className="text-muted-foreground">{'>'} </span>
              <span className="text-syntax-amber">send_to</span>
              <span className="text-muted-foreground">(</span>
              <span className="text-syntax-green">"newestArc@gmail.com"</span>
              <span className="text-muted-foreground">)</span>
            </p>
          </section>

          {/* // support */}
          <section className="border border-dashed p-5">
            <SectionHeader icon={Heart} label="support" />
            <p className="text-sm text-foreground/70 mb-3">
              support goes toward <span className="text-syntax-amber">AI tokens</span>, <span className="text-syntax-amber">API credits</span>, <span className="text-syntax-amber">hosting</span>, <span className="text-syntax-amber">sushi</span>
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
