// app/components/InputBox.tsx
import { useState } from "react";

export default function InputBox({audioPrompt, response}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async () => {
    // if (input.trim() === "") return;
    setLoading(true);
    await audioPrompt({input});
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="space-y-4">
        {/* Input Box */}
        <div className="flex flex-col items-center space-y-2">
        <textarea
  value={input}
  onChange={handleInputChange}
  placeholder="Enter your prompt"
  className="w-full p-2 h-32 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300"
/>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin border-t-4 border-indigo-600 border-8 w-12 h-12 rounded-full"></div>
          </div>
        )}

        {/* Output Box */}
        {response && !loading && (
          <div className="p-4 bg-gray-200 rounded-md dark:bg-gray-700 dark:text-white">
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
