import { useState } from 'react';
import { Header } from '@/components/Header';
import { Fingerprint, Shell, Snail, Cloud, Zap, Target, Goal, Sprout, TreePine, Bot, Rocket, Heart, Bird, SunDim, Rainbow, Copy, Check, ExternalLink, LucideIcon } from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { TripleArrow } from '@/components/TripleArrow';

type SectionKey = 'welcome' | 'features' | 'pain' | 'why' | 'built' | 'feedback' | 'support';

const SectionHeader = ({ icon: Icon, hoverIcon: HoverIcon, label, isOpen }: { icon: LucideIcon; hoverIcon: LucideIcon; label: string; isOpen: boolean }) => (
  <div className="group/header flex items-center gap-2 text-xs text-muted-foreground group-hover/card:text-foreground transition-colors duration-300 select-none">
    <Icon className="w-3.5 h-3.5" />
    <span className="max-w-0 opacity-0 group-hover/card:max-w-[20px] group-hover/card:opacity-100 transition-all duration-500 ease-out overflow-hidden whitespace-nowrap">//</span>
    <span>{label}</span>
    <div className="flex items-center gap-1.5 overflow-hidden max-w-0 opacity-0 group-hover/card:max-w-[120px] group-hover/card:opacity-100 transition-all duration-500 ease-out">
      <span className="text-muted-foreground/60">{'>'}</span>
      <HoverIcon className="w-3 h-3 text-syntax-cyan" />
      <HoverIcon className="w-3 h-3 text-syntax-purple" />
      <HoverIcon className="w-3 h-3 text-syntax-pink" />
    </div>
    <TripleArrow collapsed={!isOpen} compact className="ml-auto" />
  </div>
);

const CRYPTO_WALLETS = [
  { ticker: 'btc', address: 'bc1qr3ds2qraxelt3kan0nn7h2k0ky30aecg28l3a4' },
  { ticker: 'eth', address: '0xDFB385030eED21389057056c0811608A97Ca5e26' },
  { ticker: 'sol', address: 'D9XA7UNynfCtuNJX7FEg5E6C7eDhkePUkKKSodaeSYRs' },
  { ticker: 'doge', address: 'DLkjxfspJanrSeMbmYzTepQxtV57edxErM' },
  { ticker: 'ltc', address: 'ltc1qgg7yqyx2vd4wjfryzt62gmx7d946qs3e9s3v6y' },
  { ticker: 'xmr', address: '4AHSPyQM3iBYe14TsYUUWkH4MCStrzh7UGFefUs6mjoAN1QGztwcHCfG7SAdP6SVL1SWmPe9UnKS2Fxy3S2kzUv8EDGLVW8' },
];

const STRIPE_LINKS = [
  { label: 'one_time', url: 'https://donate.stripe.com/3cIeVf1Rz9NG7CP2FycbC01' },
  { label: 'recurring_sub', url: 'https://buy.stripe.com/6oUbJ3eEl6Bue1dfskcbC02' },
];

const truncateAddress = (addr: string) =>
  addr.length > 16 ? `${addr.slice(0, 8)}...${addr.slice(-4)}` : addr;

