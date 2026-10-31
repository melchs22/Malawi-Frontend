"use client"

import { Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type ChangeRecord = Record<string, unknown>

interface ChangeRow {
    field: string
    oldValue: unknown
    newValue: unknown
}

function isRecord(value: unknown): value is ChangeRecord {
    return typeof value === "object" && value !== null && !Array.isArray(value)
}

function readableFieldName(field: string): string {
    return field
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatValue(value: unknown): string {
    if (value === undefined) return "Not recorded"
    if (value === null || value === "") return "Empty"
    if (typeof value === "boolean") return value ? "Yes" : "No"
    if (Array.isArray(value)) {
        return value.length
            ? value.map((item) => formatValue(item)).join(", ")
            : "None"
    }
    if (isRecord(value)) {
        const entries = Object.entries(value)
        return entries.length
            ? entries.map(([key, item]) => `${readableFieldName(key)}: ${formatValue(item)}`).join("\n")
            : "No details"
    }
    if (typeof value === "string") {
        if (/^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*$/.test(value)) {
            return value
                .replace(/_/g, " ")
                .toLowerCase()
                .replace(/\b\w/g, (letter) => letter.toUpperCase())
        }
        return value
    }
    return String(value)
}

function getChangeRows(changes: unknown): ChangeRow[] {
    if (!isRecord(changes)) return []

    const oldValues = "old" in changes ? changes.old : changes.before
    const newValues = "new" in changes ? changes.new : changes.after
    if (isRecord(oldValues) || isRecord(newValues)) {
        const previous = isRecord(oldValues) ? oldValues : {}
        const current = isRecord(newValues) ? newValues : {}
        const fields = new Set([...Object.keys(previous), ...Object.keys(current)])
        const rows = Array.from(fields, (field) => ({
            field,
            oldValue: oldValues === null ? null : previous[field],
            newValue: newValues === null ? null : current[field],
        }))
        if (isRecord(changes.details) && Object.keys(changes.details).length) {
            rows.push({ field: "details", oldValue: undefined, newValue: changes.details })
        }
        return rows
    }

    if ("old" in changes || "before" in changes || "new" in changes || "after" in changes) {
        return [{ field: "value", oldValue: oldValues, newValue: newValues }]
    }

    const fieldChanges = Object.entries(changes).filter(([, value]) =>
        isRecord(value) && ("old" in value || "before" in value || "new" in value || "after" in value)
    )
    if (fieldChanges.length) {
        return fieldChanges.map(([field, value]) => {
            const entry = value as ChangeRecord
            return {
                field,
                oldValue: "old" in entry ? entry.old : entry.before,
                newValue: "new" in entry ? entry.new : entry.after,
            }
        })
    }

    if (isRecord(changes.details)) {
        return Object.entries(changes.details).map(([field, value]) => ({
            field,
            oldValue: undefined,
            newValue: value,
        }))
    }

    return Object.entries(changes)
        .filter(([key]) => key !== "details")
        .map(([field, value]) => ({ field, oldValue: undefined, newValue: value }))
}

export function DiffViewer({ changes }: { changes: unknown }) {
    const rows = getChangeRows(changes)
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Eye className="h-3 w-3" />
                    View changes
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Recorded changes</DialogTitle>
                </DialogHeader>
                <div className="mt-2 max-h-[65vh] space-y-3 overflow-y-auto pr-1">
                    {rows.length ? rows.map(({ field, oldValue, newValue }) => (
                        <section key={field} className="overflow-hidden rounded-lg border border-border">
                            <h3 className="border-b border-border bg-muted/40 px-4 py-2 text-sm font-semibold">
                                {readableFieldName(field)}
                            </h3>
                            <div className="grid gap-px bg-border sm:grid-cols-2">
                                <div className="bg-background p-4">
                                    <p className="mb-1 text-xs font-medium text-muted-foreground">Previous value</p>
                                    <p className="whitespace-pre-wrap break-words text-sm">{formatValue(oldValue)}</p>
                                </div>
                                <div className="bg-background p-4">
                                    <p className="mb-1 text-xs font-medium text-muted-foreground">New value</p>
                                    <p className="whitespace-pre-wrap break-words text-sm">{formatValue(newValue)}</p>
                                </div>
                            </div>
                        </section>
                    )) : (
                        <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                            This record has no field-level change details.
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
