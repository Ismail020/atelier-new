import { NextRequest, NextResponse } from "next/server";
import { getProjectsData } from "@/lib/project";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    
    // Use the existing getProjectsData function
    const projects = await getProjectsData();
    
    // Handle case where projects is null
    if (!projects) {
      return NextResponse.json({
        success: true,
        data: [],
        count: 0
      });
    }
    
    // Apply limit if provided
    let filteredProjects = projects;
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (limitNum > 0) {
        filteredProjects = projects.slice(0, limitNum);
      }
    }

    return NextResponse.json({
      success: true,
      data: filteredProjects,
      count: filteredProjects.length
    });

  } catch (error) {
    console.error("Error fetching projects:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch projects",
        data: []
      },
      { status: 500 }
    );
  }
}