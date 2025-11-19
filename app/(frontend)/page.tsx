import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";

const HOME_QUERY_FR = defineQuery(`*[
  _type == "page" 
  && name == "Home" 
  && language == "fr"
][0]{
  name,
  language,
  components
}`);

export default async function Home() {
  const { data: page } = await sanityFetch({ 
    query: HOME_QUERY_FR,
    params: {}
  });

  return (
    <main>
      <h1>Homepage (French)</h1>
      {page ? (
        <div>
          <h2>{page.name}</h2>
          <p>Language: {page.language}</p>
          {/* We'll add component rendering here */}
        </div>
      ) : (
        <p>
          No French homepage found. Create one in Sanity Studio with name
          &quot;Home&quot; and language &quot;fr&quot;.
        </p>
      )}
    </main>
  );
}
