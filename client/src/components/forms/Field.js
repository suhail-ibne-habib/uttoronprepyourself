import { Label } from "@/components/ui/label";

export function Field({ label, htmlFor, error, children }) {
  return (
    <div className="grid gap-1.5">
      {label ? (
        <Label htmlFor={htmlFor} className="text-foreground">
          {label}
        </Label>
      ) : null}
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

export function emptyToUndefined(value) {
  if (value === "" || value === null || Number.isNaN(value)) return undefined;
  return value;
}

export function compactPayload(values) {
  const payload = {};
  for (const [key, value] of Object.entries(values)) {
    if (value === "" || value === undefined || value === null) continue;
    payload[key] = value;
  }
  return payload;
}
