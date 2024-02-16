import React from 'react';
import { useGetAllCommentsQuery } from '../../../Services/Api_Comment';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
const Testimonial = () => {
    // const { data: getComment, isLoading, isError } = useGetAllCommentsQuery();

//     if (isLoading) {
//         return <div>Loading...</div>;
//     }

//     if (isError) {
//         return <div>Error occurred.</div>;
//     }

//     const settings = {
//         dots: true,
//         infinite: true,
//         speed: 500,
//         slidesToShow: 1,
//         slidesToScroll: 1
//     };

//     if (!getComment || getComment.length === 0) {
//     return null; // Ẩn slideshow khi không có bình luận
// }


    return (
        <div>
            <div className="testimonial-area">
                <div className="container">
                    <div className="row">
                        {/* {getComment.length > 0 && (
                            <Slider {...settings}>
                                {getComment.slice(0, 5).map(comment => (
                                    <div className="single-testimonial" key={comment._id}>
                                        <div className="spech">
                                            <a href={`/product/${comment.productId._id}`}>{comment.content}</a>
                                        </div>
                                        <div className="avater">
                                            <img className='mx-auto' src={comment.userId.imgUrl} alt={comment.userId.username} />
                                        </div>
                                        <div className="post-by">
                                            <span>{comment.userId.username}</span>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        )} */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Testimonial;