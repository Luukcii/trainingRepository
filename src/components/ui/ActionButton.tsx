// A one-button form that runs a Server Action: works without any browser JavaScript.
type ActionButtonProps = {
  action: (form: FormData) => Promise<void>;
  field: string;
  value: string;
  label: string;
  primary?: boolean;
  danger?: boolean;
};

export function ActionButton({ action, field, value, label, primary, danger }: ActionButtonProps) {
  const style = primary
    ? "bg-foreground text-background font-medium"
    : danger
      ? "border border-red-500/60 text-red-500"
      : "border border-line";
  return (
    <form action={action}>
      <input type="hidden" name={field} value={value} />
      <button type="submit" className={`rounded-md px-3 py-1.5 text-sm ${style}`}>
        {label}
      </button>
    </form>
  );
}
