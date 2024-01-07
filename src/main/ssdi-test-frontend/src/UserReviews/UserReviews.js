import {useEffect, useState} from 'react';
import {Box, Button, Rating, TextField, Typography} from '@mui/material';
import './UserReviews.css'
import {url} from "../Helper/Helper";
import {useSnackbar} from "../Snackbar/SnackbarContext";

function UserReviews() {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({
        name: localStorage.getItem("FoodTruckAppFirstName"),
        rating: 3,
        comment: ''
    });
    const {showSnackbar} = useSnackbar();

    const handleToast = (message) => {
        showSnackbar(message);
    }

    useEffect(() => {
        // Fetch reviews from endpoint and set state
        fetch(url + '/getReviewsByFoodTruckId?id=' + localStorage.getItem("FoodTruckAppSelectedFoodTruck"), {
            method: 'GET'
        })
            .then(response => response.json())
            .then(reviews => {
                setReviews(reviews);
                console.log(reviews); // Optional: Log the reviews array to the console to see if data is being retrieved correctly
            })
            .catch(error => console.error(error));

    }, []);

    const handleNewReviewChange = (event) => {
        // Update state with new review form input
        setNewReview({...newReview, [event.target.name]: event.target.value});
        console.log(newReview);
    };

    const handleNewReviewSubmit = (event) => {
        event.preventDefault();
        console.log(newReview);

        // Post new review to endpoint and update state with new review
        fetch(url + '/addReview', {
            method: 'POST',
            body: JSON.stringify({
                foodtruck_id: localStorage.getItem("FoodTruckAppSelectedFoodTruck"),
                user_id: localStorage.getItem("FoodTruckAppID"),
                name: newReview.name,
                rating: newReview.rating,
                review: newReview.comment,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(review => setReviews([...reviews, review]))
            .then(() => handleToast("Review added successfully"))
            .catch(error => console.error(error));

        // Clear new review form input
        setNewReview({rating: 3, comment: ''});
    };

    return (
        <div className="reviewBorder">
            <Box sx={{
                mb: 2,
                display: "flex",
                flexDirection: "column",
                height: '135%',
                width: '140%',
                overflow: "hidden",
                overflowY: "scroll",
            }}>
                {/* Display list of reviews */}
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <Box key={review.id} sx={{
                            mb: 1,
                            p: 2,
                            borderRadius: 4,
                            boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.15)',
                            backgroundColor: '#fff',
                        }}>
                            <Typography variant="subtitle1" sx={{mb: 1}}>
                                {review.name}
                            </Typography>
                            <Typography variant="subtitle2" gutterBottom>
                                Rating: <Rating value={review.rating} readOnly size="small"/>
                            </Typography>
                            <Typography variant="body2" sx={{mb: 1}}>
                                {review.review}
                            </Typography>
                        </Box>
                    ))
                ) : (
                    <Typography variant="body2" align="center" gutterBottom>
                        No reviews yet.
                    </Typography>
                )}
            </Box>
            {/* Form for adding new review */}
            <Box sx={{
                mt: 1,
                display: "flex",
                flexDirection: "column",
                height: 300,
                width: '140%'
            }}>
                <Typography variant="h6" gutterBottom>
                    Write a Review
                </Typography>
                <form onSubmit={handleNewReviewSubmit}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: 50
                    }}>
                        <Rating
                            name="rating"
                            value={newReview.rating}
                            onChange={(event, value) => setNewReview({...newReview, rating: value})}
                            size="small"
                        />
                    </Box>
                    <TextField
                        name="comment"
                        label="Comment"
                        value={newReview.comment}
                        onChange={handleNewReviewChange}
                        fullWidth
                        multiline
                        rows={2}
                        variant="outlined"
                        sx={{mt: 1}}
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{mt: 1}}>
                        Submit Review
                    </Button>
                </form>
            </Box>

        </div>
    );
}

export default UserReviews;
