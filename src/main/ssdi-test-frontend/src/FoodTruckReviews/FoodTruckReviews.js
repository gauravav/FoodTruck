import {useEffect, useState} from 'react';
import {Box, Rating, Typography} from '@mui/material';
import './FoodTruckReviews.css'
import {url} from "../Helper/Helper";

function FoodTruckReviews() {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        // Fetch reviews from endpoint and set state
        fetch(url + '/getReviewsByFoodTruckId?id=' + localStorage.getItem("FoodTruckAppFoodTruckID"), {
            method: 'GET'
        })
            .then(response => response.json())
            .then(reviews => {
                setReviews(reviews);
                console.log(reviews); // Optional: Log the reviews array to the console to see if data is being retrieved correctly
            })
            .catch(error => console.error(error));

    }, []);


    return (
        <div className="reviewBorder">
            <Box sx={{
                mb: 2,
                display: "flex",
                flexDirection: "column",
                height: '115%',
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


        </div>
    );
}

export default FoodTruckReviews;
