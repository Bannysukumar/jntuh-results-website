import axios from "axios";
import { saveToLocalStorage } from "../customfunctions/localStorage";
import { isNative } from "@/lib/native-features";

import toast from "react-hot-toast";

export const fetchAcademicResult = async (
  htno: string,
): Promise<null | AcademicResulProps> => {
  try {
    // Use external API directly in native mode, proxy route in web mode
    const baseUrl = isNative() 
      ? 'https://jntuhresults.dhethi.com/api'
      : '';
    let url: string = isNative()
      ? `${baseUrl}/getAcademicResult?rollNumber=${htno}`
      : `/api/proxy?endpoint=getAcademicResult&rollNumber=${htno}`;

    toast.loading("Fetching result...");

    const response = await axios.get(url, {
      timeout: 20 * 1000,
      validateStatus: () => true,
    });

    switch (response.status) {
      case 200: {
        if ("details" in response.data) {
          toast.dismiss();
          toast.success("Result fetched successfully");
          return response.data;
        }
        break;
      }

      case 202: {
        toast.dismiss();
        toast(
          response.data.message ||
            "Result is being prepared. Please check again shortly.",
        );
        return null;
      }

      case 409: {
        toast.dismiss();
        toast.error(
          response.data.message || "This roll number is already in the queue.",
        );
        return null;
      }

      case 502: {
        toast.dismiss();
        toast.error("Upstream JNTUH servers are down. Try again later.");
        return null;
      }

      case 503: {
        toast.dismiss();
        toast.error("Server overloaded. Please try again later.");
        return null;
      }

      case 500: {
        toast.dismiss();
        toast.error("Unexpected server error occurred.");
        return null;
      }

      default: {
        toast.dismiss();
        toast.error("Unhandled response from server.");
        return null;
      }
    }

    toast.dismiss();
    return null;
  } catch (e: any) {
    toast.dismiss();

    if (axios.isAxiosError(e)) {
      if (e.code === "ECONNABORTED") {
        toast.error("Request timed out. Try again later.");
      } else if (e.response) {
        toast.error(`Server error: ${e.response.status}`);
      } else {
        toast.error("Network issue. Please check your connection.");
      }
    } else {
      toast.error("Unexpected error occurred.");
    }

    return null;
  }
};
export const fetchAllResult = async (htno: string) => {
  try {
    const baseUrl = isNative() 
      ? 'https://jntuhresults.dhethi.com/api'
      : '';
    let url: string = isNative()
      ? `${baseUrl}/getAllResult?rollNumber=${htno}`
      : `/api/proxy?endpoint=getAllResult&rollNumber=${htno}`;

    toast.loading("Fetching result...");

    const response = await axios.get(url, {
      timeout: 20 * 1000,
      validateStatus: () => true,
    });

    switch (response.status) {
      case 200: {
        if ("details" in response.data) {
          saveToLocalStorage(
            htno + "-AllResult",
            JSON.stringify(response.data),
          );
          toast.dismiss();
          toast.success("Result fetched successfully");
          return true;
        }
        break;
      }

      case 202: {
        toast.dismiss();
        toast(
          response.data.message ||
            "Result is being prepared. Please check again shortly.",
        );
        return false;
      }

      case 409: {
        toast.dismiss();
        toast.error(
          response.data.message || "This roll number is already in the queue.",
        );
        return false;
      }

      case 502: {
        toast.dismiss();
        toast.error("Upstream JNTUH servers are down. Try again later.");
        return false;
      }

      case 503: {
        toast.dismiss();
        toast.error("Server overloaded. Please try again later.");
        return false;
      }

      case 500: {
        toast.dismiss();
        toast.error("Unexpected server error occurred.");
        return false;
      }

      default: {
        toast.dismiss();
        toast.error("Unhandled response from server.");
        return false;
      }
    }

    toast.dismiss();
    return false;
  } catch (e: any) {
    toast.dismiss();

    if (axios.isAxiosError(e)) {
      if (e.code === "ECONNABORTED") {
        toast.error("Request timed out. Try again later.");
      } else if (e.response) {
        toast.error(`Server error: ${e.response.status}`);
      } else {
        toast.error("Network issue. Please check your connection.");
      }
    } else {
      toast.error("Unexpected error occurred.");
    }

    return false;
  }
};
export const fetchBacklogReport = async (htno: string) => {
  try {
    const baseUrl = isNative() 
      ? 'https://jntuhresults.dhethi.com/api'
      : '';
    let url: string = isNative()
      ? `${baseUrl}/getBacklogs?rollNumber=${htno}`
      : `/api/proxy?endpoint=getBacklogs&rollNumber=${htno}`;

    const response = await axios.get(url, { timeout: 20 * 1000 });
    if ("details" in response.data) {
      saveToLocalStorage(
        htno + "-Backlogreport",
        JSON.stringify(response.data),
      );
      return true;
    }
    if (response.data.status === "success") {
      toast(response.data.message);
    } else if (response.data.status === "failure") {
      toast.error(response.data.message);
    }

    return false;
  } catch {
    toast.dismiss();
    toast.error("SERVER ISSUE!!");
    return false;
  }
};

