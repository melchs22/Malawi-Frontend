import Link from "next/link"
import type { Metadata } from "next"
import { ArrowDown, ArrowRight, ArrowUpRight, LifeBuoy, MapPin, ShieldCheck, Wrench } from "lucide-react"

export const metadata: Metadata = {
  title: "Smart Mobility Roadcare | Roadside Assistance & Vehicle Care",
  description:
    "Roadside assistance and ROSAF-approved workshop services for motorists across Malawi.",
}

function RoadsideIllustration() {
  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-[1.75rem] bg-[#e8eef0] sm:min-h-[440px]">
      <div className="absolute inset-0 opacity-60" aria-hidden="true">
        <svg className="h-full w-full" viewBox="0 0 640 500" fill="none" preserveAspectRatio="xMidYMid slice">
          <path d="M-70 90C50 150 73 31 208 87s155 105 273 46 147-49 225 3" stroke="#cad6d8" strokeWidth="2" />
          <path d="M-63 143c98 48 116-62 244-14s164 119 284 54 151-50 227 3" stroke="#cad6d8" strokeWidth="2" />
          <path d="M-81 225c93-26 144 63 253 49s144-73 247-25 125 92 240 57" stroke="#cad6d8" strokeWidth="2" />
          <path d="M-65 325c119-82 148-16 248 4s157 2 237-40 135-6 239 34" stroke="#cad6d8" strokeWidth="2" />
          <path d="M-30 426c125-111 153-57 252-8s169 50 264-13 142-18 205 11" stroke="#cad6d8" strokeWidth="2" />
          <path d="M94-48c-1 124 64 136 48 233s-39 155 18 246 60 103 34 134" stroke="#cad6d8" strokeWidth="2" />
          <path d="M245-48c55 84 1 152 33 238s82 104 70 196 8 117 67 161" stroke="#cad6d8" strokeWidth="2" />
          <path d="M428-38c-39 91-70 142-29 230s118 109 83 200 4 120 71 152" stroke="#cad6d8" strokeWidth="2" />
          <path d="M-4 370c102-102 192-119 268-79s117 46 169-24 112-80 194-64" stroke="#f05a28" strokeWidth="7" strokeLinecap="round" strokeDasharray="1 1" />
          <path d="M-4 370c102-102 192-119 268-79s117 46 169-24 112-80 194-64" stroke="#f05a28" strokeWidth="3" strokeLinecap="round" />
          <circle cx="264" cy="291" r="13" fill="#f05a28" stroke="white" strokeWidth="5" />
          <circle cx="264" cy="291" r="25" stroke="#f05a28" strokeOpacity=".22" strokeWidth="2" />
          <circle cx="433" cy="267" r="8" fill="#1f2a44" stroke="white" strokeWidth="4" />
        </svg>
      </div>

      <div className="absolute left-[8%] top-[12%] rounded-lg border border-white/80 bg-white/90 px-3 py-2 shadow-sm">
        <span className="flex items-center gap-2 text-xs font-semibold text-[#1f2a44]">
          <MapPin size={14} className="text-[#f05a28]" /> Your location
        </span>
      </div>
      <div className="absolute right-[7%] top-[34%] rounded-lg border border-white/80 bg-white/90 px-3 py-2 shadow-sm">
        <span className="flex items-center gap-2 text-xs font-semibold text-[#1f2a44]">
          <Wrench size={14} className="text-[#537561]" /> Nearby service
        </span>
      </div>

      <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-[#1f2a44] p-5 text-white shadow-xl sm:bottom-7 sm:left-7 sm:right-7 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-[#f05a28] p-3"><LifeBuoy size={22} /></div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#f4b39b]">Support for the road ahead</p>
            <p className="mt-1 text-lg font-bold">Help is easier to find when you need it.</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">Request roadside assistance through the member app.</p>
          </div>
        </div>
      </div>
      <span className="sr-only">Illustrated map route connecting a motorist location to a nearby service provider.</span>
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f8f8] text-[#1f2a44]">
      <header className="border-b border-[#e4e9e9] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link className="flex items-center gap-3" href="/" aria-label="Smart Mobility Roadcare home">
            <img src="/smart-mobility-roadcare-favicon.png" alt="" className="h-10 w-10 object-contain" />
            <span className="text-[15px] font-bold tracking-tight sm:text-base">
              Smart Mobility <span className="text-[#f05a28]">Roadcare</span>
            </span>
          </Link>
          <nav className="flex items-center gap-5 sm:gap-8" aria-label="Main navigation">
            <Link className="hidden text-sm font-medium text-[#485567] transition-colors hover:text-[#f05a28] sm:inline" href="#services">
              Services
            </Link>
            <Link className="hidden text-sm font-medium text-[#485567] transition-colors hover:text-[#f05a28] sm:inline" href="#how-it-works">
              How it works
            </Link>
            <Link className="text-sm font-medium text-[#485567] transition-colors hover:text-[#f05a28]" href="/terms-and-conditions">
              Terms
            </Link>
            <Link className="inline-flex items-center gap-2 rounded-lg bg-[#f05a28] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d94c1e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a28]" href="/workshop/register">
              For workshops <ArrowUpRight size={15} />
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:grid-cols-[0.94fr_1.06fr] lg:gap-14 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-[#537561]">ROSAF · Malawi</p>
          <h1 className="mt-5 max-w-xl text-[2.7rem] font-bold leading-[1.08] tracking-[-0.045em] sm:text-6xl">
            Confidence for every kilometre.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#596675] sm:text-lg sm:leading-8">
            When your vehicle needs attention, connect with roadside responders and trusted service centres through Smart Mobility Roadcare.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link className="inline-flex items-center gap-2 rounded-lg bg-[#f05a28] px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#d94c1e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a28]" href="/workshop/register">
              Join the workshop network <ArrowRight size={17} />
            </Link>
            <Link className="inline-flex items-center gap-2 text-sm font-semibold text-[#1f2a44] hover:text-[#f05a28]" href="/workshop/login">
              Workshop portal <ArrowUpRight size={15} />
            </Link>
          </div>
          <p className="mt-6 max-w-lg text-xs leading-5 text-[#697582]">
            For an immediate emergency, contact the appropriate local emergency service. SMR roadside requests are placed through the member app.
          </p>
        </div>
        <RoadsideIllustration />
      </section>

      <section className="border-y border-[#e4e9e9] bg-white" id="services">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#537561]">One platform, two kinds of care</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">The help you need, for the journey you’re on.</h2>
            </div>
            <Link className="inline-flex items-center gap-2 text-sm font-semibold text-[#f05a28] hover:text-[#d94c1e]" href="/terms-and-conditions">
              Understand the service <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-9 grid divide-y divide-[#e4e9e9] border-y border-[#e4e9e9] md:grid-cols-2 md:divide-x md:divide-y-0">
            <article className="py-7 md:pr-9">
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-[#fff0e9] p-2.5 text-[#e95120]"><LifeBuoy size={20} /></span>
                <h3 className="text-lg font-bold">Roadside assistance</h3>
              </div>
              <p className="mt-4 max-w-xl leading-7 text-[#596675]">
                If you break down, use the member app to share your location and request help. Follow the request as an available responder is identified.
              </p>
            </article>
            <article className="py-7 md:pl-9">
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-[#eaf2ed] p-2.5 text-[#537561]"><Wrench size={20} /></span>
                <h3 className="text-lg font-bold">Workshop servicing</h3>
              </div>
              <p className="mt-4 max-w-xl leading-7 text-[#596675]">
                Find a ROSAF-approved service centre for planned maintenance or repairs. Review the quote and agree on the work before it begins.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-16 md:grid-cols-[0.8fr_1.2fr]" id="how-it-works">
        <div>
          <p className="text-sm font-semibold text-[#537561]">Straightforward from the start</p>
          <h2 className="mt-2 max-w-md text-2xl font-bold leading-tight tracking-tight sm:text-3xl">Clear information. Better-informed decisions.</h2>
          <p className="mt-4 max-w-md leading-7 text-[#596675]">
            Providers, timing, and costs can vary. Check the details for your specific request and confirm the service before proceeding.
          </p>
        </div>
        <ol className="divide-y divide-[#dfe5e5] border-y border-[#dfe5e5]">
          <li className="flex gap-5 py-5">
            <span className="w-7 shrink-0 text-sm font-bold text-[#f05a28]">01</span>
            <p className="leading-6 text-[#465363]">Share accurate vehicle, contact, and location details through the appropriate service.</p>
          </li>
          <li className="flex gap-5 py-5">
            <span className="w-7 shrink-0 text-sm font-bold text-[#f05a28]">02</span>
            <p className="leading-6 text-[#465363]">Review provider availability, service scope, quotes, and any disclosed charges.</p>
          </li>
          <li className="flex gap-5 py-5">
            <span className="w-7 shrink-0 text-sm font-bold text-[#f05a28]">03</span>
            <p className="leading-6 text-[#465363]">Keep your request details and service records, and raise concerns with ROSAF.</p>
          </li>
        </ol>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 sm:pb-20">
        <div className="flex flex-col justify-between gap-6 rounded-2xl bg-[#1f2a44] px-6 py-8 text-white sm:flex-row sm:items-center sm:px-10 sm:py-9">
          <div>
            <h2 className="text-2xl font-bold">Run a service centre?</h2>
            <p className="mt-2 max-w-xl leading-6 text-slate-300">
              Apply to join the ROSAF network. Every application is reviewed before portal access is activated.
            </p>
          </div>
          <Link className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#f05a28] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#d94c1e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" href="/workshop/register">
            Apply to join <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#e4e9e9] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 text-sm text-[#697582] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} Smart Mobility Roadcare · ROSAF</span>
          <nav className="flex gap-6" aria-label="Footer navigation">
            <Link className="hover:text-[#f05a28]" href="/terms-and-conditions">Terms & conditions</Link>
            <Link className="hover:text-[#f05a28]" href="/workshop/login">Workshop portal</Link>
          </nav>
        </div>
      </footer>
    </main>
  )
}
