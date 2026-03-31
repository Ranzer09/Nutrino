import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { toast } from "sonner";

type Props = {
  onScan: (code: string) => void;
  scanLoading: boolean;
  setScanLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const BarcodeScanner: React.FC<Props> = ({
  onScan,
  scanLoading,
  setScanLoading,
}) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasScannedRef = useRef(false);
  const isRunningRef = useRef(false);

  const [isRunningUI, setIsRunningUI] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const stopScanner = useCallback(async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true }).catch(() => null);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    if (scannerRef.current) {
      if (isRunningRef.current) {
        await scannerRef.current.stop();
      }
      await scannerRef.current.clear();
      scannerRef.current = null;
    }
  } catch (err) {
    console.warn("Scanner cleanup warning:", err);
  } finally {
    isRunningRef.current = false;
    setIsRunningUI(false);
    setScanLoading(false); 
  }
}, [setScanLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  // Handle tab/background visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRunningRef.current) {
        stopScanner();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [stopScanner]);

const startScanner = async () => {
  try {
    if (isRunningRef.current) return;

    if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") {
      throw new Error("Camera access requires a secure (HTTPS) connection");
    }

    setScanLoading(true);
    setErrorMessage(null);
    hasScannedRef.current = false;

    const scanner = new Html5Qrcode("reader", { 
      verbose: false,
      formatsToSupport: [
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.QR_CODE,
      ]
    });

    scannerRef.current = scanner;

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    };

    await scanner.start(
      { facingMode: "environment" }, 
      config,
      (decodedText: string) => {
        if (hasScannedRef.current) return;
        hasScannedRef.current = true;
        toast.success("Scanned successfully!");
        onScan(decodedText.trim());
        stopScanner();
      },
      () => {
      }
    );

    isRunningRef.current = true;
    setIsRunningUI(true);
  } catch (err: any) {
      console.error("Scanner start error:", err);

      let userMessage = "Failed to start camera scanner";

      if (err.name === "NotAllowedError" || err.message.includes("Permission")) {
        userMessage = "Camera permission denied. Please allow camera access in your browser settings.";
      } else if (err.name === "NotFoundError" || err.message.includes("No camera")) {
        userMessage = "No camera detected on this device.";
      } else if (err.name === "NotReadableError") {
        userMessage = "Camera is being used by another app or tab. Close other apps and try again.";
      } else if (err.message.includes("HTTPS")) {
        userMessage = err.message;
      } else if (err.message.includes("iOS") || err.message.includes("Safari")) {
        userMessage = "iOS/Safari camera issues are common. Try refreshing or using Chrome on iOS.";
      }

      setErrorMessage(userMessage);
      toast.error(userMessage);

      // Fallback: offer image upload in future (we can add later)
  } finally {
      setTimeout(() => {
    setScanLoading(false);
      }, 600);
  }
};

  return (
    <div className="mt-4 w-full">
      {!isRunningUI ? (
        <button
          disabled={scanLoading}
          onClick={startScanner}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl w-full font-medium transition-colors disabled:opacity-70"
        >
          {scanLoading ? "Starting camera..." : "Start Camera Scanner"}
        </button>
      ) : (
        <button
          onClick={stopScanner}
          disabled={scanLoading}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl w-full font-medium transition-colors"
        >
          Stop Scanner
        </button>
      )}

      {errorMessage && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {errorMessage}
        </div>
      )}

      <div id="reader" className="w-full aspect-video rounded-2xl bg-black mt-4 overflow-hidden" />
    </div>
  );
};