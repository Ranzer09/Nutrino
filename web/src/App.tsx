import { useState } from "react";
import { useProduct } from "./features/products/useProduct";
import { NutritionCard } from "./components/nutrition/NutritionCard";

function App() {
  const [barcode, setBarcode] = useState("");

  const { data, isLoading, error } = useProduct(barcode);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Nutrino
      </h1>

      {/* Input */}
      <input
        type="text"
        placeholder="Enter barcode"
        className="border p-2 w-full mb-4"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
      />

      {/* Loading */}
      {isLoading && <p>Loading...</p>}

      {/* Error */}
      {error && (
        <p className="text-red-500">
          Error fetching product
        </p>
      )}

      {/* Data */}
      {data && (
      <>
        <h2 className="text-xl font-semibold text-center mt-4">
          {data.product.name}
        </h2>

        <NutritionCard analysis={data.analysis} />

        <p className="text-xs text-gray-500 text-center mt-3">
          All values are based on per 100g of product
        </p>
      </>
      )}
    </div>
  );
}

export default App;