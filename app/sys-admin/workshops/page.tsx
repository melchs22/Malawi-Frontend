"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileImage,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  ShieldAlert,
  Wrench,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EmptyState } from "@/components/dashboard/empty-state"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PermissionGuard, useCan } from "@/components/auth/permission-guard"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { API_BASE_URL } from "@/lib/api-config"
import {
  getAdminWorkshop,
  getAdminWorkshopAudit,
  getAdminWorkshops,
  getAdminWorkshopStats,
  reviewAdminWorkshop,
  type AdminWorkshop,
  type AdminWorkshopAuditEvent,
  type AdminWorkshopStats,
  type WorkshopReviewAction,
  type WorkshopVerificationStatus,
} from "@/lib/api"
import { PERMISSIONS } from "@/lib/permissions"

const STATUS_OPTIONS: Array<WorkshopVerificationStatus | "ALL"> = [
  "ALL",
  "SUBMITTED",
  "UNDER_REVIEW",
  "VERIFIED",
  "REJECTED",
  "SUSPENDED",
]

const STATUS_LABELS: Record<WorkshopVerificationStatus, string> = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under review",
  VERIFIED: "Verified",
  REJECTED: "Rejected",
  SUSPENDED: "Suspended",
}

const ACTION_LABELS: Record<WorkshopReviewAction, string> = {
  under_review: "Move to review",
  verify: "Approve / verify",
  reject: "Reject application",
  suspend: "Suspend workshop",
}

function statusStyle(status: WorkshopVerificationStatus) {
  switch (status) {
    case "VERIFIED":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
    case "REJECTED":
      return "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300"
    case "SUSPENDED":
      return "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-300"
    case "UNDER_REVIEW":
      return "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300"
    default:
      return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
  }
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—"
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-MW", { timeZone: "Africa/Blantyre" })
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "The request could not be completed."
}

const WEEKDAYS = [
  ["monday", "Monday"],
  ["tuesday", "Tuesday"],
  ["wednesday", "Wednesday"],
  ["thursday", "Thursday"],
  ["friday", "Friday"],
  ["saturday", "Saturday"],
  ["sunday", "Sunday"],
] as const

function displayLabel(value: string | null | undefined) {
  if (!value) return "—"
  return value.toLowerCase().split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
}

function mediaUrl(value: string) {
  try {
    const url = new URL(value, `${API_BASE_URL}/`)
    if (url.pathname.startsWith("/media/") && typeof window !== "undefined") {
      url.protocol = window.location.protocol
      url.host = window.location.host
    }
    return url.toString()
  } catch {
    return value
  }
}

function pricingRows(value: AdminWorkshop["pricing_info"]) {
  const parsed: unknown = typeof value === "string" ? (() => {
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  })() : value
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return []
  return Object.entries(parsed as Record<string, unknown>)
    .map(([service, price]) => ({
      service,
      price: typeof price === "string" || typeof price === "number" ? String(price) : "",
    }))
    .filter(({ service, price }) => service.trim() && price.trim())
}

