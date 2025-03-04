const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.getReviews = functions.https.onRequest(async (req, res) => {
  const movie = req.path.split('/').pop() || req.query.movie;
  try {
    const snapshot = await admin.firestore().collection('reviews').doc(movie).collection('userReviews').get();
    const reviews = snapshot.docs.map(doc => doc.data());
    res.json(reviews);
  } catch (err) {
    res.status(500).send('Error reading reviews');
  }
});

exports.postReviews = functions.https.onRequest(async (req, res) => {
  const movie = req.path.split('/').pop() || req.query.movie;
  const { rating, comment } = req.body;

  if (!rating || !comment || rating < 1 || rating > 5) {
    return res.status(400).send('Invalid rating or comment');
  }

  try {
    await admin.firestore().collection('reviews').doc(movie).collection('userReviews').add({
      rating: parseInt(rating),
      comment: comment.trim(),
      date: new Date().toLocaleString()
    });
    res.status(200).send('Review saved');
  } catch (err) {
    res.status(500).send('Error saving review');
  }
});