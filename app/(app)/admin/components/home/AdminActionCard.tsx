function AdminCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="
        group
        rounded-xl
        border border-secondary-fade
        bg-white
        p-5
        transition
hover:border-primary      "
    >
      <h3
        className="text-base font-semibold
text-(--color-secondary-darker)       "
      >
        {title}
      </h3>

      <p className="mt-2 text-sm text-secondary">{description}</p>

      <div className="mt-4 text-sm font-medium text-primary">Open →</div>
    </a>
  );
}

export default AdminCard;