function WorkshopDirectory() {
  const { toast } = useToast()
  const canManage = useCan(PERMISSIONS.WORKSHOPS_MANAGE)
  const [workshops, setWorkshops] = useState<AdminWorkshop[]>([])
  const [stats, setStats] = useState<AdminWorkshopStats | null>(null)
  const [statusFilter, setStatusFilter] = useState<WorkshopVerificationStatus | "ALL">("ALL")
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState("")
  const [selectedWorkshop, setSelectedWorkshop] = useState<AdminWorkshop | null>(null)
  const [workshopDetail, setWorkshopDetail] = useState<AdminWorkshop | null>(null)
  const [auditEvents, setAuditEvents] = useState<AdminWorkshopAuditEvent[]>([])
  const [detailLoading, setDetailLoading] = useState(false)
  const [pendingAction, setPendingAction] = useState<WorkshopReviewAction | null>(null)
  const [decisionReason, setDecisionReason] = useState("")
  const [isSavingDecision, setIsSavingDecision] = useState(false)
  const detailRequestId = useRef(0)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setLoadError("")
    try {
      const trackingSearch = /^[a-f0-9]{10}$/i.test(search.trim())
      const [workshopRows, workshopStats] = await Promise.all([
        getAdminWorkshops({ status: statusFilter, search: trackingSearch ? undefined : search }),
        getAdminWorkshopStats(),
      ])
      setWorkshops(trackingSearch
        ? workshopRows.filter((workshop) => workshop.application_tracking_id?.toLowerCase() === search.trim().toLowerCase())
        : workshopRows)
      setStats(workshopStats)
    } catch (error) {
      setLoadError(errorMessage(error))
      toast({
        title: "Unable to load service centres",
        description: errorMessage(error),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [search, statusFilter, toast])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refresh()
    }, 250)
    return () => window.clearTimeout(timer)
  }, [refresh])

  const openWorkshop = async (workshop: AdminWorkshop) => {
    const requestId = ++detailRequestId.current
    setSelectedWorkshop(workshop)
    setWorkshopDetail(null)
    setAuditEvents([])
    setDetailLoading(true)
    try {
      const [detail, audit] = await Promise.all([
        getAdminWorkshop(workshop.id),
        getAdminWorkshopAudit(workshop.id),
      ])
      if (detailRequestId.current !== requestId) return
      setWorkshopDetail(detail)
      setAuditEvents(audit)
    } catch (error) {
      if (detailRequestId.current !== requestId) return
      toast({
        title: "Unable to load application details",
        description: errorMessage(error),
        variant: "destructive",
      })
    } finally {
      if (detailRequestId.current === requestId) setDetailLoading(false)
    }
  }

  const closeDetails = () => {
    detailRequestId.current += 1
    setSelectedWorkshop(null)
    setWorkshopDetail(null)
    setAuditEvents([])
    setPendingAction(null)
  }

  const submitDecision = async () => {
    if (!selectedWorkshop || !pendingAction) return
    const requiresReason = pendingAction === "reject" || pendingAction === "suspend"
    if (requiresReason && !decisionReason.trim()) {
      toast({
        title: "A reason is required",
        description: "Enter a decision reason before continuing.",
        variant: "destructive",
      })
      return
    }

    setIsSavingDecision(true)
    try {
      const response = await reviewAdminWorkshop(
        selectedWorkshop.id,
        pendingAction,
        decisionReason.trim(),
      )
      toast({
        title: "Service-centre status updated",
        description: response.owner_activation_email_sent
          ? "The owner was approved and an account setup code was emailed."
          : `Status is now ${STATUS_LABELS[response.verification_status]}.`,
      })
      setPendingAction(null)
      setDecisionReason("")
      closeDetails()
      await refresh()
    } catch (error) {
      toast({
        title: "Decision failed",
        description: errorMessage(error),
        variant: "destructive",
      })
    } finally {
      setIsSavingDecision(false)
    }
  }

  const documents = workshopDetail
    ? [
        ["Exterior workshop photo", workshopDetail.exterior_photo],
        ["Interior workshop photo", workshopDetail.interior_workshop_photo],
        ["Tools and equipment photo", workshopDetail.tools_equipment_photo],
        ["Owner ID (front)", workshopDetail.owner_id_front],
        ["Owner ID (back)", workshopDetail.owner_id_back],
        ["Business registration", workshopDetail.business_registration_cert],
        ["Trading licence", workshopDetail.trading_license],
        ["Local authority letter", workshopDetail.local_authority_letter],
      ].filter((item): item is [string, string] => typeof item[1] === "string" && item[1].length > 0)
    : []

  if (selectedWorkshop) {
    const application = workshopDetail
    const images = application
      ? [
          ["Exterior workshop photo", application.exterior_photo],
          ["Interior workshop photo", application.interior_workshop_photo],
          ["Tools and equipment", application.tools_equipment_photo],
        ].filter((item): item is [string, string] => typeof item[1] === "string" && item[1].length > 0)
      : []
    const supportingDocuments = documents.filter(([label]) =>
      !["Exterior workshop photo", "Interior workshop photo", "Tools and equipment photo"].includes(label),
    )
    const prices = application ? pricingRows(application.pricing_info) : []

    return (
      <div className="space-y-6 p-4 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <Button variant="ghost" className="-ml-3" onClick={closeDetails}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to applications
            </Button>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">
                  {application?.name ?? selectedWorkshop.name}
                </h1>
                {application && (
                  <Badge variant="outline" className={statusStyle(application.verification_status)}>
                    {STATUS_LABELS[application.verification_status]}
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Application {application?.application_tracking_id || selectedWorkshop.application_tracking_id || "—"}
                {" · "}Submitted {formatDate(application?.registration_date ?? selectedWorkshop.registration_date)}
              </p>
            </div>
          </div>
          {application && (
            <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-3">
              <span className="text-sm text-muted-foreground">Application completeness</span>
              <span className="text-lg font-semibold">{Number(application.submission_completeness).toFixed(0)}%</span>
            </div>
          )}
        </div>

        {detailLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-52 w-full" />
            <Skeleton className="h-52 w-full" />
            <Skeleton className="h-52 w-full" />
          </div>
        ) : !application ? (
          <Card>
            <CardContent className="py-8 text-sm text-muted-foreground">
              Application details could not be loaded. Return to the application list and try again.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Workshop photos</CardTitle>
                <CardDescription>Review the submitted workshop evidence at full size.</CardDescription>
              </CardHeader>
              <CardContent>
                {images.length ? (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {images.map(([label, url]) => (
                      <a
                        key={label}
                        href={mediaUrl(url)}
                        target="_blank"
                        rel="noreferrer"
                        className="group overflow-hidden rounded-lg border bg-muted/20"
                      >
                        <img
                          src={mediaUrl(url)}
                          alt={label}
                          className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-[1.02]"
                        />
                        <span className="flex items-center justify-between p-3 text-sm font-medium">
                          {label}
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No workshop photos are attached.</p>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-6 xl:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Business details</CardTitle>
                  <CardDescription>Identity, contact details, and location.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                  <Detail label="Business type">{displayLabel(application.garage_type)}</Detail>
                  <Detail label="Years in operation">{application.years_in_operation ?? "—"}</Detail>
                  <Detail label="Business contact">{application.primary_phone}</Detail>
                  <Detail label="Business email">{application.business_email}</Detail>
                  <Detail label="Secondary contact">{application.secondary_phone || "—"}</Detail>
                  <Detail label="Address">{application.physical_address}</Detail>
                  {application.latitude != null && application.longitude != null && (
                    <Detail label="Map coordinates">
                      <a
                        href={`https://www.google.com/maps?q=${encodeURIComponent(`${application.latitude},${application.longitude}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <MapPin className="h-3.5 w-3.5" />
                        {application.latitude}, {application.longitude}
                      </a>
                    </Detail>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Owner and contacts</CardTitle>
                  <CardDescription>People responsible for this application and workshop.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                  <Detail label="Owner">{application.owner_name}</Detail>
                  <Detail label="National ID">{application.owner_national_id || "—"}</Detail>
                  <Detail label="Owner contact">{application.owner_phone}</Detail>
                  <Detail label="Owner email">{application.owner_email}</Detail>
                  <Detail label="Emergency contact">{application.emergency_contact_name || "—"}</Detail>
                  <Detail label="Emergency phone">{application.emergency_contact_phone || "—"}</Detail>
                  <Detail label="Manager">{application.manager_name || "—"}</Detail>
                  <Detail label="Manager contact">{application.manager_phone || "—"}</Detail>
                  <Detail label="Manager email">{application.manager_email || "—"}</Detail>
                  <Detail label="TIN / tax ID">{application.tin_tax_id || "—"}</Detail>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Services, pricing, and hours</CardTitle>
                <CardDescription>Workshop capabilities and availability as submitted.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Detail label="Vehicle types">{application.vehicle_types?.map(displayLabel).join(", ") || "—"}</Detail>
                  <Detail label="Services offered">{application.services_offered?.map(displayLabel).join(", ") || "—"}</Detail>
                  <Detail label="Services not offered">{application.services_not_offered?.map(displayLabel).join(", ") || "—"}</Detail>
                  <Detail label="Mechanics available">{application.mechanics_count}</Detail>
                  <Detail label="Lead mechanic">{application.lead_mechanic_name || "—"}</Detail>
                  <Detail label="Experience">{application.experience_years != null ? `${application.experience_years} years` : "—"}</Detail>
                  <Detail label="Average turnaround">{application.avg_turnaround_hours != null ? `${application.avg_turnaround_hours} hours` : "—"}</Detail>
                  <Detail label="Certifications">{application.certifications?.join(", ") || "—"}</Detail>
                  <Detail label="Specialized skills">{application.specialized_skills || "—"}</Detail>
                </div>
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                    Typical pricing
                  </h3>
                  {prices.length ? (
                    <div className="overflow-hidden rounded-md border">
                      {prices.map(({ service, price }) => (
                        <div key={service} className="flex items-center justify-between gap-4 border-b px-4 py-3 text-sm last:border-b-0">
                          <span>{service}</span>
                          <span className="font-medium">{price}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-md border border-dashed px-4 py-3 text-sm text-muted-foreground">
                      No typical prices were provided.
                    </p>
                  )}
                </div>
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    Operating hours
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {WEEKDAYS.map(([day, label]) => (
                      <div key={day} className="flex justify-between gap-3 rounded-md border px-3 py-2 text-sm">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium">{application.operating_hours?.[day] || "Closed"}</span>
                      </div>
                    ))}
                  </div>
                  <Detail label="Working days">
                    {application.working_days?.map((day) => displayLabel(day)).join(", ") || "—"}
                  </Detail>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Detail label="Cancellation policy">{application.cancellation_policy || "—"}</Detail>
                  <Detail label="Prices negotiable">{application.is_price_negotiable ? "Yes" : "No"}</Detail>
                  <Detail label="Emergency service">{application.emergency_service_available ? "Available" : "Not available"}</Detail>
                  <Detail label="Warranty">
                    {application.warranty_offered
                      ? `Offered${application.warranty_duration_days ? ` · ${application.warranty_duration_days} days` : ""}`
                      : "Not offered"}
                  </Detail>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 xl:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Settlement details</CardTitle>
                  <CardDescription>Payment destination submitted by the workshop.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                  <Detail label="Payment method">{displayLabel(application.payment_method)}</Detail>
                  <Detail label="Provider or bank">{application.provider_name || "—"}</Detail>
                  <Detail label="Account holder">{application.account_holder_name || "—"}</Detail>
                  <Detail label="Account number">{application.account_number || "—"}</Detail>
                  <Detail label="Settlement preference">{displayLabel(application.settlement_preference)}</Detail>
                  <Detail label="Terms accepted">{application.terms_accepted ? "Yes" : "No"}</Detail>
                  <Detail label="Terms accepted at">{formatDate(application.terms_accepted_at)}</Detail>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Supporting documents</CardTitle>
                  <CardDescription>Open submitted IDs and business documents.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {supportingDocuments.length ? supportingDocuments.map(([label, url]) => (
                    <a
                      key={label}
                      href={mediaUrl(url)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-md border p-3 text-sm hover:bg-muted"
                    >
                      <span className="flex items-center gap-2"><FileImage className="h-4 w-4 text-muted-foreground" />{label}</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </a>
                  )) : <p className="text-sm text-muted-foreground">No supporting documents are attached.</p>}
                </CardContent>
              </Card>
            </div>

            {(application.rejection_reason || application.suspension_reason || application.verified_at) && (
              <Card>
                <CardHeader><CardTitle>Review decision</CardTitle></CardHeader>
                <CardContent className="grid gap-5 sm:grid-cols-2">
                  <Detail label="Last decision">{formatDate(application.verified_at)}</Detail>
                  {application.rejection_reason && <Detail label="Rejection reason">{application.rejection_reason}</Detail>}
                  {application.suspension_reason && <Detail label="Suspension reason">{application.suspension_reason}</Detail>}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Review history</CardTitle>
                <CardDescription>Recorded status changes and decisions.</CardDescription>
              </CardHeader>
              <CardContent>
                {auditEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No review actions have been recorded.</p>
                ) : (
                  <ol className="space-y-3">
                    {auditEvents.map((event) => (
                      <li key={event.id} className="rounded-md border p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-medium">{event.event_type.replace(/_/g, " ")}</span>
                          <span className="text-xs text-muted-foreground">{formatDate(event.created_at)}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {event.actor_name || "System"}
                          {event.from_status || event.to_status
                            ? ` · ${displayLabel(event.from_status)} → ${displayLabel(event.to_status)}`
                            : ""}
                        </p>
                        {event.reason && <p className="mt-2 text-sm">{event.reason}</p>}
                      </li>
                    ))}
                  </ol>
                )}
              </CardContent>
            </Card>

            {canManage && (
              <div className="flex flex-wrap gap-2 border-t pt-4">
                {application.verification_status !== "UNDER_REVIEW" && (
                  <Button variant="outline" onClick={() => setPendingAction("under_review")}>Move to review</Button>
                )}
                {(application.verification_status !== "VERIFIED" || !application.owner_user) && (
                  <Button onClick={() => setPendingAction("verify")}>
                    {application.verification_status === "VERIFIED" ? "Provision owner" : "Approve workshop"}
                  </Button>
                )}
                {application.verification_status !== "REJECTED" && (
                  <Button variant="destructive" onClick={() => setPendingAction("reject")}>Reject</Button>
                )}
                {application.verification_status !== "SUSPENDED" && (
                  <Button variant="outline" onClick={() => setPendingAction("suspend")}>Suspend</Button>
                )}
              </div>
            )}
          </div>
        )}

        <Dialog
          open={pendingAction !== null}
          onOpenChange={(open) => {
            if (!open && !isSavingDecision) {
              setPendingAction(null)
              setDecisionReason("")
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{pendingAction ? ACTION_LABELS[pendingAction] : "Update application"}</DialogTitle>
              <DialogDescription>
                {pendingAction === "verify"
                  ? "This approves the service centre and enables its owner account."
                  : pendingAction === "under_review"
                    ? "This changes the application status and disables existing portal access."
                    : "This changes the application status and disables workshop portal access."}
              </DialogDescription>
            </DialogHeader>
            {pendingAction && (pendingAction === "reject" || pendingAction === "suspend") && (
              <div className="space-y-2">
                <Label htmlFor="workshop-decision-reason">Decision reason</Label>
                <Textarea
                  id="workshop-decision-reason"
                  value={decisionReason}
                  onChange={(event) => setDecisionReason(event.target.value)}
                  placeholder="Explain the decision"
                  maxLength={1000}
                  rows={4}
                />
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setPendingAction(null)
                  setDecisionReason("")
                }}
                disabled={isSavingDecision}
              >
                Cancel
              </Button>
              <Button onClick={() => void submitDecision()} disabled={isSavingDecision}>
                {isSavingDecision && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Service centres</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Review ROSAF-approved workshops. Scheduled bookings remain separate from roadside assistance.
          </p>
        </div>
        <Button variant="outline" onClick={() => void refresh()} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "All centres", value: stats?.total_garages, icon: Building2 },
          { label: "Awaiting review", value: stats?.pending_garages, icon: Clock3 },
          { label: "Under review", value: stats?.under_review, icon: AlertCircle },
          { label: "Verified", value: stats?.verified_garages, icon: CheckCircle2 },
          { label: "Suspended", value: stats?.suspended_garages, icon: ShieldAlert },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                {stats ? <p className="mt-1 text-2xl font-semibold">{value ?? 0}</p> : <Skeleton className="mt-2 h-7 w-12" />}
              </div>
              <Icon className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <CardDescription>
            Search by application ID, service-centre name, owner, email, or primary phone.
          </CardDescription>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name or application ID"
                className="pl-9"
                aria-label="Search service centres"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as WorkshopVerificationStatus | "ALL")}
            >
              <SelectTrigger className="w-full sm:w-52" aria-label="Filter by application status">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "ALL" ? "All statuses" : STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-12 w-full" />)}
            </div>
          ) : loadError ? (
            <EmptyState
              title="Service centres could not be loaded"
              description="Check the backend connection and your admin permissions, then retry."
              icon={AlertCircle}
              action={<Button onClick={() => void refresh()}>Retry</Button>}
            />
          ) : workshops.length === 0 ? (
            <EmptyState
              title="No service centres found"
              description={search || statusFilter !== "ALL"
                ? "No applications match these filters."
                : "Service-centre applications will appear here when submitted."}
              icon={Building2}
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service centre</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Completeness</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workshops.map((workshop) => (
                    <TableRow key={workshop.id}>
                      <TableCell>
                        <div className="font-medium">{workshop.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {workshop.application_tracking_id || `Application #${workshop.id}`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{workshop.owner_name}</div>
                        <div className="text-xs text-muted-foreground">{workshop.owner_email}</div>
                      </TableCell>
                      <TableCell className="max-w-56 truncate">{workshop.physical_address}</TableCell>
                      <TableCell>{formatDate(workshop.registration_date)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusStyle(workshop.verification_status)}>
                          {STATUS_LABELS[workshop.verification_status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {Number(workshop.submission_completeness).toFixed(0)}%
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => void openWorkshop(workshop)}>
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0 space-y-1">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="break-words text-sm">{children}</dd>
    </div>
  )
}

export default function WorkshopsPage() {
  return (
    <PermissionGuard permissions={PERMISSIONS.WORKSHOPS_VIEW}>
      <WorkshopDirectory />
    </PermissionGuard>
  )
}
