import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import "./StarRating.css";

function StarRating({ rating, setRating }) {

  const [hover, setHover] = useState(0);

  return (

    <div className="star-rating">

      {[...Array(5)].map((_, index) => {

        const ratingValue = index + 1;

        return (

          <FaStar
            key={index}
            size={28}
            color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
            onClick={() => setRating(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
          />

        );

      })}

    </div>

  );

}

export default StarRating;