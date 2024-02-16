import React from 'react'

const Footer = () => {
    return (
        <div>
            <div className="footer-top-area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-6">
                            <div className="footer-contact">
                                <img src="../../../img/logo-white.png" className='w-[250px]' />
                                <p className='mt-4'>Hệ thống giày sneaker tại Hà Nội</p>
                                <ul className="address">
                                    <li>
                                        <span className="fa fa-home" />
                                        Xuân Phương, Nam Từ Liêm, Hà Nội
                                    </li>
                                    <li>
                                        <span className="fa fa-phone" />
                                        (800) 123 456 789
                                    </li>
                                    <li>
                                        <span className="fa fa-envelope-o" />
                                        vole543215@gmail.com
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="">
                                <p className="font-semibold text-lg mb-4 text-center ">Phương thức thanh toán</p>
                                <div className="grid grid-cols-5 gap-2 ">
                                    <img className="border border-black rounded-lg" src="../../../img/agribank.png" alt="" />
                                    <img className="border  rounded-lg" src="../../../img/teckcombank.jpg" alt="" />
                                    <img className="border  rounded-lg" src="../../../img/imagesStar.jpg" alt="" />
                                    <img className="border  rounded-lg" src="../../../img/momo.png" alt="" />
                                    <img className="border  rounded-lg" src="../../../img/unnamed.png" alt="" />
                                </div>
                                <div className="contents">
                                    <p className="text-bold text-base -mb-10 mt-5 ml-4">Dịch vụ giao hàng</p>
                                    <img className="rounded-lg w-[80px] mt-4 ml-6" src="../../../img/Untitled-1.png" alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="footer-support">
                                <div className="footer-title ">
                                    <h3 className=''>HỖ TRỢ KHÁCH HÀNG</h3>
                                </div>
                                <div className="footer-menu">
                                    <ul>
                                        <a href="#" className='text-gray-400'><li>- Chính sách khách hàng thân thiết</li></a>
                                        <a href="#" className='text-gray-400'><li>- Chính sách đổi trả</li></a>
                                        <a href="#" className='text-gray-400'><li>- Chính sách bảo hành</li></a>
                                        <a href="#" className='text-gray-400'><li>- Chính sách bảo mật</li></a>
                                        <a href="#" className='text-gray-400'><li>- Câu hỏi thường gặp</li></a>
                                        <a href="#" className='text-gray-400'><li>- Hướng dẫn mua hàng online</li></a>
                                        <a href="#" className='text-gray-400'><li>- Hướng dẫn kiểm tra hạng thẻ thành viên</li></a>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="footer-info">
                                <div className="footer-title">
                                    <h3>THÔNG TIN CỬA HÀNG</h3>
                                </div>
                                <div className="footer-menu mb-4">
                                    <p className='text-sm underline'>Địa chỉ 1</p>
                                    <li className='text-xs mt-2'>F15 tầng 1 AEON Mall Tân Phú, 30 Bờ Bao Tân Thắng, Phường Sơn Kỳ, TP Hồ Chí Minh</li>

                                </div>
                                <div className="footer-menu mb-4">
                                    <p className='text-sm underline'>Địa chỉ 2</p>
                                    <li className='text-xs mt-2'>809 Giải Phóng, Phường Giáp Bát, Quận Hoàng Mai, TP Hà Nội</li>

                                </div>
                                <div className="footer-menu mb-4">
                                    <p className='text-sm underline'>Địa chỉ 3</p>
                                    <li className='text-xs mt-2'>192 - 194 Hoa Lan, Phường 2, Quận Phú Nhuận, TP Hồ Chí Minh</li>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Footer
