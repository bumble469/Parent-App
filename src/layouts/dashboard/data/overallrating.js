export function calculateStarRating(overallMarks, averageAttendance, t) {
  if (overallMarks == null || averageAttendance == null || isNaN(overallMarks) || isNaN(averageAttendance)) {
    return {
      starRating: 'N/A',
      fullStars: 0,
      halfStar: 0,
      emptyStars: 5,
      ratingMessage: t('noRatingAvailable'),
    };
  }

  overallMarks = Math.max(0, Math.min(100, overallMarks));
  averageAttendance = Math.max(0, Math.min(100, averageAttendance));

  const weightedRating = overallMarks * 0.6 + averageAttendance * 0.4;

  const starRating = (weightedRating / 100) * 5;

  const fullStars = Math.floor(starRating);
  const halfStar = starRating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  let ratingMessage = '';
  if (starRating <= 1) {
    ratingMessage = t('veryPoor'); 
  } else if (starRating <= 2) {
    ratingMessage = t('bad'); 
  } else if (starRating <= 3) {
    ratingMessage = t('average'); 
  } else if (starRating <= 4) {
    ratingMessage = t('good'); 
  } else if (starRating > 4 && starRating <= 5) {
    ratingMessage = t('excellent'); 
  } else {
    ratingMessage = t('noRatingForNow'); 
  }

  return { starRating: starRating.toFixed(1), fullStars, halfStar, emptyStars, ratingMessage };
}