export const fetchCreditsCheckerReport = async (htno: string) => {
  try {
    const baseUrl = isNative() 
      ? 'https://jntuhresults.dhethi.com/api'
      : '';
    let url: string = isNative()
      ? `${baseUrl}/getCreditsChecker?rollNumber=${htno}`
      : `/api/proxy?endpoint=getCreditsChecker&rollNumber=${htno}`;

    toast.loading("Result are been fetched");
    const response = await axios.get(url, { timeout: 20 * 1000 });
    if ("details" in response.data) {
      saveToLocalStorage(
        htno + "-CreditsCheckerreport",
        JSON.stringify(response.data),
      );
      toast.dismiss();
      return true;
    }
    if (response.data.status === "success") {
      toast.dismiss();
      toast(response.data.message);
    } else if (response.data.status === "failure") {
      toast.dismiss();
      toast.error(response.data.message);
    }

    return false;
  } catch {
    toast.dismiss();
    toast.error("SERVER ISSUE!!");
  }
};

export const fetchCreditContrastReport = async (
  htno1: string,
  htno2: string,
) => {
  let response;
  try {
    const baseUrl = isNative() 
      ? 'https://jntuhresults.dhethi.com/api'
      : '';
    let url: string = isNative()
      ? `${baseUrl}/getResultContrast?rollNumber1=${htno1}&rollNumber2=${htno2}`
      : `/api/proxy?endpoint=getResultContrast&rollNumber1=${htno1}&rollNumber2=${htno2}`;

    toast.loading("Result are been fetched");
    response = await axios.get(url, { timeout: 20 * 1000 });
    if ("studentProfiles" in response.data) {
      saveToLocalStorage(
        htno1 + "-" + htno2 + "-CreditContrastreport",
        JSON.stringify(response.data),
      );
      return true;
    }
    if (response.data.status === "success") {
      toast.dismiss();
      toast(response.data.message);
    } else if (response.data.status === "failure") {
      toast.dismiss();
      toast.error(response.data.message);
    }

    return false;
  } catch (error: any) {
    toast.dismiss();
    if (error.response.status == 400) {
      toast.error(error.response.data.detail);
    } else {
      toast.error("SERVER ISSUE!!");
    }
  }
};

