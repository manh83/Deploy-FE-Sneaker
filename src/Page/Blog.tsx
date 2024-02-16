
import { useGetAllBlogsQuery } from '../Services/Api_Blogs'
import { IBlog } from '../Models/interfaces'
import parse from 'html-react-parser';
import Loading from '../Component/Loading';

const Blog = () => {
    const { data: blogData,isLoading } = useGetAllBlogsQuery()
    return (
        <div className='w-[90vw] mx-auto'>
            {isLoading ? <Loading /> : <div>
                <div className="blog-banner">
                    <img src="img/product/banner.jpg" alt="" />
                </div>
                <div className="blog-main">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="location">
                                    <ul>
                                        <li><a href="/" title="go to homepage">Home<span>/</span></a>  </li>
                                        <li><strong> blog</strong></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-9">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="sidebar-title">
                                            <h2>Blog Posts</h2>
                                        </div>
                                        <div className="blog-area">

                                            {blogData?.data?.map((item: IBlog) => {
                                                return (
                                                    <div className="single-blog-post-page relative h-[330px]">
                                                        <div className="blog-img">
                                                            <a href={`blog/${item._id}/detail`}>
                                                                <img className="w-[400px] h-[200px] object-cover" src={item?.imgUrl[0]} alt="" />
                                                            </a>
                                                        </div>
                                                        <div className="blog-content">
                                                            <a href={`blog/${item._id}/detail`} className="blog-title">{item?.title}</a>
                                                            <span><a href="#"> By {item.author}- </a>17 Aug 2015 ( 0 comments )</span>
                                                            <div className="h-[150px] objectfit-cover"><p className="h-[150px]" >{parse(item?.description)}</p></div>
                                                            <a href={`blog/${item._id}/detail`} className="readmore mt-10 absolute">read more </a>
                                                        </div>
                                                    </div>
                                                )

                                            })}

                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="toolbar-bottom">
                                            <ul>
                                                <li><span>Pages:</span></li>
                                                <li className="current"><a href="#">1</a></li>
                                                <li><a href="#">2</a></li>
                                                <li><a href="#">3</a></li>
                                                <li><a href="#"> <img src="img/product/pager_arrow_right.gif" alt="" /> </a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default Blog