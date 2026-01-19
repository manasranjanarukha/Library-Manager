export default function ReviewCard({ review }) {
  const { comment, createdAt, user = {} } = review;

  const { fullName, profilePicture } = user;

  // const fullName = review?.user?.fullName || "Anonymous";

  // Generate initials from name for avatar fallback
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Render star rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      {/* Header with profile info */}
      <div className="flex items-start gap-3 mb-3">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt={user}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
              {getInitials(fullName)}
            </div>
          )}
        </div>

        {/* User info and rating */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="font-medium text-gray-900 truncate">
              {fullName || "Anonymous"}
            </h3>
            <div className="flex items-center gap-1">
              {renderStars(review.rating)}
            </div>
          </div>

          {/* Date (optional) */}
          {review.date && (
            <p className="text-xs text-gray-500 mt-1">
              {new Date(review.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          )}
        </div>
      </div>

      {/* Review Comment */}
      <p className="text-gray-700 text-sm leading-relaxed break-words">
        {comment}
      </p>

      {/* Optional: Helpful buttons (like Google Play Store) */}
      {review.showActions && (
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
          <button className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
            Helpful
          </button>
          <span className="text-xs text-gray-400">•</span>
          <button className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
            Report
          </button>
        </div>
      )}
    </div>
  );
}

// Example usage with demo data
//  export default function Demo() {
//   const sampleReviews = [
//     {
//       user: 'Sarah Johnson',
//       rating: 5,
//       comment: 'Absolutely love this product! The quality exceeded my expectations and the customer service was outstanding. Highly recommend to anyone looking for a reliable solution.',
//       date: '2025-10-15',
//       profilePicture: 'https://i.pravatar.cc/150?img=1',
//       showActions: true
//     },
//     {
//       user: 'Michael Chen',
//       rating: 4,
//       comment: 'Great experience overall. The interface is intuitive and easy to use. Only minor issue was the initial setup took longer than expected.',
//       date: '2025-10-10',
//       showActions: true
//     },
//     {
//       user: 'Emma Williams',
//       rating: 5,
//       comment: 'Best purchase I\'ve made this year! Works perfectly and the design is sleek. Five stars all the way!',
//       date: '2025-10-08',
//       profilePicture: 'https://i.pravatar.cc/150?img=5',
//       showActions: true
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h1>
//         <div className="space-y-4">
//           {sampleReviews.map((review, index) => (
//             <ReviewCard key={index} review={review} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
