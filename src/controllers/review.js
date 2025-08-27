import Review from "../models/review.js";

export const addReview = async (req, res) => {
  const { name, email, occupation, review } = req.body;
  const reviewData = new Review({
    name,
    email,
    occupation,
    review,
  });
  await reviewData.save();
  res.status(201).json(reviewData);
};
