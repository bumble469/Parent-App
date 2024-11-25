// Utility function to calculate star rating and provide messages
export function calculateStarRating(overallMarks, averageAttendance) {
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
  } else {
    ratingMessage = 'Excellent: Great job!';
  }

  return { starRating: starRating.toFixed(1), fullStars, halfStar, emptyStars, ratingMessage };
}