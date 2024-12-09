import dbConnect from "@/lib/dbConnect";
import GalleryModel from "@/models/Gallery";

export async function GET() {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch gallery items, sorted by most recent
    const gallery = await GalleryModel.find({}).sort({ createdAt: -1 });

    // Return the response with Cache-Control header
    return new Response(
      JSON.stringify({
        success: true,
        gallery,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store", // Disable ISR caching
        },
      }
    );
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "An error occurred while fetching gallery images",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
