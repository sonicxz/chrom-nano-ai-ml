import React, { useEffect, useState } from 'react';

function extractRating(input:string) {
    // Regular expression to match the rating in the format "RATE: x"
    const match = input.match(/RATE:\s*(\d)/);
    
    // If a match is found, return the rating (as a number)
    if (match) {
      return parseInt(match[1], 10);
    }
    
    // Return null if no rating is found
    return null;
  }

const StarRating = ({ratingText}:{ratingText:string}) => {
  const [rating, setRating] = useState(0);

  // Handle click on star
  const handleClick = (index) => {
    setRating(index + 1); // set rating to the clicked star position
  };

  useEffect(() => {
    if(!ratingText) return;
    const rating = extractRating(ratingText);
    setRating(rating);
  }, [ratingText]);

  return (
    <div className="flex items-center space-x-1">
      {Array(5)
        .fill(0) // Array with 5 elements for 5 stars
        .map((_, index) => (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            className={`w-8 h-8 cursor-pointer transition-all duration-300 transform ${
              index < rating ? 'text-yellow-500 scale-125' : 'text-gray-300'
            }`}
            fill={index < rating ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
            onClick={() => handleClick(index)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 17.75l-5.2 3.5 1.4-6.3-4.8-4.2 6.5-.6L12 2l2.1 7.5 6.5.6-4.8 4.2 1.4 6.3L12 17.75z"
            />
          </svg>
        ))}
    </div>
  );
};

export default StarRating;
