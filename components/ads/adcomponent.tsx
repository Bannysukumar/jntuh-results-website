// components/AdComponent.tsx
"use client";
import { useEffect, useRef } from "react";
import { useAdsEnabled } from "@/customhooks/useAdsEnabled";

const AdComponent = () => {
  const { adsEnabled, publisherId, slotId, loading } = useAdsEnabled();
  const adInitialized = useRef(false);

  useEffect(() => {
    if (!adsEnabled || loading || typeof window === "undefined" || !publisherId || !slotId) {
      return;
    }

    // Check if script is already loaded
    const existingScript = document.querySelector(`script[src*="adsbygoogle.js?client=${publisherId}"]`);
    
    if (!existingScript) {
      // Remove old scripts with different publisher IDs
      const oldScripts = document.querySelectorAll('script[src*="adsbygoogle.js"]');
      oldScripts.forEach(script => script.remove());
      adInitialized.current = false;

      // Load the AdSense script with the current publisher ID
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
      script.crossOrigin = "anonymous";
      script.onload = () => {
        // Initialize the ad after script loads
        setTimeout(() => {
          if (!adInitialized.current) {
            try {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              adInitialized.current = true;
            } catch (e) {
              console.error("Adsbygoogle error:", e);
            }
          }
        }, 100);
      };
      document.head.appendChild(script);
    } else {
      // Script already loaded, just initialize the ad if not done
      if (!adInitialized.current) {
        setTimeout(() => {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            adInitialized.current = true;
          } catch (e) {
            console.error("Adsbygoogle error:", e);
          }
        }, 100);
      }
    }
  }, [adsEnabled, loading, publisherId, slotId]);

  // Reset initialization when IDs change
  useEffect(() => {
    adInitialized.current = false;
  }, [publisherId, slotId]);

  if (loading) {
    return null;
  }

  if (!adsEnabled || !publisherId || !slotId) {
    return null;
  }

  return (
    <div>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={publisherId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdComponent;
