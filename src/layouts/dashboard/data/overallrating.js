// Utility function to calculate star rating and provide messages
export function calculateStarRating(overallMarks, averageAttendance) {
  // Check for invalid input and return a default value if either marks or attendance is invalid
  if (overallMarks == null || averageAttendance == null || isNaN(overallMarks) || isNaN(averageAttendance)) {
    return {
      starRating: 'N/A',
      fullStars: 0,
      halfStar: 0,
      emptyStars: 5,
      ratingMessage: 'No rating available',
    };
  }

  // Ensure the values are between 0 and 100
  overallMarks = Math.max(0, Math.min(100, overallMarks));
  averageAttendance = Math.max(0, Math.min(100, averageAttendance));

  // Calculate overall rating with weights
  const weightedRating = overallMarks * 0.6 + averageAttendance * 0.4;

  // Convert to star rating out of 5
  const starRating = (weightedRating / 100) * 5;

  // Determine the number of full, half, and empty stars
  const fullStars = Math.floor(starRating);
  const halfStar = starRating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  // Generate a message based on the star rating
  let ratingMessage = '';
  if (starRating <= 1) {
    ratingMessage = 'Very Poor: Please attend to your child immediately.';
  } else if (starRating <= 2) {
    ratingMessage = 'Bad: Needs a lot of improvement.';
  } else if (starRating <= 3) {
    ratingMessage = 'Average: Has room for improvement.';
  } else if (starRating <= 4) {
    ratingMessage = 'Good: Keep going.';
  } else if (starRating > 4 && starRating <= 5) {
    ratingMessage = 'Excellent: Great job!';
  } else {
    ratingMessage = "No rating for now..";
  }

  return { starRating: starRating.toFixed(1), fullStars, halfStar, emptyStars, ratingMessage };
}
