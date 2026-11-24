import { useEffect, useId, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { GovWellLogo } from '@/components/ui/flag-mark';
import { SegmentedControl, SegmentedControlItem } from '@/components/ui/segmented-control';
import { cn } from '@/lib/utils';

import {
  AiChatSparkIcon,
  AlertDiamondIcon,
  HouseBuildingIcon,
  IdCardIcon,
  LanguageIcon,
  LayoutDashboardIcon,
  MapEditIcon,
  ReceiptIcon,
  SendIcon,
} from './icons';

// A sample of a town's public portal on GovWell: an aerial photo of the town
// with "Powered by GovWell" and Sign in at the top left, the town's name and
// wordmark bottom left, and the town's AI ("What can we help with?") in a
// frosted-glass box on the right (under the name on a phone), its suggestions
// taking turns to wear the AI's gradient outline. Then the online services as
// cards and a footer with who to call. It's set as the City of Twinsburg, Ohio,
// with the city's logo and the public contacts its live portal lists. Nothing
// is sent; buttons say so. Open it with ?example=portal.

const CITY = { name: 'City of Twinsburg', state: 'OH', short: 'Twinsburg' };

const SERVICES: { icon: ReactNode; title: string; description: string }[] = [
  {
    icon: <HouseBuildingIcon />,
    title: 'Building Permits',
    description:
      'Apply for a building permit. Projects may include new construction, additions, remodels, or trade work like electrical, plumbing, or mechanical.',
  },
  { icon: <IdCardIcon />, title: 'Business Licenses', description: 'Apply for, renew, and manage all business and professional licenses.' },
  {
    icon: <AlertDiamondIcon />,
    title: 'Code Complaint',
    description:
      'Submit a complaint to report potential code violations affecting property maintenance, zoning, safety, or nuisance issues in your area.',
  },
  {
    icon: <ReceiptIcon />,
    title: 'Contractor Registration',
    description: 'Register as a contractor to meet local requirements before performing work or applying for permits.',
  },
  {
    icon: <MapEditIcon />,
    title: 'Planning & Zoning Applications',
    description:
      'Submit a Planning & Zoning application. This is required for land use changes, site developments, subdivisions, or requests such as variances and conditional uses.',
  },
  { icon: <LayoutDashboardIcon />, title: 'Public Dashboards', description: 'Search for Addresses, Parcels, and Contractor Registrations' },
];

const PROMPTS = [
  'Help me find the right form',
  'What things can you help me with?',
  'Look up a record',
  'Ask questions about codes',
  'Estimate fees for my project',
];

const CONTACTS = [
  { team: 'Building Department', email: 'Bdinfo@twinsburg.oh.us', phone: '330-963-6270' },
  { team: 'Planning and Zoning', email: 'zoning@twinsburg.oh.us', phone: '330-486-1387' },
];

const link =
  'underline decoration-1 underline-offset-4 outline-none hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-hope';

export function SamplePortal() {
  const id = useId();
  const [question, setQuestion] = useState('');
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [note, setNote] = useState<string | null>(null);
  // the suggestion whose turn it is to wear the AI's gradient outline. It moves
  // down the list every 2s, holds while the pointer or focus is on the list
  // (on the one pointed at or focused), and stays on the first under reduced
  // motion
  const [turn, setTurn] = useState(0);
  const [held, setHeld] = useState(false);
  useEffect(() => {
    if (held || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const tick = window.setInterval(() => setTurn((i) => (i + 1) % PROMPTS.length), 2000);
    return () => window.clearInterval(tick);
  }, [held]);
  const town = CITY.short;

  const ask = (text: string) => {
    if (!text.trim()) return;
    setNote(`In GovWell, ${town} AI would answer “${text.trim()}” here. This sample doesn’t send anything.`);
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    ask(question);
  };
  const notHere = (what: string) => setNote(`${what} opens in GovWell. This sample doesn’t include it.`);

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      {/* for the demo only, as on the other sample pages: a black bar with a
          white ghost button (Hope with black type on hover) */}
      <div className="bg-slate px-4 py-2">
        <a href="?example=app#/insights" className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'text-soft-white' })}>
          <ArrowLeft data-icon="inline-start" /> Back
        </a>
      </div>

      <main className="flex-1">
        {/* the hero: an aerial photo of Twinsburg fading to Soft Black at the
            bottom, the town's name bottom left and the ask box in frosted glass
            on the right. On a phone they stack: the photo, the name, then the
            box on the black below */}
        <section aria-labelledby={`${id}-ask`} className="relative isolate overflow-hidden bg-soft-black text-soft-white">
          <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[36rem] md:inset-y-0 md:h-auto">
            {/* decorative, so no alt text. On a phone the crop holds the barn
                and the farmhouse, left of the photo's middle */}
            <img
              src={`${import.meta.env.BASE_URL}sample/twinsburg-aerial.jpg`}
              alt=""
              className="size-full object-cover object-[30%_50%] md:object-center"
            />
            {/* behind Powered by and Sign in */}
            <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-soft-black/50 via-soft-black/20 via-50% to-transparent" />
            {/* the bottom fades to Soft Black, under the town's name */}
            <div className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-b from-transparent via-soft-black/70 via-55% to-soft-black md:h-2/3 md:via-soft-black/50 md:via-60%" />
          </div>

          {/* Powered by GovWell at the left, Sign in at the right, its edge in line with the ask box below */}
          <header className="flex h-16 items-center justify-between gap-8 px-4 md:px-12">
            <p className="flex items-center gap-2 text-xs font-light">
              Powered by <GovWellLogo title="GovWell" className="h-4 text-soft-white" />
            </p>
            <Button
              size="sm"
              className="shrink-0 bg-soft-white text-slate hover:bg-hope hover:text-slate"
              onClick={() => notHere('Signing in')}
            >
              Sign in
            </Button>
          </header>

          <div className="grid gap-8 px-4 pt-48 pb-10 md:min-h-[40rem] md:grid-cols-[minmax(0,1fr)_minmax(0,38rem)] md:items-end md:gap-12 md:px-12 md:pt-4 md:pb-12">
            {/* the town: the city's wordmark on a Soft White tile, its name,
                and Public Portal, all flush left with Powered by. The name and
                Public Portal are pulled left by their first letter's side
                bearing (C 0.037em, P 0.078em in GT Standard), so their ink,
                not their boxes, lines up with the tile's edge */}
            <div className="flex flex-col gap-4 md:pb-2">
              <div className="flex size-20 items-center justify-center rounded-[3px] bg-soft-white">
                <img src={`${import.meta.env.BASE_URL}sample/twinsburg-logo.svg`} alt="Twinsburg, Ohio" className="h-auto w-[84%]" />
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="-ml-[0.037em] text-4xl leading-tight font-normal tracking-tight sm:text-5xl lg:text-6xl">
                  {CITY.name}, {CITY.state}
                </h1>
                <p className="-ml-[0.078em] text-lg font-light text-ash">Public Portal</p>
              </div>
            </div>

            {/* the ask box: frosted glass with a white hairline and a soft
                white glow. Inside, the colours are turned round (light type
                throughout) so the shared controls read on the grey glass */}
            <form
              onSubmit={submit}
              className="flex flex-col gap-8 rounded-[3px] border border-soft-white/70 bg-cement/35 px-6 py-10 shadow-[0_0_32px_rgb(250_250_249/0.3)] backdrop-blur-md [--foreground:var(--soft-white)] [--muted-foreground:var(--soft-white)] md:self-stretch md:px-8 md:py-12"
            >
              <div className="flex flex-col gap-1 text-center">
                <h2 id={`${id}-ask`} className="text-2xl leading-tight font-normal tracking-tight md:text-3xl">
                  What can we help with?
                </h2>
                <p className="text-sm text-muted-foreground md:text-base">Get instant answers from {town} AI</p>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="flex w-full items-center gap-2 rounded-[3px] border-2 border-transparent bg-soft-white pr-2 text-soft-black focus-within:border-hope">
                  <label htmlFor={`${id}-question`} className="sr-only">
                    Your question
                  </label>
                  <input
                    id={`${id}-question`}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Type here or select below"
                    className="h-12 min-w-0 flex-1 bg-transparent px-4 text-base font-light text-soft-black outline-none placeholder:text-concrete"
                  />
                  <Button type="submit" size="icon-sm" aria-label="Ask" disabled={!question.trim()}>
                    <SendIcon />
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <SegmentedControl
                    aria-label="Language"
                    value={language}
                    onValueChange={setLanguage}
                    variant="underline"
                    size="sm"
                    fitContent
                  >
                    <SegmentedControlItem value="en">English</SegmentedControlItem>
                    <SegmentedControlItem value="es" lang="es">
                      Español
                    </SegmentedControlItem>
                  </SegmentedControl>
                  <Button type="button" variant="ghost" size="xs" aria-label="More languages" onClick={() => notHere('More languages')}>
                    <LanguageIcon className="size-4" /> <ChevronDown />
                  </Button>
                </div>
              </div>

              {/* the suggestions, one under another. Whichever's turn it is is
                  solid Soft White at full size and opacity, with a Hope glow and the AI's gradient band round
                  its edge: an ai-fill layer masked to a 3px ring (ai-border
                  paints its band under the fill, which would show through),
                  sweeping once a turn. The rest, on an 80% fill so the glass
                  shows through, ease out to 70% and 97% over 300ms. All keep a 3px clear edge so nothing shifts */}
              <ul aria-label="Suggestions" className="flex flex-col gap-2">
                {PROMPTS.map((p, i) => (
                  <li key={p}>
                    <button
                      type="button"
                      onClick={() => ask(p)}
                      onMouseEnter={() => {
                        setHeld(true);
                        setTurn(i);
                      }}
                      onMouseLeave={() => setHeld(false)}
                      onFocus={() => {
                        setHeld(true);
                        setTurn(i);
                      }}
                      onBlur={() => setHeld(false)}
                      className={cn(
                        'relative w-full origin-center rounded-[3px] border-[3px] border-transparent px-4 py-2 text-left text-sm font-light text-soft-black transition-[opacity,scale,box-shadow,background-color] duration-300 ease-out outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-hope motion-reduce:transition-none',
                        i === turn
                          ? 'scale-100 bg-soft-white opacity-100 shadow-[0_0_14px_rgb(254_175_14/0.55)]'
                          : 'scale-[0.97] bg-soft-white/80 opacity-70',
                      )}
                    >
                      {i === turn && (
                        <span
                          aria-hidden
                          className="ai-fill pointer-events-none absolute -inset-[3px] rounded-[3px] p-[3px] [mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)]"
                          style={{ animationDuration: '2s' }}
                        />
                      )}
                      {p}
                    </button>
                  </li>
                ))}
              </ul>

              {note && (
                <p role="status" className="bg-sky-tint px-4 py-3 text-sm text-tint-foreground">
                  {note}
                </p>
              )}
            </form>
          </div>
        </section>

        <section aria-labelledby={`${id}-services`} className="flex flex-col gap-6 px-4 py-12 md:px-12">
          <h2 id={`${id}-services`} className="text-2xl font-normal tracking-tight">
            Online Services
          </h2>
          <ul className="grid gap-4 md:grid-cols-2">
            {SERVICES.map((s) => (
              <li key={s.title}>
                <a
                  href={`#${s.title}`}
                  onClick={(e) => {
                    e.preventDefault();
                    notHere(s.title);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex h-full flex-col gap-2 border border-border bg-card p-5 text-card-foreground transition-[box-shadow,border-color,scale] duration-150 ease-out outline-none hover:scale-[1.02] hover:border-transparent hover:shadow-[0_0_10px_rgb(0_0_0/0.15)] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ring"
                >
                  <span className="flex items-center gap-3 text-lg font-normal [&_svg]:size-5 [&_svg]:shrink-0">
                    {s.icon}
                    {s.title}
                  </span>
                  <span className="pl-8 text-sm text-muted-foreground">{s.description}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {/* two columns: "Questions?" large on the left, who to contact on the
          right. Both columns' first lines are trimmed to the top of their
          capitals (text-box), so "Questions?" and "Reach out" start level with
          no line-height space above them */}
      <footer className="bg-slate px-4 py-12 font-sans text-soft-white md:px-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <h2 className="text-4xl leading-tight font-normal tracking-tight [text-box:trim-start_cap_alphabetic] md:text-5xl">Questions?</h2>
          <div className="flex flex-col gap-6 text-sm font-light">
            <p className="text-base [text-box:trim-start_cap_alphabetic]">Reach out to our team.</p>
            <div className="grid gap-6 sm:grid-cols-2">
              {CONTACTS.map((c) => (
                <p key={c.team} className="flex flex-col gap-1">
                  <span className="font-normal">{c.team}</span>
                  <a href={`mailto:${c.email}`} className={`w-fit ${link}`}>
                    {c.email}
                  </a>
                  <span className="text-cement">{c.phone}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <Button
        type="button"
        size="icon-lg"
        aria-label="Help"
        // as on the sample sign-in: black, the AI chat spark at 28px in the 56px square
        className="fixed right-6 bottom-6 shadow-lg [&_svg:not([class*='size-'])]:size-7"
        onClick={() => notHere('Help')}
      >
        <AiChatSparkIcon />
      </Button>
    </div>
  );
}