const About = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [stripeOpen, setStripeOpen] = useState(false);
  const [cryptoOpen, setCryptoOpen] = useState(false);
  const [openSection, setOpenSection] = useState<SectionKey | null>('welcome');

  const toggleSection = (key: SectionKey) => {
    setOpenSection(prev => prev === key ? null : key);
  };

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

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

        <div className="grid gap-0">
          {/* // welcome */}
          <section onClick={() => toggleSection('welcome')} className="group/card cursor-pointer border border-transparent border-dashed hover:border-border p-5 transition-colors duration-300">
            <SectionHeader icon={Shell} hoverIcon={Snail} label="welcome" isOpen={openSection === 'welcome'} />
            {openSection === 'welcome' && (
              <div className="mt-3">
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
                    <span>dive into the next chapter</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-muted-foreground">→</span>
                    <span><span className="text-foreground">reignite your soul</span> and fulfill what was written</span>
                  </li>
                </ul>
              </div>
            )}
          </section>

          {/* // features */}
          <section onClick={() => toggleSection('features')} className="group/card cursor-pointer border border-transparent border-dashed hover:border-border p-5 transition-colors duration-300">
            <SectionHeader icon={Cloud} hoverIcon={Zap} label="features" isOpen={openSection === 'features'} />
            {openSection === 'features' && (
              <ul className="mt-3 space-y-1.5 text-sm text-foreground/70">
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
            )}
          </section>

          {/* // pain_points_solved */}
          <section onClick={() => toggleSection('pain')} className="group/card cursor-pointer border border-transparent border-dashed hover:border-border p-5 transition-colors duration-300">
            <SectionHeader icon={Target} hoverIcon={Goal} label="solve_for(pain)" isOpen={openSection === 'pain'} />
            {openSection === 'pain' && (
              <ul className="mt-3 space-y-2.5 text-sm text-foreground/70">
                <li className="flex gap-2">
                  <span className="text-muted-foreground shrink-0">→</span>
                  <span>simple anime to manga tracking, existing anime DBs or all-in-one readers are robust and feature rich</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-muted-foreground shrink-0">→</span>
                  <span>clean reader management for long urls or nested series links</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-muted-foreground shrink-0">→</span>
                  <span>easily migrate bookmarks when urls or mirrors change, disappear, or get shut down</span>
                </li>
              </ul>
            )}
          </section>

          {/* // why_build */}
          <section onClick={() => toggleSection('why')} className="group/card cursor-pointer border border-transparent border-dashed hover:border-border p-5 transition-colors duration-300">
            <SectionHeader icon={SunDim} hoverIcon={Rainbow} label="why_build" isOpen={openSection === 'why'} />
            {openSection === 'why' && (
              <ul className="mt-3 space-y-2.5 text-sm text-foreground/70">
                <li className="flex gap-2">
                  <span className="text-muted-foreground shrink-0">→</span>
                  <span>no more notepads, spreadsheets, browser bookmarks to track favorite anime/manga series</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-muted-foreground shrink-0">→</span>
                  <span>personal project to experiment with AI coding, coding was not possible for me before</span>
                </li>
              </ul>
            )}
          </section>

          {/* // built_with */}
          <section onClick={() => toggleSection('built')} className="group/card cursor-pointer border border-transparent border-dashed hover:border-border p-5 transition-colors duration-300">
            <SectionHeader icon={Bot} hoverIcon={Rocket} label="built_with" isOpen={openSection === 'built'} />
            {openSection === 'built' && (
              <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-muted-foreground">→</span>
                  <span><span className="text-syntax-purple">frontend</span>: <span className="text-syntax-green">"react, typescript, tailwind css"</span></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-muted-foreground">→</span>
                  <span><span className="text-syntax-purple">backend</span>: <span className="text-syntax-green">"supabase, anilist api"</span></span>
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
            )}
          </section>

          {/* // feedback */}
          <section onClick={() => toggleSection('feedback')} className="group/card cursor-pointer border border-transparent border-dashed hover:border-border p-5 transition-colors duration-300">
            <SectionHeader icon={Sprout} hoverIcon={TreePine} label="feedback" isOpen={openSection === 'feedback'} />
            {openSection === 'feedback' && (
              <div className="mt-3">
                <ul className="space-y-1.5 text-sm text-foreground/70 mb-4">
                  <li className="flex gap-2">
                    <span className="text-muted-foreground">→</span>
                    <span>feedback, suggestions, bug reports, feature requests welcome</span>
                  </li>
                </ul>
                <div className="flex items-center text-xs select-none">
                  <span
                    onClick={(e) => { e.stopPropagation(); handleCopy('email', 'newestArc@gmail.com'); }}
                    className="group/copy inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="text-muted-foreground">{'>'}</span>
                    <span><span className="text-syntax-amber">send_to</span><span className="text-muted-foreground">(</span><span className="text-syntax-green">"newestArc@gmail.com"</span><span className="text-muted-foreground">)</span></span>
                    <span className="ml-1 inline-flex items-center gap-1 text-muted-foreground group-hover/copy:text-foreground transition-colors duration-200">
                      {copiedKey === 'email' ? (
                        <Check className="w-3 h-3 text-syntax-green" />
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="max-w-0 opacity-0 group-hover/copy:max-w-[100px] group-hover/copy:opacity-100 transition-all duration-300 overflow-hidden whitespace-nowrap text-muted-foreground">
                            copy(<span className="text-syntax-amber">email</span>)
                          </span>
                        </>
                      )}
                    </span>
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* // support */}
          <section onClick={() => toggleSection('support')} className="group/card cursor-pointer border border-transparent border-dashed hover:border-border p-5 transition-colors duration-300">
            <SectionHeader icon={Bird} hoverIcon={Heart} label="support" isOpen={openSection === 'support'} />
            {openSection === 'support' && (
              <div className="mt-3">
                <p className="text-sm text-foreground/70 mb-4">
                  $$$ for <span className="text-syntax-amber">sushi</span>, <span className="text-syntax-amber">gundams</span>, <span className="text-syntax-amber">s-tier relics</span>, <span className="text-syntax-amber">ai tokens</span>, <span className="text-syntax-amber">api credits</span>, <span className="text-syntax-amber">hosting</span>
                </p>

                {/* Stripe donate */}
                <Collapsible open={stripeOpen} onOpenChange={setStripeOpen} className="mb-4">
                  <CollapsibleTrigger onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer select-none">
                    <span className="text-muted-foreground">{'>'}</span>
                    <span className="text-syntax-cyan">stripe_donate</span>
                    <TripleArrow collapsed={!stripeOpen} compact />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 ml-4 space-y-1.5">
                    {STRIPE_LINKS.map(({ label, url }) => (
                      <div
                        key={label}
                        className="flex items-center text-xs select-none"
                      >
                        <span
                          onClick={(e) => { e.stopPropagation(); window.open(url, '_blank'); }}
                          className="group/link inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span className="text-muted-foreground">→</span>
                          <span className="text-syntax-green">{label}</span>
                          <span className="inline-flex items-center text-muted-foreground group-hover/link:text-foreground transition-colors duration-200">
                            <span className="max-w-0 opacity-0 group-hover/link:max-w-[150px] group-hover/link:opacity-100 transition-all duration-300 overflow-hidden whitespace-nowrap inline-flex items-center">
                              <span className="text-muted-foreground mr-1">{'>'}</span>
                              <span className="text-muted-foreground">new_tab(</span><ExternalLink className="w-3 h-3 text-syntax-amber" style={{ margin: 0, padding: 0, display: 'inline-block', verticalAlign: 'middle' }} /><span className="text-muted-foreground">)</span>
                            </span>
                          </span>
                        </span>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                {/* Crypto wallets */}
                <Collapsible open={cryptoOpen} onOpenChange={setCryptoOpen}>
                  <CollapsibleTrigger onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer select-none">
                    <span className="text-muted-foreground">{'>'}</span>
                    <span className="text-syntax-cyan">crypto_wallets</span>
                    <TripleArrow collapsed={!cryptoOpen} compact />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 ml-4 space-y-1.5">
                    {CRYPTO_WALLETS.map(({ ticker, address }) => (
                      <div
                        key={ticker}
                        className="flex items-center text-xs select-none"
                      >
                        <span
                          onClick={(e) => { e.stopPropagation(); handleCopy(ticker, address); }}
                          className="group/copy inline-flex items-center gap-2 cursor-pointer"
                        >
                          <span className="text-muted-foreground">→</span>
                          <span className="text-syntax-purple w-10">{ticker}</span>
                          <span className="text-syntax-green font-mono">{truncateAddress(address)}</span>
                          <span className="ml-1 inline-flex items-center gap-1 text-muted-foreground group-hover/copy:text-foreground transition-colors duration-200">
                            {copiedKey === ticker ? (
                              <Check className="w-3 h-3 text-syntax-green" />
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span className="max-w-0 opacity-0 group-hover/copy:max-w-[150px] group-hover/copy:opacity-100 transition-all duration-300 overflow-hidden whitespace-nowrap text-muted-foreground">
                                  copy(<span className="text-syntax-amber">{ticker}_address</span>)
                                </span>
                              </>
                            )}
                          </span>
                        </span>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}
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
