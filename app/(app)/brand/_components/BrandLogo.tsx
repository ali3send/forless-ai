export default function BrandLogo({
  svg,
  primary,
  secondary,
}: {
  svg: string;
  primary: string;
  secondary: string;
}) {
  return (
    <div
      className="h-10 w-10"
      style={
        {
          "--brand-primary": primary,
          "--brand-secondary": secondary,
        } as React.CSSProperties
      }
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
