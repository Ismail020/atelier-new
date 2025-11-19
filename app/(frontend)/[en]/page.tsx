import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";

const HOME_QUERY = defineQuery(`*[
  _type == "page" 
  && name == "Home" 
  && language == "en"
][0]{
  name,
  slug,
  language,
  components
}`);

export default async function Home() {
  const { data: page } = await sanityFetch({ query: HOME_QUERY });

  return (
    <main>
      <h1>Homepage (English)</h1>
      {page ? (
        <div>
          <h2>{page.name}</h2>
          <p>Language: {page.language}</p>
          {/* We'll add component rendering here */}
        </div>
      ) : (
        <p>No English homepage found. Create one in Sanity Studio with slug &quot;home&quot; and language &quot;fr&quot;.</p>
      )}
    </main>
  );
}
