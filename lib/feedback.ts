import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  Timestamp,
  doc,
  updateDoc
} from "firebase/firestore";
import { db } from "./firebase";

export interface Feedback {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: "new" | "read" | "resolved";
  createdAt?: Date;
  updatedAt?: Date;
}

export async function submitFeedback(feedback: Omit<Feedback, "id" | "status" | "createdAt" | "updatedAt">) {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot submit feedback on server side");
    }

    await addDoc(collection(db, "feedback"), {
      ...feedback,
      status: "new",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  } catch (error: any) {
    console.error("Error submitting feedback:", error);
    throw new Error(error.message || "Failed to submit feedback");
  }
}

export async function getFeedback(): Promise<Feedback[]> {
  try {
    if (typeof window === "undefined") {
      return [];
    }

    const q = query(collection(db, "feedback"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Feedback[];
  } catch (error: any) {
    console.error("Error fetching feedback:", error);
    throw new Error(error.message || "Failed to fetch feedback");
  }
}

export async function updateFeedbackStatus(id: string, status: "new" | "read" | "resolved") {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot update feedback on server side");
    }

    const feedbackRef = doc(db, "feedback", id);
    await updateDoc(feedbackRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  } catch (error: any) {
    console.error("Error updating feedback:", error);
    throw new Error(error.message || "Failed to update feedback");
  }
}

