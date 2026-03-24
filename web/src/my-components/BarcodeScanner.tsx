import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "sonner";

type Props = {
  onScan: (code: string) => void;
};

export const BarcodeScanner: React.FC<Props> = ({ onScan }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasScannedRef = useRef(false);

  const isRunningRef = useRef(false);
  const [isRunningUI, setIsRunningUI] = useState(false);
  const [loading, setLoading] = useState(false);

  const stopScanner = async () => {
    try {
      if (scannerRef.current && isRunningRef.current) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();

        scannerRef.current = null;
        isRunningRef.current = false;
        setIsRunningUI(false);
      }
    } catch (err) {
      console.error("Stop error:", err);
    }
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopScanner();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const startScanner = async () => {
    try {
      setLoading(true);
      if (isRunningRef.current) return;

      hasScannedRef.current = false;

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());

      const devices = await Html5Qrcode.getCameras();

      if (!devices?.length) {
        toast.error("No camera devices found");
        return;
      }

      const cameraId =
        devices.find((d) =>
          d.label.toLowerCase().includes("back")
        )?.id || devices[0].id;

      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;
      await scanner.start(
        cameraId,
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          if (hasScannedRef.current) return;
          
          hasScannedRef.current = true;

          toast.success(`Barcode scanned - ${decodedText}`);
          
          onScan(decodedText);
          
          stopScanner();
        },
        () => {}
      );

      isRunningRef.current = true;   
      setIsRunningUI(true);         

    } catch (err: any) {
      if (err.name === "NotAllowedError") {
        toast.error("Camera permission denied");
      } else {
        toast.error("Failed to start scanner");
      }
    } finally {
      setTimeout(() => {
       setLoading(false);   
    }, 1000);
  }
  };

  return (
    <div className="mt-4">

      {/* BUTTON */}
      {!isRunningUI ? (
        <button
          disabled={loading}
          onClick={startScanner}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
          {loading ? "Starting camera..." : "Start Camera"}
        </button>
      ) : (
        <button
          disabled={loading}
          onClick={stopScanner}
          className="bg-red-500 text-white px-4 py-2 rounded w-full"
        >
          Stop Camera
        </button>
      )}

      {/* SCANNER VIEW */}
      <div
        id="reader"
        className="w-full mt-4 rounded overflow-hidden"
      />
    </div>
  );
};