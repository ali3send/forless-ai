export async function fetchUnsplashImage(query: string): Promise<string> {
  const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

  // 🔹 Safe fallback image (always allowed by next/image)
  const fallback =
    "https://images.unsplash.com/photo-1526045612212-70caf35c14df?fit=crop&w=1200&q=80";

  if (!accessKey) {
    console.warn("Unsplash access key missing");
    return fallback;
  }

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    query
  )}&client_id=${accessKey}&per_page=1`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    // 🔥 If we got a valid image
    if (data?.results?.length > 0) {
      return data.results[0].urls.regular;
    }

    // 🔥  no results, fallback to safe Unsplash domain
    return fallback;
  } catch (error) {
    console.error("Unsplash fetch error:", error);
    return fallback;
  }
}
