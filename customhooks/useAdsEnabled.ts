"use client";

import { useState, useEffect } from "react";
import { getAdsConfig } from "@/lib/settings";

export function useAdsEnabled() {
  const [adsEnabled, setAdsEnabled] = useState<boolean>(true);
  const [publisherId, setPublisherId] = useState<string>("ca-pub-1589551808134823");
  const [slotId, setSlotId] = useState<string>("8618507332");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAdsConfig = async () => {
      try {
        const config = await getAdsConfig();
        setAdsEnabled(config.enabled);
        setPublisherId(config.publisherId);
        setSlotId(config.slotId);
      } catch (error) {
        console.error("Error checking ads config:", error);
        // Default to true if there's an error
        setAdsEnabled(true);
      } finally {
        setLoading(false);
      }
    };

    checkAdsConfig();

    // Check periodically for updates (every 5 minutes)
    const interval = setInterval(checkAdsConfig, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { adsEnabled, publisherId, slotId, loading };
}

