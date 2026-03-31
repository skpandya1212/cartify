import React from "react";
import "./RatingSummary.css";

function RatingSummary({ reviews = [] }) {

  const total = reviews.length;

  const getPercent = (star) => {

    const count = reviews.filter(r => r.rating === star).length;

    return total ? (count / total) * 100 : 0;

  };

  return (

    <div className="rating-summary">

      <h3>Rating Summary</h3>

      {[5,4,3,2,1].map((star) => (

        <div key={star} className="rating-row">

          <span>{star}⭐</span>

          <div className="bar">

            <div
              className="fill"
              style={{ width: `${getPercent(star)}%` }}
            />

          </div>

          <span>{Math.round(getPercent(star))}%</span>

        </div>

      ))}

    </div>

  );

}

export default RatingSummary;