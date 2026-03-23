import { useState } from "react";
import { useProduct } from "./features/products/useProduct";
import { useEffect } from "react";
import { NutritionCard } from "./my-components/nutrition/NutritionCard";
import { InsightsCard } from "./my-components/nutrition/InsightsCard";
import { BarcodeScanner } from "./my-components/BarcodeScanner";
import { Input } from "../components/ui/input"
import { toast } from "sonner"
import { Button } from "../components/ui/button"


function App() {
  const [inputValue, setInputValue] = useState("");
  const [barcode, setBarcode] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [pendingScan, setPendingScan] = useState(false);

  const { data, isLoading, error } = useProduct(barcode);
  
  const handleSearch = () => {
    if (!inputValue.trim()) {
      toast.error("Barcode cannot be empty");
      return;
    }

    if (!/^\d+$/.test(inputValue)) {
      toast.error("Barcode must contain only numbers");
      return;
    }

    setBarcode(inputValue);
  };
  
  const isCurrentProduct = (data:any) =>{
    return inputValue === data?.product?.barcode
  }

  useEffect(() => {
    if (error) {
      toast.error((error as Error).message || "Failed to fetch product");
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Nutrino
        </h1>

        {/* INPUT AREA */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <Input
            disabled={isLoading || pendingScan}
            placeholder="Enter barcode"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <Button disabled={isLoading || pendingScan || isCurrentProduct(data) } onClick={handleSearch}>
            Search
          </Button>

          <Button
              disabled={isLoading}
              variant="secondary"
              onClick={() => {
                setShowScanner((prev) => {
                  const next = !prev;

                  if (next) {
                    setPendingScan(true); // hide product
                  } else {
                    setPendingScan(false); // restore product
                  }

                  return next;
                });
              }}
            >
              {showScanner ? "Close Scanner" : "Scan Barcode"}
          </Button>
        </div>

        {/* SCANNER */}
        {showScanner && (
          <BarcodeScanner
            onScan={(code) => {
              if (!/^\d+$/.test(code)) {
                toast.error("Invalid barcode scanned");
                return;
              }
              setInputValue(code);
              setShowScanner(false);
              setPendingScan(false); 
            }}
          />
        )}

        {/* Loading */}
        {isLoading && (
          <div className="text-center mt-4">
            <p className="animate-pulse">Fetching product...</p>
          </div>
        )}
        
        {error && (
          <div className="mt-6 mx-auto max-w-md p-4 rounded-xl border border-red-100 bg-red-50/50 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3 justify-center text-red-600">
              <p className="text-sm font-medium">
                Error: <span className="font-normal opacity-90">{error.message}. Please try another Barcode</span>
              </p>
            </div>
          </div>
        )}

        {/* DATA */}
        {data && !pendingScan && (
          <>
            <h2 className="text-lg sm:text-xl font-semibold text-center mt-4">
              {data.product.name} (Barcode:{data.product.barcode})
            </h2>

            <NutritionCard analysis={data.analysis} />
            <InsightsCard insights={data.insights} />

            <p className="text-xs text-gray-500 text-center mt-3">
              All values are based on per 100g of product
            </p>
          </>
        )}
      </div>
      {!data && !isLoading && !error && (
        <p className="text-center text-gray-500 mt-4">
          Enter or scan a barcode to see nutrition details
        </p>
      )}
    </div>
  );
}

export default App;
