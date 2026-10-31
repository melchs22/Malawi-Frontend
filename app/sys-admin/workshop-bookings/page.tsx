"use client"

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react"
import { AlertCircle, CalendarDays, Loader2, RefreshCw, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EmptyState } from "@/components/dashboard/empty-state"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PermissionGuard, useCan } from "@/components/auth/permission-guard"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  getAdminWorkshopBookings,
  recordAdminWorkshopSettlement,
  type AdminWorkshopBooking,
} from "@/lib/api"
import { PERMISSIONS } from "@/lib/permissions"

const BOOKING_STATUSES = [
  "ALL",
  "PENDING",
  "QUOTED",
  "ACCEPTED",
  "DECLINED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]

function formatStatus(status: string) {
  return status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function statusStyle(status: string) {
  switch (status) {
    case "COMPLETED":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
    case "DECLINED":
    case "CANCELLED":
      return "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300"
    case "IN_PROGRESS":
      return "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300"
    case "ACCEPTED":
      return "border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
    case "QUOTED":
      return "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300"
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

function money(amount: string | null | undefined, currency = "MWK") {
  if (!amount) return "—"
  const value = Number(amount)
  return Number.isFinite(value)
    ? `${currency} ${new Intl.NumberFormat("en-MW", { maximumFractionDigits: 0 }).format(value)}`
    : `${currency} ${amount}`
}

function WorkshopBookings() {
  const { toast } = useToast()
  const canManageWorkshops = useCan(PERMISSIONS.WORKSHOPS_MANAGE)
  const [bookings, setBookings] = useState<AdminWorkshopBooking[]>([])
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [search, setSearch] = useState("")
  const [selectedBooking, setSelectedBooking] = useState<AdminWorkshopBooking | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState("")
  const [settlementAmount, setSettlementAmount] = useState("")
  const [settlementReference, setSettlementReference] = useState("")
  const [settlementNotes, setSettlementNotes] = useState("")
  const [isFinalSettlement, setIsFinalSettlement] = useState(false)
  const [isSavingSettlement, setIsSavingSettlement] = useState(false)

  const refresh = async () => {
    setIsLoading(true)
    setLoadError("")
    try {
      const rows = await getAdminWorkshopBookings({ status: statusFilter })
      setBookings(rows)
      setSelectedBooking((current) => current
        ? rows.find((booking) => booking.id === current.id) ?? current
        : current)
    } catch (error) {
      const message = error instanceof Error ? error.message : "The booking list could not be loaded."
      setLoadError(message)
      toast({
        title: "Unable to load workshop bookings",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
  }, [statusFilter])

  useEffect(() => {
    setSettlementAmount("")
    setSettlementReference("")
    setSettlementNotes("")
    setIsFinalSettlement(false)
  }, [selectedBooking?.id])

  const submitSettlement = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const invoice = selectedBooking?.invoice
    if (!invoice) return

    setIsSavingSettlement(true)
    try {
      await recordAdminWorkshopSettlement(invoice.id, {
        amount: Number(settlementAmount),
        transfer_reference: settlementReference.trim(),
        notes: settlementNotes.trim(),
        is_final: isFinalSettlement,
      })
      toast({
        title: "Settlement recorded",
        description: `Settlement for invoice ${invoice.invoice_number} was saved.`,
      })
      setSettlementAmount("")
      setSettlementReference("")
      setSettlementNotes("")
      setIsFinalSettlement(false)
      await refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : "The settlement could not be recorded."
      toast({
        title: "Unable to record settlement",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsSavingSettlement(false)
    }
  }

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return bookings
    return bookings.filter((booking) => [
      String(booking.id),
      booking.garage_name,
      booking.rider_name,
      booking.service_category,
      booking.vehicle_type,
      booking.description,
    ].some((value) => value?.toLowerCase().includes(query)))
  }, [bookings, search])

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Workshop bookings</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Scheduled service-centre appointments. These are not roadside-assistance dispatch requests.
          </p>
        </div>
        <Button variant="outline" onClick={() => void refresh()} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment queue</CardTitle>
          <CardDescription>
            Inspect the member request, quote revisions, invoice, payment status, and review.
          </CardDescription>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search bookings"
                className="pl-9"
                aria-label="Search workshop bookings"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-52" aria-label="Filter by booking status">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                {BOOKING_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "ALL" ? "All statuses" : formatStatus(status)}
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
              title="Bookings could not be loaded"
              description="Check the backend connection and admin permissions, then retry."
              icon={AlertCircle}
              action={<Button onClick={() => void refresh()}>Retry</Button>}
            />
          ) : filteredBookings.length === 0 ? (
            <EmptyState
              title="No workshop bookings found"
              description={search || statusFilter !== "ALL"
                ? "No bookings match these filters."
                : "Member service-centre bookings will appear here."}
              icon={CalendarDays}
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Service centre</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Requested date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Estimate / final</TableHead>
                    <TableHead className="text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">#{booking.id}</TableCell>
                      <TableCell>{booking.rider_name || `Member ${booking.rider}`}</TableCell>
                      <TableCell>{booking.garage_name}</TableCell>
                      <TableCell>
                        <div>{formatStatus(booking.service_category)}</div>
                        <div className="text-xs text-muted-foreground">{formatStatus(booking.vehicle_type)}</div>
                      </TableCell>
                      <TableCell>{booking.preferred_date}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusStyle(booking.status)}>
                          {formatStatus(booking.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {money(booking.actual_cost || booking.estimated_cost)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>
                          View
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

      <Dialog
        open={selectedBooking !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedBooking(null)
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Workshop booking #{selectedBooking?.id}</DialogTitle>
            <DialogDescription>
              {selectedBooking?.garage_name} · {selectedBooking?.rider_name}
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <section className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
                <Detail label="Status">
                  <Badge variant="outline" className={statusStyle(selectedBooking.status)}>
                    {formatStatus(selectedBooking.status)}
                  </Badge>
                </Detail>
                <Detail label="Service centre">{selectedBooking.garage_name}</Detail>
                <Detail label="Member">{selectedBooking.rider_name}</Detail>
                <Detail label="Vehicle type">{formatStatus(selectedBooking.vehicle_type)}</Detail>
                <Detail label="Service">{formatStatus(selectedBooking.service_category)}</Detail>
                <Detail label="Requested appointment">
                  {selectedBooking.preferred_date}{selectedBooking.preferred_time ? ` · ${selectedBooking.preferred_time}` : ""}
                </Detail>
                <Detail label="Created">{formatDate(selectedBooking.created_at)}</Detail>
                <Detail label="Last updated">{formatDate(selectedBooking.updated_at)}</Detail>
                <Detail label="Description">{selectedBooking.description || "—"}</Detail>
                <Detail label="Workshop response">{selectedBooking.response_note || "—"}</Detail>
                <Detail label="Member coordinates">
                  {selectedBooking.location_lat && selectedBooking.location_lng
                    ? `${selectedBooking.location_lat}, ${selectedBooking.location_lng}`
                    : "Not provided"}
                </Detail>
              </section>

              <section className="space-y-3">
                <h3 className="font-semibold">Quote history</h3>
                {selectedBooking.quotes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No quote has been submitted.</p>
                ) : selectedBooking.quotes.map((quote) => (
                  <div key={quote.id} className="space-y-3 rounded-lg border p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-medium">Revision {quote.revision} · {money(quote.amount, quote.currency)}</div>
                      <Badge variant="outline" className={statusStyle(quote.status === "ACCEPTED" ? "COMPLETED" : quote.status === "DECLINED" ? "DECLINED" : "QUOTED")}>
                        {formatStatus(quote.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Scheduled {quote.scheduled_date}{quote.scheduled_time ? ` at ${quote.scheduled_time}` : ""}
                    </p>
                    <ul className="space-y-1 text-sm">
                      {quote.line_items.map((item, index) => (
                        <li key={`${quote.id}-${index}`} className="flex justify-between gap-4">
                          <span>{item.description} × {item.quantity}</span>
                          <span>{money(String(Number(item.unit_amount) * item.quantity), quote.currency)}</span>
                        </li>
                      ))}
                    </ul>
                    {quote.response_reason && <p className="text-sm">Response: {quote.response_reason}</p>}
                  </div>
                ))}
              </section>

              <section className="space-y-3">
                <h3 className="font-semibold">Invoice and payments</h3>
                {!selectedBooking.invoice ? (
                  <p className="text-sm text-muted-foreground">No invoice has been issued.</p>
                ) : (
                  <div className="space-y-3 rounded-lg border p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Detail label="Invoice">{selectedBooking.invoice.invoice_number}</Detail>
                      <Detail label="Amount">
                        {money(selectedBooking.invoice.amount, selectedBooking.invoice.currency)}
                      </Detail>
                      <Detail label="Invoice status">{formatStatus(selectedBooking.invoice.status)}</Detail>
                      <Detail label="Issued">{formatDate(selectedBooking.invoice.issued_at)}</Detail>
                    </div>
                    {selectedBooking.invoice.payments.length > 0 && (
                      <div className="space-y-2 border-t pt-3">
                        <h4 className="text-sm font-medium">Payment attempts</h4>
                        {selectedBooking.invoice.payments.map((payment) => (
                          <div key={payment.id} className="flex flex-wrap justify-between gap-2 text-sm">
                            <span>{payment.transaction_reference}</span>
                            <span>{money(payment.amount, payment.currency)} · {formatStatus(payment.status)}</span>
                            {payment.is_excess_payment && (
                              <Badge variant="destructive">Excess payment</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {(selectedBooking.invoice.settlements?.length ?? 0) > 0 && (
                      <div className="space-y-2 border-t pt-3">
                        <h4 className="text-sm font-medium">Workshop settlements</h4>
                        {selectedBooking.invoice.settlements?.map((settlement) => (
                          <div key={settlement.id} className="space-y-1 rounded-md bg-muted/50 p-3 text-sm">
                            <div className="flex flex-wrap justify-between gap-2">
                              <span>{settlement.transfer_reference}</span>
                              <span>{money(settlement.amount, selectedBooking.invoice?.currency)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {settlement.settled_by_name} · {formatDate(settlement.settled_at)}
                              {settlement.is_final ? " · Final" : ""}
                            </p>
                            {settlement.notes && <p className="text-sm">{settlement.notes}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                    {canManageWorkshops && selectedBooking.invoice.status === "PAID" && (
                      <SettlementForm
                        invoiceAmount={selectedBooking.invoice.amount}
                        settlements={selectedBooking.invoice.settlements ?? []}
                        amount={settlementAmount}
                        reference={settlementReference}
                        notes={settlementNotes}
                        isFinal={isFinalSettlement}
                        isSaving={isSavingSettlement}
                        onAmountChange={setSettlementAmount}
                        onReferenceChange={setSettlementReference}
                        onNotesChange={setSettlementNotes}
                        onFinalChange={setIsFinalSettlement}
                        onSubmit={submitSettlement}
                      />
                    )}
                  </div>
                )}
              </section>

              <section className="space-y-3">
                <h3 className="font-semibold">Member review</h3>
                {selectedBooking.review ? (
                  <div className="rounded-lg border p-4">
                    <p className="font-medium">{selectedBooking.review.rating}/5 · {selectedBooking.review.rider_name}</p>
                    <p className="mt-2 text-sm">{selectedBooking.review.comment || "No written comment."}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDate(selectedBooking.review.created_at)}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No member review has been submitted.</p>
                )}
              </section>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SettlementForm({
  invoiceAmount,
  settlements,
  amount,
  reference,
  notes,
  isFinal,
  isSaving,
  onAmountChange,
  onReferenceChange,
  onNotesChange,
  onFinalChange,
  onSubmit,
}: {
  invoiceAmount: string
  settlements: NonNullable<NonNullable<AdminWorkshopBooking["invoice"]>["settlements"]>
  amount: string
  reference: string
  notes: string
  isFinal: boolean
  isSaving: boolean
  onAmountChange: (value: string) => void
  onReferenceChange: (value: string) => void
  onNotesChange: (value: string) => void
  onFinalChange: (value: boolean) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  const settledTotal = settlements.reduce((total, settlement) => total + Number(settlement.amount), 0)
  const remaining = Math.max(0, Number(invoiceAmount) - settledTotal)
  const numericAmount = Number(amount)
  const requiresDifferenceNote = isFinal && numericAmount < remaining
  const isValid = Number.isSafeInteger(numericAmount)
    && numericAmount > 0
    && numericAmount <= remaining
    && reference.trim().length > 0
    && (!requiresDifferenceNote || notes.trim().length > 0)

  if (remaining === 0) return null

  return (
    <form className="space-y-4 border-t pt-4" onSubmit={onSubmit}>
      <div>
        <h4 className="font-medium">Record workshop payout</h4>
        <p className="text-sm text-muted-foreground">
          Remaining to settle: {money(String(remaining))}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="workshop-settlement-amount">Amount (MWK)</Label>
          <Input
            id="workshop-settlement-amount"
            type="number"
            min="1"
            max={remaining}
            step="1"
            required
            value={amount}
            onChange={(event) => onAmountChange(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="workshop-settlement-reference">Transfer reference</Label>
          <Input
            id="workshop-settlement-reference"
            maxLength={100}
            required
            value={reference}
            onChange={(event) => onReferenceChange(event.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="workshop-settlement-notes">Notes</Label>
        <Textarea
          id="workshop-settlement-notes"
          value={notes}
          onChange={(event) => onNotesChange(event.target.value)}
          placeholder="Optional unless a final payout differs from the remaining invoice balance."
        />
      </div>
      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          className="mt-1"
          checked={isFinal}
          onChange={(event) => onFinalChange(event.target.checked)}
        />
        Mark this as the final settlement
      </label>
      {requiresDifferenceNote && (
        <p className="text-sm text-destructive">
          Add a note explaining why the final settlement is less than the remaining invoice balance.
        </p>
      )}
      <Button type="submit" disabled={!isValid || isSaving}>
        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Record settlement
      </Button>
    </form>
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

export default function WorkshopBookingsPage() {
  return (
    <PermissionGuard permissions={PERMISSIONS.WORKSHOP_BOOKINGS_VIEW}>
      <WorkshopBookings />
    </PermissionGuard>
  )
}
