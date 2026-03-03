// app/lib/types/brand.ts
export type BrandData = {
  name: string;
  slogan: string;
  logoSvg: string | null;
  palette: {
    primary: string;
    secondary: string;
  } | null;
  font: {
    id: string;
    css: string;
  } | null;
};

// lib/types/brandTypes.ts
export type BrandDataNew = {
  name: string;
  slogan?: string;

  palette: {
    primary: string;
    secondary: string;
  };

  font: {
    id: string;
    css: string;
  };

  logoSvg?: string;
};
