import { NextResponse } from "next/server";
import { sanityFetch } from "@/sanity/lib/live";
import { PRESS_QUERY } from "@/lib/queries/press";

export async function GET() {
  try {
    const { data: pressArticles } = await sanityFetch({
      query: PRESS_QUERY,
    });

    return NextResponse.json({
      success: true,
      data: pressArticles,
    });
  } catch (error) {
    console.error("Error fetching press articles:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch press articles",
      },
      { status: 500 },
    );
  }
}
