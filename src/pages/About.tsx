import { Header } from '@/components/Header';
import { Info, Code, MessageSquare, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background font-mono">
      <Header />

      <main className="container py-8 max-w-2xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Info className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">{'>'}</span>
          <span className="text-syntax-cyan">about</span>
        </div>

        <div className="grid gap-6">
          {/* // about */}
          <section className="border border-dashed p-5">
            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
              <Info className="w-3.5 h-3.5" />
              <span>// about</span>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              <span className="text-syntax-cyan">mangaMapper</span> helps you track where anime adaptations
              line up with their manga source material. Find out which chapter to pick up after the latest
              episode, keep tabs on your reading progress, and manage your manga reader sites — all in one place.
            </p>
          </section>

          {/* // built_with */}
          <section className="border border-dashed p-5">
            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
              <Code className="w-3.5 h-3.5" />
              <span>// built_with</span>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed mb-3">
              Built because finding the right manga chapter after finishing an anime season shouldn't require
              a research project. The mapping data is crowd-sourced and community-maintained.
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><span className="text-syntax-purple">stack</span>: <span className="text-syntax-green">"React + TypeScript + Tailwind"</span></p>
              <p><span className="text-syntax-purple">backend</span>: <span className="text-syntax-green">"Lovable Cloud"</span></p>
              <p><span className="text-syntax-purple">built_on</span>: <span className="text-syntax-green">"Lovable"</span></p>
            </div>
          </section>

          {/* // feedback */}
          <section className="border border-dashed p-5">
            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>// feedback</span>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed mb-3">
              Got a suggestion, found a bug, or want to request a feature? Reach out — all feedback is welcome.
            </p>
            <p className="text-xs">
              <span className="text-muted-foreground">{'>'} </span>
              <span className="text-syntax-amber">contact</span>
              <span className="text-muted-foreground">(</span>
              <span className="text-syntax-green">"feedback@mangamapper.app"</span>
              <span className="text-muted-foreground">)</span>
            </p>
          </section>

          {/* // support */}
          <section className="border border-dashed p-5">
            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
              <Heart className="w-3.5 h-3.5" />
              <span>// support</span>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed mb-3">
              mangaMapper runs on API credits and good vibes. If you find it useful and want to help keep
              it running, contributions toward token credits are always appreciated.
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
            <span>// find your next chapter</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
