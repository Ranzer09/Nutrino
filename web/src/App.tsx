import { useState } from "react";
import { useProduct } from "./features/products/useProduct";

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
        <pre className="bg-gray-100 p-4 mt-4 text-sm overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;