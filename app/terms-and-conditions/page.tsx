import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms & Conditions | Smart Mobility Roadcare",
  description:
    "Terms for Smart Mobility Roadcare roadside assistance, members, responders, and service-centre partners.",
}

const sections = [
  {
    title: "1. About these terms",
    paragraphs: [
      "These Terms & Conditions govern your access to and use of Smart Mobility Roadcare (SMR), a mobility and vehicle-care platform administered for the Road Safety Action Foundation (ROSAF). They apply to members, roadside responders (also called Roadies), and service-centre partners.",
      "By creating an account, submitting a workshop application, requesting a service, accepting a request, or continuing to use SMR after being shown these terms, you agree to the parts that apply to you. A separate service quote, membership description, or workshop policy may add details for a particular transaction; it does not remove rights or protections required by law.",
    ],
  },
  {
    title: "2. What the platform does",
    paragraphs: [
      "SMR provides digital tools to submit and track roadside assistance requests, connect members with available responders, find participating service centres, arrange scheduled workshop services, and manage related service information.",
      "Roadside dispatch and scheduled workshop servicing are separate services. A roadside assistance request does not automatically create a workshop booking, and a workshop booking does not create an emergency dispatch request.",
      "ROSAF and SMR coordinate access to service providers. The provider performs the roadside or workshop work. Provider availability, skills, equipment, travel conditions, and service outcomes can vary. SMR does not promise that a provider will be available, arrive by a particular time, or complete a repair successfully.",
    ],
  },
  {
    title: "3. Eligibility and accounts",
    paragraphs: [
      "You must be legally able to enter an agreement to use SMR. If you use it for an organisation, you confirm that you are authorised to act for that organisation.",
      "Provide accurate, current account, vehicle, contact, location, and application information. Keep login credentials private, use your own account, and promptly notify ROSAF if you suspect unauthorised access. You are responsible for activity carried out through your account unless applicable law says otherwise.",
      "Workshop applications are subject to review. Submitting an application does not guarantee approval, listing, or portal access. A workshop may operate through SMR only after ROSAF approval and activation.",
    ],
  },
  {
    title: "4. Roadside assistance requests",
    paragraphs: [
      "When requesting assistance, give a truthful description of the incident, the vehicle, a safe contact method, and an accurate location. Keep your phone available and follow reasonable safety instructions while a request is being handled.",
      "SMR may use your location and request details to identify and contact an available responder. A request can remain unassigned, be declined, expire, or be cancelled if no responder is available or circumstances change. Any arrival time or distance shown is an estimate, not a guarantee.",
      "SMR is not an emergency dispatch service and does not replace police, fire, ambulance, or other public emergency services. If anyone is in immediate danger or needs urgent medical help, first contact the appropriate local emergency service and move to a safe place if you can do so safely.",
      "Do not place yourself, a responder, or another road user in danger. Do not request a service for a false incident, an unsafe or unlawful purpose, or a vehicle or location you are not authorised to represent.",
    ],
  },
  {
    title: "5. Scheduled workshop services",
    paragraphs: [
      "Workshop listings and service descriptions are provided to help members choose a service centre. Confirm that the workshop offers the work you need, is open, and can accept your vehicle before travelling or committing to a booking.",
      "A workshop may provide a quote through SMR. Review the scope, parts, price, timing, warranty (if offered), and cancellation policy. Work beyond an accepted quote, including additional parts or charges, should be explained and agreed with you before it is performed.",
      "Workshop approval means ROSAF has accepted the service centre into the network; it is not a guarantee of a particular repair, a warranty by ROSAF, or an endorsement of every service outcome. A workshop is responsible for the work it agrees to perform and for the accuracy of its listing and quote.",
    ],
  },
  {
    title: "6. Prices, fees, and payments",
    paragraphs: [
      "Prices, provider charges, platform fees, and payment methods may vary by service and will be shown or communicated in the relevant request, quote, or payment flow when applicable. Review the amount, currency, recipient, and service scope before accepting or paying. Do not assume a service is free unless the platform or provider clearly says so.",
      "Do not authorise additional paid work or an amount that has not been disclosed to you. Where the final cost depends on inspection or circumstances at the scene, the provider must explain the change and obtain your agreement before proceeding with additional chargeable work.",
      "A payment is complete only when the relevant payment channel or platform confirms it. Keep receipts and transaction references. Any refund, reversal, or payment dispute will be handled under the terms shown for that transaction and applicable law.",
    ],
  },
  {
    title: "7. Cancellations and service changes",
    paragraphs: [
      "Cancel or update a request promptly if you no longer need help, your location changes, or the vehicle is moved. Tell the provider about changes that could affect safe access or the agreed work.",
      "A workshop's disclosed cancellation policy applies to its scheduled service where it is lawful and was made available before you accepted the booking. Any cancellation charge must have been disclosed and must comply with applicable law. SMR may record cancellation status and reasons to administer the request and investigate disputes.",
      "ROSAF or a provider may decline, pause, or cancel a request where it is unsafe, unlawful, outside the provider's capability, or affected by unavailability, severe conditions, inaccurate information, or suspected misuse. Where practicable, the reason will be communicated through the platform.",
    ],
  },
  {
    title: "8. Responsibilities of members",
    paragraphs: [
      "Members must provide honest information, maintain a safe distance from traffic and hazards, treat providers respectfully, and follow lawful safety instructions. Do not threaten, harass, discriminate against, or interfere with a provider.",
      "Before work begins, explain relevant known vehicle issues and agree the work and charges. Inspect the completed service where reasonably possible, raise concerns promptly, and retain any quote, receipt, or warranty information provided.",
    ],
  },
  {
    title: "9. Responsibilities of responders and workshops",
    paragraphs: [
      "Responders and workshop partners must keep their application, identity, contact, service, pricing, availability, and settlement information accurate; accept only work they are capable and authorised to perform; and comply with applicable laws, safety requirements, and professional standards.",
      "Partners must communicate material changes to the member before work proceeds, honour the accepted scope and any stated warranty, handle member information only as needed for the request or as permitted by law, and promptly report a safety incident, suspected fraud, or material service complaint to ROSAF.",
      "A workshop must not represent an unapproved business as ROSAF-approved, use a member's information for unrelated marketing without a lawful basis and required consent, or collect undisclosed charges. Approval and continued participation may be reviewed or suspended under these terms.",
    ],
  },
  {
    title: "10. Location and personal information",
    paragraphs: [
      "SMR uses information you provide, including account and vehicle details, contact information, service history, application documents, and location, to operate the platform, assess workshop applications, coordinate services, prevent misuse, provide support, and meet legal obligations.",
      "For an active request, relevant contact, vehicle, incident, and location details may be shared with the responder or workshop handling that request and with ROSAF staff who administer it. Do not include information that is not needed to arrange the service.",
      "ROSAF will handle personal information in accordance with applicable data-protection law and the privacy information presented in the platform. You may contact ROSAF through its published support channels to ask about your information or raise a privacy concern.",
    ],
  },
  {
    title: "11. Acceptable use and platform availability",
    paragraphs: [
      "Do not misuse SMR, attempt unauthorised access, interfere with another person's account or request, upload unlawful or malicious content, submit false reports, or use the platform to facilitate fraud or harm.",
      "The platform may be interrupted for maintenance, connectivity failures, weather, security events, or circumstances beyond reasonable control. Keep any confirmation or contact details provided for your request. SMR may update or discontinue a feature where reasonably necessary, subject to applicable law.",
    ],
  },
  {
    title: "12. Complaints and disputes",
    paragraphs: [
      "If a service does not match the accepted quote or you have a safety, payment, privacy, or conduct concern, report it promptly through the support channel made available by ROSAF. Include the request or transaction reference and relevant evidence, but do not send passwords or full payment credentials.",
      "ROSAF may review platform records, request information from the parties, and help facilitate a resolution. This process does not remove your right to use any complaint, consumer-protection, or legal remedy available under applicable law.",
    ],
  },
  {
    title: "13. Suspension and termination",
    paragraphs: [
      "ROSAF may restrict or suspend an account, listing, or request where reasonably necessary to protect people, investigate suspected misuse, enforce these terms, comply with law, or address inaccurate information or safety concerns. Where appropriate and lawful, ROSAF will explain the reason and how to request a review.",
      "You may stop using SMR at any time. Ending platform access does not cancel payment obligations already accepted, remove records that ROSAF must retain by law, or affect rights and responsibilities that arose before access ended.",
    ],
  },
  {
    title: "14. Responsibility and legal rights",
    paragraphs: [
      "To the extent permitted by law, ROSAF is not responsible for a provider's independent acts or omissions, a vehicle's pre-existing condition, events outside reasonable control, or indirect loss that could not reasonably have been anticipated. This does not exclude a responsibility that applicable law does not allow to be excluded.",
      "Nothing in these terms limits liability for fraud, wilful misconduct, or death or personal injury to the extent caused by negligence where such limitation is prohibited. Nothing removes a consumer or other statutory right that cannot lawfully be waived.",
    ],
  },
  {
    title: "15. Changes, law, and contact",
    paragraphs: [
      "ROSAF may revise these terms to reflect changes to SMR, operational requirements, or applicable law. The current version and its effective date will be published on this page. If a change materially affects your rights or obligations, ROSAF will provide notice where required by law. Continued use after the effective date means acceptance of the revised terms to the extent permitted by law.",
      "These terms are governed by the laws of Malawi, subject to mandatory consumer protections and any rules on jurisdiction that apply. Questions or complaints may be directed to ROSAF through the support or contact channels published for Smart Mobility Roadcare.",
    ],
  },
]

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#1f2a44]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <Link className="flex items-center gap-3 font-bold" href="/">
            <img src="/smart-mobility-roadcare-favicon.png" alt="" className="h-10 w-10 rounded-lg object-contain" />
            <span>Smart Mobility <span className="text-[#f05a28]">Roadcare</span></span>
          </Link>
          <Link className="text-sm font-semibold text-slate-600 hover:text-[#f05a28]" href="/">
            <span className="inline-flex items-center gap-2"><ArrowLeft size={16} /> Back to home</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="rounded-2xl bg-[#1f2a44] p-7 text-white sm:p-10">
          <div className="flex items-center gap-3 text-orange-200">
            <ShieldCheck size={23} />
            <span className="text-xs font-bold uppercase tracking-[0.16em]">Members · Roadside responders · Workshops</span>
          </div>
          <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">Terms & Conditions</h1>
          <p className="mt-4 max-w-3xl leading-7 text-slate-200">
            These terms explain how Smart Mobility Roadcare roadside assistance and scheduled workshop services work, and the responsibilities of everyone using the platform.
          </p>
          <p className="mt-5 text-sm text-slate-300">Version 1.0 · Effective 30 October 2026 · Malawi</p>
        </div>

        <div className="mt-8 rounded-xl border border-orange-200 bg-orange-50 p-5 leading-7 text-slate-700">
          <strong>Important:</strong> SMR is not an emergency dispatch service. For immediate danger or urgent medical help, contact the appropriate local emergency service first. Roadside assistance and scheduled workshop servicing are separate services.
        </div>

        <article className="mt-8 space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-bold tracking-tight">{section.title}</h2>
              <div className="mt-3 space-y-3 text-[15px] leading-7 text-slate-600">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}
        </article>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <Link className="text-sm font-semibold text-[#f05a28] hover:underline" href="/">
            Return to Smart Mobility Roadcare
          </Link>
          <Link className="rounded-lg bg-[#f05a28] px-5 py-3 text-sm font-semibold text-white hover:bg-[#d94c1e]" href="/workshop/register">
            Apply as a workshop partner
          </Link>
        </div>
      </div>
    </main>
  )
}