export const fetchNotifications = async (params: Params) => {
  try {
    const baseUrl = isNative() 
      ? 'https://jntuhresults.dhethi.com/api'
      : '';
    let url: string = isNative()
      ? `${baseUrl}/notifications?page=${params.page}&degree=${params.degree}&regulation=${params.regulation}&title=${params.title}&year=${params.year}`
      : `/api/proxy?endpoint=notifications&page=${params.page}&degree=${params.degree}&regulation=${params.regulation}&title=${params.title}&year=${params.year}`;
    const response = await axios.get(url);

    if (response.status === 200) {
      if (response.data.status === "success") {
        return null;
      }
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
};

export const fetchClassResult = async (
  htno: string,
  type: string = "academicresult",
) => {
  try {
    const baseUrl = isNative() 
      ? 'https://jntuhresults.dhethi.com/api'
      : '';
    let url: string = isNative()
      ? `${baseUrl}/getClassResults?rollNumber=${htno}`
      : `/api/proxy?endpoint=getClassResults&rollNumber=${htno}`;

    toast.loading("Result are been fetched");

    const response = await axios.get(url, { timeout: 20 * 1000 });

    console.log(response);
    if (response.data && response.data.length > 0) {
      saveToLocalStorage(
        htno + "-ClassResult-" + type,
        JSON.stringify(response.data),
      );
      toast.dismiss();
      return true;
    }

    if (response.data.status === "success") {
      toast.dismiss();
      toast(response.data.message);
    } else if (response.data.status === "failure") {
      toast.dismiss();
      toast.error(response.data.message);
    }

    return false;
  } catch {
    toast.dismiss();

    toast.error("SERVER ISSUE!!");
    return false;
  } finally {
    toast.dismiss();
  }
};

export const fetchGraceMarksEligibility = async (htno: string) => {
  try {
    const baseUrl = isNative() 
      ? 'https://jntuhresults.dhethi.com/api'
      : '';
    let url: string = isNative()
      ? `${baseUrl}/grace-marks/eligibility?rollNumber=${htno}`
      : `/api/grace-marks/eligibility?rollNumber=${htno}`;

    toast.loading("Checking grace marks eligibility...");
    const response = await axios.get(url, { timeout: 20 * 1000 });
    
    if (response.data && ("eligibility" in response.data || "details" in response.data)) {
      saveToLocalStorage(
        htno + "-GraceMarksEligibility",
        JSON.stringify(response.data),
      );
      toast.dismiss();
      toast.success("Eligibility checked successfully");
      return true;
    }
    
    if (response.data.status === "success") {
      toast.dismiss();
      toast(response.data.message);
    } else if (response.data.status === "failure") {
      toast.dismiss();
      toast.error(response.data.message);
    }

    return false;
  } catch (error: any) {
    toast.dismiss();
    if (error.response?.status === 400) {
      toast.error(error.response.data.detail || error.response.data.error);
    } else {
      toast.error("SERVER ISSUE!!");
    }
    return false;
  }
};

export const fetchGraceMarksProof = async (htno: string) => {
  try {
    const baseUrl = isNative() 
      ? 'https://jntuhresults.dhethi.com/api'
      : '';
    let url: string = isNative()
      ? `${baseUrl}/grace-marks/proof?rollNumber=${htno}`
      : `/api/grace-marks/proof?rollNumber=${htno}`;

    toast.loading("Fetching grace marks proof...");
    const response = await axios.get(url, { timeout: 20 * 1000 });
    
    if (response.data && ("proof" in response.data || "details" in response.data)) {
      saveToLocalStorage(
        htno + "-GraceMarksProof",
        JSON.stringify(response.data),
      );
      toast.dismiss();
      toast.success("Proof fetched successfully");
      return true;
    }
    
    if (response.data.status === "success") {
      toast.dismiss();
      toast(response.data.message);
    } else if (response.data.status === "failure") {
      toast.dismiss();
      toast.error(response.data.message);
    }

    return false;
  } catch (error: any) {
    toast.dismiss();
    if (error.response?.status === 400) {
      toast.error(error.response.data.detail || error.response.data.error);
    } else {
      toast.error("SERVER ISSUE!!");
    }
    return false;
  }
};

export const fetchLatestNotifications = async (): Promise<Result[] | null> => {
  try {
    let url: string = `/api/getlatestnotifications`;
    const response = await axios.get(url, { 
      timeout: 20 * 1000,
      validateStatus: (status) => status < 500, // Accept 4xx as valid responses
    });

    if (response.status === 200) {
      // Check for error status in response data
      if (response.data?.status === "success" || response.data?.status === "failure") {
        return null;
      }
      
      // Handle both array and object responses
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data?.notifications && Array.isArray(response.data.notifications)) {
        return response.data.notifications;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (response.data?.results && Array.isArray(response.data.results)) {
        return response.data.results;
      }
      
      // If response.data exists but is not an array, log and return null
      if (response.data) {
        console.warn("Unexpected response format from latest notifications API:", response.data);
      }
      
      return null;
    } else {
      console.error(
        `Failed to fetch latest notifications. Status: ${response.status}`,
      );
      return null;
    }
  } catch (error: any) {
    // Only log actual errors, not expected 4xx responses
    if (error.response?.status >= 500 || !error.response) {
      console.error("An error occurred while fetching latest notifications:", error);
    }
    return null;
  }
};
