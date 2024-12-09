import dbConnect from "@/lib/dbConnect";
import GalleryModel from "@/models/Gallery";
import { revalidateTag } from "next/cache";

export async function GET() {
  try {
    await dbConnect();

    const gallery = await GalleryModel.find({}).sort({ createdAt: -1 });

    revalidateTag("gallery"); // Invalidate cache for this tag

    return new Response(
      JSON.stringify({
        success: true,
        gallery,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate", // Enforce no caching
          "Pragma": "no-cache",
          "Expires": "0",
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
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  }
}

