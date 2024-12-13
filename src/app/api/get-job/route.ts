import dbConnect from "@/lib/dbConnect";
import JobModel from "@/models/Job";

export async function GET(request: Request) {
  try {
    // Connect to the database
    await dbConnect();

    // Extract query parameters
    const { level, limit, designation } = Object.fromEntries(
      new URL(request.url).searchParams
    );

    // Reverse the hyphenated designation to spaces
    const formattedDesignation = designation
      ? designation.replace(/-/g, " ")
      : "";

    // Define the filter for level and designation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (level) filter.level = level; // Filter by level if provided

    if (formattedDesignation) {
      // Use case-insensitive regex for designation
      filter.designation = {
        $regex: new RegExp(`^${formattedDesignation}$`, "i"),
      };
    }

    // Convert limit to a number and apply it (default is all jobs if no limit is specified)
    const jobsLimit = limit ? parseInt(limit, 10) : undefined;
    const safeJobsLimit = jobsLimit ?? Infinity; // Default to Infinity if no limit is provided

    // Fetch jobs with optional limit
    const jobs = await JobModel.find(filter)
      .sort({ createdAt: -1 }) // Sort by most recent
      .limit(safeJobsLimit); // Apply the limit (safeJobsLimit will be Infinity if no limit)

    // If no jobs are found, send a 404 response
    if (!jobs || jobs.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: formattedDesignation
            ? "Job with the specified designation does not exist"
            : "No jobs found",
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        jobs,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "An error occurred while fetching jobs",
      }),
      { status: 500 }
    );
  }
}
