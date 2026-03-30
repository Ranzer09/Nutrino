import { useState } from "react";
import { useProduct } from "./features/products/useProduct";
import { useEffect } from "react";
import { NutritionCard } from "./my-components/nutrition/NutritionCard";
import { InsightsCard } from "./my-components/nutrition/InsightsCard";
import { BarcodeScanner } from "./my-components/BarcodeScanner";
import { Input } from "../components/ui/input"
import { toast } from "sonner"
import { Button } from "../components/ui/button"
import { X } from "lucide-react";


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
      toast.error("Barcode cannot be empty");
      return;
    }

    if (!isValidBarcode(trimmed)) {
      toast.error("Barcode must contain only numbers");
      return;
    }

    setBarcode(trimmed);
  };
  
  type ApiError = Error;

  const isValidBarcode = (code: string) => /^\d+$/.test(code);

  const isCurrentProduct = (data: any, input: string) => {
    return input === data?.product?.barcode;
  };

  const getScoreBadgeClass = (score: string): string => {
    const classes: Record<string, string> = {
      A: 'text-green-700',
      B: 'text-green-500',
      C: 'text-yellow-400',
      D: 'text-orange-500',
      E: 'text-red-600',
    };

    return classes[score.toUpperCase()] ?? 'text-gray-200 text-gray-500';
  };
  
  const handleKeyDown = (e:any) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      
      handleSearch(); 
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (!showScanner) {
      setScanLoading(false);
    }
  }, [showScanner]);

  const catchError = (apiError:ApiError) =>{
    if (apiError.message.includes('timeout'))
      return'Request Timed Out. Try again in a while'
    else
      return apiError.message
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Nutrino
        </h1>

        {/* INPUT AREA */}
      <div className="flex flex-col sm:flex-row gap-2 w-full max-w-lg mx-auto">    
        <div className=" relative w-full">
          <Input
            disabled={isLoading || pendingScan}
            placeholder="Enter barcode"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pr-10 w-full" 
          />
          
          {inputValue && !isLoading && (
            <button
              onClick={() => setInputValue("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              type="button" 
              aria-label="Clear input"
            >
              <X size={16} />
            </button>
          )}
      </div>

          <Button disabled={isLoading || pendingScan || isCurrentProduct(data,inputValue) } onClick={handleSearch}>
            Search
          </Button>

          <Button
              disabled={isLoading || scanLoading}
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
              if (!isValidBarcode(code)) {
                toast.error("Invalid barcode scanned");
                return;
              }

              setInputValue(code);
              setBarcode(code);
              setShowScanner(false);
              setPendingScan(false);
            }}
            scanLoading={scanLoading} 
            setScanLoading={setScanLoading}
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
              Error: <span className="font-normal opacity-90">{catchError(error)}.</span>  
              </p>
            </div>
          </div>
        )}
        {/* DATA */}
        {data && !pendingScan && (
          <>
            <div className="bg-white rounded-xl shadow p-4 flex gap-4 items-center mt-4">
              <img
                src={data?.product?.image_url || './assets/placeholder.png'}
                alt="product"
                className="w-20 h-20 object-cover rounded"
              />

              <div className="flex-1">
                <h2 className="font-semibold">{data?.product?.name}</h2>
                <p className="text-sm text-gray-500">{data?.product?.brand}</p>
              </div>

              <div className="flex items-center gap-2">

                <span className="hidden md:inline-block font-medium text-gray-600">
                  Nutriscore:
                </span>

                {data?.product?.nutriscore ? (
                  <p className={`px-3 py-1 rounded-md text-lg font-bold transition-colors ${getScoreBadgeClass(data.product.nutriscore)}`}>
                    {data.product.nutriscore.toUpperCase()}
                  </p>
                ) : (
                  <span className="text-gray-400 italic text-sm">N/A</span>
                )}
              </div>
            </div>

            <InsightsCard 
              insights={data.insights} 
              ingredient_analysis={data.ingredient_analysis} 
            />           
            <NutritionCard 
              analysis={data.analysis} 
              energy={data.energy}
            />

           <p className="text-xs text-gray-500 text-center mt-3">
            Values based on WHO guidelines • Per serving shown when available
           </p>
          </>
        )}
      </div>
      {!data && !isLoading && !error && (
        <div className="text-center text-gray-500 mt-5">
          <p className="text-lg">Scan a product to begin</p>
          <p className="text-sm">Get instant nutrition insights</p>
        </div>
      )}
    </div>
  );
}

export default App;
