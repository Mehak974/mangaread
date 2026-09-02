import { getMangaList } from "@/utils/anilist";
import BrowseContent from "@/app/browse/BrowseContent";
import { proxyImage } from "@/utils/api";
import { buildMetadata, SITE_URL } from "@/lib/seo";

function buildFetchVariables(params) {
  const sortParam = params?.sort;
  let activeSort = ["TRENDING_DESC", "POPULARITY_DESC"];
  if (sortParam === "latest") activeSort = ["ID_DESC"];
  else if (sortParam === "completed") activeSort = ["SCORE_DESC", "POPULARITY_DESC"];

  const q = params?.q || "";
  const genreParam = params?.genre || "All";

  const fetchVariables = {
    page: 1,
    perPage: 36,
    sort: activeSort,
    status: undefined,
  };
  if (genreParam !== "All") fetchVariables.genre = genreParam;
  if (q) fetchVariables.search = q;
  return fetchVariables;
}

async function fetchInitialData(params) {
  const fetchVariables = buildFetchVariables(params);
  try {
    return await getMangaList(fetchVariables);
  } catch {
    return null;
  }
}

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const q = params?.q || "";
  const genre = params?.genre || "";
  const sort = params?.sort || "";

  const title = q
    ? `Search results for "${q}" — Manga, Manhwa, Manhua`
    : genre
      ? `${genre} Manga — Browse`
      : sort === "latest"
        ? "New Manga Releases — Browse"
        : sort === "completed"
          ? "Completed Manga — Browse"
          : "Browse Manga — Trending, New Releases & More";

  const description = q
    ? `Search results for "${q}" on MangaReader. Discover manga, manhwa, and manhua.`
    : "Browse thousands of manga, manhwa, and manhua. Filter by genre, sort by trending or latest, and discover your next favorite series.";

  const path = q || genre || sort ? `/browse?${new URLSearchParams(params).toString()}` : "/browse";

  return buildMetadata({
    title,
    description,
    path,
    noIndex: !!(q || genre || sort),
  });
}

export default async function Browse({ searchParams }) {
  const params = await searchParams;
  const initialData = await fetchInitialData(params);

  const priorityImages = (initialData?.media || [])
    .slice(0, 4)
    .map((m) => m.cover)
    .filter(Boolean);

  return (
    <div>
      {priorityImages.map((url) => (
        <link key={url} rel="preload" as="image" href={proxyImage(url)} />
      ))}
      <BrowseContent initialData={initialData} initialParams={params} />
    </div>
  );
}
