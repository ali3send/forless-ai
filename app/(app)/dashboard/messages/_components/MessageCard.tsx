import { Message } from "./MessageDetail";

export function MessageCard({
  msg,
  active,
  onClick,
}: {
  msg: Message;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full text-left rounded-xl border p-4 transition",
        active
          ? "border-primary bg-primary/5"
          : "border-secondary-fade hover:bg-secondary-soft",
        !msg.is_read && "bg-secondary-fade/40",
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm">{msg.name}</span>

        {!msg.is_read && (
          <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] text-white">
            New
          </span>
        )}
      </div>

      <div className="text-xs text-secondary">{msg.email}</div>

      <p className="mt-2 text-sm line-clamp-2">{msg.message}</p>
    </button>
  );
}
