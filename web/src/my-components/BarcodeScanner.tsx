import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "sonner";

type Props = {
  onScan: (code: string) => void;
};

export const BarcodeScanner: React.FC<Props> = ({ onScan }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasScannedRef = useRef(false);

  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);

  const stopScanner = async () => {
    try {
      if (scannerRef.current && isRunning) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
        scannerRef.current = null;
        setIsRunning(false);
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
      if (isRunning) return;
      hasScannedRef.current = false;
      setLoading(true);

      if (!navigator.mediaDevices?.getUserMedia) {
        toast.error("Camera not supported in this browser");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      stream.getTracks().forEach((track) => track.stop());

      const devices = await Html5Qrcode.getCameras();

      if (!devices || devices.length === 0) {
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

          toast.success("Barcode scanned");

          onScan(decodedText);

          stopScanner();
        },
        () => {} // ignore scan errors
      );

      setIsRunning(true);

    } catch (err: any) {
      console.error("Scanner error:", err);

      if (err.name === "NotAllowedError") {
        toast.error("Camera permission denied");
      } else if (err.name === "NotFoundError") {
        toast.error("No camera found");
      } else {
        toast.error("Failed to start scanner");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">

      {/* BUTTON */}
      {!isRunning ? (
        <button
          onClick={startScanner}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Starting camera..." : "Start Camera"}
        </button>
      ) : (
        <button
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