function injectSvgVars(svg: string, primary: string, secondary: string) {
  return svg.replace(
    "<svg",
    `<svg style="--brand-primary:${primary};--brand-secondary:${secondary};"`
  );
}

export default function BrandLogo({
  svg,
  primary,
  secondary,
}: {
  svg: string;
  primary: string;
  secondary: string;
}) {
  const svgWithVars = injectSvgVars(svg, primary, secondary);

  return (
    <div
      className="h-10 w-10 [&_svg]:h-full [&_svg]:w-full [&_svg]:block"
      dangerouslySetInnerHTML={{ __html: svgWithVars }}
    />
  );
}
