import { Header } from '@/components/Header';
import { Fingerprint, Zap, Target, HelpCircle, Code, MessageSquare, Heart } from 'lucide-react';

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
            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
              <Fingerprint className="w-3.5 h-3.5" />
              <span>// welcome</span>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed mb-4">
              welcome traveler, your anime has ended
            </p>
            <ul className="space-y-1.5 text-sm text-foreground/70 mb-5">
              <li className="flex gap-2">
                <span className="text-muted-foreground">*</span>
                <span>another season is far away</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">*</span>
                <span>what if it never comes</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">*</span>
                <span>the fabric of your being fades each waiting moment</span>
              </li>
            </ul>
            <p className="text-sm text-foreground/80 leading-relaxed mb-3">
              still yourself, consult your <span className="text-syntax-cyan">mapper</span>
            </p>
            <ul className="space-y-1.5 text-sm text-foreground/70">
              <li className="flex gap-2">
                <span className="text-muted-foreground">*</span>
                <span>find where the anime leaves… and the <span className="text-syntax-green">manga enters</span></span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">*</span>
                <span>this your defining moment</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">*</span>
                <span><span className="text-syntax-green">dive back</span> into the exact chapter</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">*</span>
                <span>to reignite your soul and fulfill what was written</span>
              </li>
            </ul>
          </section>

          {/* // features */}
          <section className="border border-dashed p-5">
            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
              <Zap className="w-3.5 h-3.5" />
              <span>// features</span>
            </div>
            <ul className="space-y-1.5 text-sm text-foreground/70">
              <li className="flex gap-2">
                <span className="text-muted-foreground">*</span>
                <span>match anime episode to manga chapters</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">*</span>
                <span>track your favorite series in library</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">*</span>
                <span>save <span className="text-syntax-purple">last_watched</span> and <span className="text-syntax-purple">last_read</span> progress</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground">*</span>
                <span>manage manga readers of choice for favorite series</span>
              </li>
            </ul>
          </section>

          {/* // pain_points_solved */}
          <section className="border border-dashed p-5">
            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
              <Target className="w-3.5 h-3.5" />
              <span>// pain_points_solved</span>
            </div>
            <ul className="space-y-2.5 text-sm text-foreground/70">
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">*</span>
                <span>existing anime DBs are robust and feature rich, inconvenient for simple anime to manga comparison and tracking</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">*</span>
                <span>manga readers can have long URLs or require many clicks and searches, use readers in the library for cleaner reader management</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">*</span>
                <span>migrate links and bookmarks easily if a manga reader site changes URLs, mirror links shift, disappears, or gets shut down</span>
              </li>
            </ul>
          </section>

          {/* // why_build */}
          <section className="border border-dashed p-5">
            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>// why_build</span>
            </div>
            <ul className="space-y-2.5 text-sm text-foreground/70">
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">*</span>
                <span>remove the need for a notepad or browser bookmarks to track and manage my favorite anime/manga series</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">*</span>
                <span>a personal project to experiment with and learn AI coding, coding was not possible for me before</span>
              </li>
              <li className="flex gap-2">
                <span className="text-muted-foreground shrink-0">*</span>
                <span>very niche, curious if any other will find it of use</span>
              </li>
            </ul>
          </section>

          {/* // built_with */}
          <section className="border border-dashed p-5">
            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
              <Code className="w-3.5 h-3.5" />
              <span>// built_with</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><span className="text-syntax-purple">stack</span>: <span className="text-syntax-green">"React + TypeScript + Tailwind, aniDB API"</span></p>
              <p><span className="text-syntax-purple">tools</span>: <span className="text-syntax-green">"Lovable, Claude, Vercel, Supabase, VSCode, GitHub"</span></p>
            </div>
          </section>

          {/* // feedback */}
          <section className="border border-dashed p-5">
            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>// feedback</span>
            </div>
            <ul className="space-y-1.5 text-sm text-foreground/70 mb-4">
              <li className="flex gap-2">
                <span className="text-muted-foreground">*</span>
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
            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
              <Heart className="w-3.5 h-3.5" />
              <span>// support</span>
            </div>
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
