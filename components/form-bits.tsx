export function FieldError({ message, id }: { message?: string; id?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-sm text-red-700">
      {message}
    </p>
  );
}

export function FormMessage({ ok, message }: { ok?: boolean; message?: string }) {
  if (!message) return null;
  return (
    <p
      role="status"
      className={`rounded-[4px] px-3 py-2 text-sm ${ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
    >
      {message}
    </p>
  );
}

export const inputClass =
  "h-11 w-full rounded-[4px] border border-[#d9d9d9] bg-white px-3 text-sm text-ink outline-none placeholder:text-faint focus:border-ink";
