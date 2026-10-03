export function FieldError({ message, id }: { message?: string; id?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm font-medium text-red-700">
      {message}
    </p>
  );
}

export function FormMessage({ ok, message }: { ok?: boolean; message?: string }) {
  if (!message) return null;
  return (
    <p
      role="status"
      className={`rounded-xl border px-4 py-3 text-sm font-medium ${ok ? "border-green-200 bg-cta-soft text-green-900" : "border-red-200 bg-red-50 text-red-800"}`}
    >
      {message}
    </p>
  );
}
