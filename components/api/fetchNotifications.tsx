import axios from "axios";
import { isNative } from "@/lib/native-features";

export async function fetchNotifications() {
  // In native mode, skip Redis API call (server-side only)
  if (isNative()) {
    return null;
  }
  
  try {
    const response = await axios.get("/api/redisdata", {
      params: {
        htno: "notifications",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.error(
        `Failed to fetch notifications. Status: ${response.status}`,
      );
      return null;
    }
  } catch (error) {
    console.error("An error occurred while fetching notifications:", error);
    return null;
  }
}
