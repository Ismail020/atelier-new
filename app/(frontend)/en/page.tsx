import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";

const HOME_QUERY_EN_FRONTEND = defineQuery(`*[
  _type == "page" 
  && name == "Home" 
  && language == "en"
][0]{
  name,
  language,
  components
}`);

export default async function EnglishHome() {
  const { data: page } = await sanityFetch({ 
    query: HOME_QUERY_EN_FRONTEND,
    params: {}
  });

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
        <p>
          No English homepage found. Create one in Sanity Studio with name
          &quot;Home&quot; and language &quot;en&quot;.
        </p>
      )}
    </main>
  );
}