import { useState, useEffect } from "react";
import { useProduct } from "./features/products/useProduct";
import { NutritionCard } from "./my-components/nutrition/NutritionCard";
import { InsightsCard } from "./my-components/nutrition/InsightsCard";
import { BarcodeScanner } from "./my-components/BarcodeScanner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { X, Scan, Search, Camera } from "lucide-react";
import { toast } from "sonner";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [barcode, setBarcode] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [pendingScan, setPendingScan] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);

  const { data, isLoading, error } = useProduct(barcode);

  const handleSearch = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      toast.error("Please enter a barcode");
      return;
    }
    if (!/^\d+$/.test(trimmed)) {
      toast.error("Barcode must contain only numbers");
      return;
    }
    setBarcode(trimmed);
  };

  const isValidBarcode = (code: string) => /^\d+$/.test(code);

  const getScoreBadgeClass = (score: string): string => {
    const classes: Record<string, string> = {
      A: "bg-emerald-100 text-emerald-700",
      B: "bg-green-100 text-green-700",
      C: "bg-yellow-100 text-yellow-700",
      D: "bg-orange-100 text-orange-700",
      E: "bg-red-100 text-red-700",
    };
    return classes[score.toUpperCase()] || "bg-gray-100 text-gray-600";
  };

  // Clear input when scanner is closed
  useEffect(() => {
    if (!showScanner && pendingScan) {
      setPendingScan(false);
    }
  }, [showScanner]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to fetch product");
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl">🥗</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Nutrino</h1>
          </div>
          <p className="text-gray-600 text-lg">Scan • Understand • Eat Better</p>
        </div>

        {/* Search Input Section */}
      <div className="max-w-xl mx-auto mb-12 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        {/* Input on top - full width */}
          <div className="relative mb-4">
            <Input
              placeholder="Enter barcode number..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className={`${isLoading || scanLoading ? "opacity-50 pointer-events-none" : "opacity-100"} h-14 text-lg pl-6 pr-12 rounded-2xl border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500`}
              disabled={(isLoading || scanLoading) }
            />
            
            {inputValue && (
              <button
                onClick={() => setInputValue("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear input"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleSearch}
              disabled={(isLoading || scanLoading)  || !inputValue.trim()}
              className={`${isLoading || scanLoading ? "opacity-50 pointer-events-none" : "opacity-100"} flex-1 h-14 rounded-2xl font-semibold bg-indigo-600 hover:bg-indigo-700`}
            >
              <Search className="mr-2" size={20} />
              Search Barcode
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowScanner(!showScanner)}
              disabled={(isLoading || scanLoading) }
              className={`${isLoading || scanLoading ? "opacity-50 pointer-events-none" : "opacity-100"} h-14 px-8 rounded-2xl border-2 border-gray-300 hover:bg-gray-50 flex items-center gap-2`}
            >
              <Camera size={20} />
              <span className="hidden sm:inline">Scan</span>
            </Button>
          </div>
        </div>

        {/* Scanner */}
        {showScanner && (
          <div className="max-w-2xl mx-auto mb-12">
            <BarcodeScanner
              onScan={(code) => {
                if (!isValidBarcode(code)) {
                  toast.error("Invalid barcode");
                  return;
                }
                setInputValue(code);
                setBarcode(code);
                setShowScanner(false);
              }}
              scanLoading={scanLoading}
              setScanLoading={setScanLoading}
            />
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Fetching product information...</p>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600 font-medium">Failed to load product</p>
            <p className="text-sm text-red-500 mt-1">{error.message}</p>
          </div>
        )}

        {/* Product Display */}
        {data && !pendingScan && !isLoading && (
          <div className="space-y-8">
            {/* Product Header */}
            <div className="bg-white rounded-3xl shadow p-6 flex flex-col sm:flex-row gap-6 items-start">
              {data.product.image_url && (
                <img
                  src={data.product.image_url}
                  alt={data.product.name}
                  className="w-28 h-28 object-cover rounded-2xl shadow-sm"
                />
              )}
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-2xl leading-tight">{data.product.name}</h2>
                <p className="text-gray-600 mt-1">{data.product.brand}</p>
                {data.product.category && (
                  <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest">{data.product.category}</p>
                )}
              </div>

              {data.product.nutriscore && (
                <div className={`px-6 py-3 rounded-2xl text-4xl font-black self-start ${getScoreBadgeClass(data.product.nutriscore)}`}>
                  {data.product.nutriscore.toUpperCase()}
                </div>
              )}
            </div>

            {/* Insights */}
            <InsightsCard 
              insights={data.insights} 
              ingredient_analysis={data.ingredient_analysis} 
            />

            {/* Nutrition */}
            <NutritionCard 
              analysis={data.analysis} 
              energy={data.energy}
            />

            <p className="text-center text-xs text-gray-500 pt-4">
              Data from OpenFoodFacts • Analysis based on WHO guidelines
            </p>
          </div>
        )}

        {/* Empty State */}
        {!data && !isLoading && !error && !showScanner && (
          <div className="text-center py-20">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Scan size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">Ready to scan?</h3>
            <p className="text-gray-500 mt-2 max-w-xs mx-auto">
              Enter a barcode or use the camera to get instant nutrition insights
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;