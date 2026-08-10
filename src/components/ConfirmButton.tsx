import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./Button.tsx";

export function ConfirmButton({
  label,
  confirmLabel = "Confirm",
  onConfirm,
  disabled,
}: {
  label: string;
  confirmLabel?: string;
  onConfirm: () => void;
  disabled?: boolean;
}) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 py-1 pl-3 pr-1.5 dark:border-rose-900/60 dark:bg-rose-950/40">
        <AlertTriangle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
        <span className="text-sm text-rose-700 dark:text-rose-300">Are you sure?</span>
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            setConfirming(false);
            onConfirm();
          }}
          className="rounded-md bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
        >
          {confirmLabel}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-md px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <Button variant="danger" size="sm" disabled={disabled} onClick={() => setConfirming(true)}>
      {label}
    </Button>
  );
}
