import $ from "jquery";
import 'jquery.nivo.slider.js';

interface JQuery {
    nivoSlider(options?: any): JQuery;
}

export default function Run() {
    $(document).ready(function () {
        
        (function ($) {
            "use strict";
            ($('#nivoslider') as any).nivoSlider({
                effect: 'random',
                slices: 15,
                boxCols: 8,
                boxRows: 4,
                animSpeed: 500,
                pauseTime: 5000,
                startSlide: 0,
                directionNav: true,
                controlNavThumbs: false,
                controlNav: false,
                pauseOnHover: false,
                manualAdvance: false
            });


        })(jQuery);
        (function ($) {
            "use strict";

            /*----------------------------
             jQuery MeanMenu
            ------------------------------ */
            ($('.mobile-menu nav')as any).meanmenu({
                meanScreenWidth: "991",
                meanMenuContainer: ".mobile-menu"
            });

            /*----------------------------
             wow js
            ------------------------------ */
            // new WOW().init();

            /*----------------------------
             product-slider
            ------------------------------ */
            // $(".product-slider").owlCarousel({
            //     autoPlay: false,
            //     slideSpeed: 2000,
            //     pagination: false,
            //     navigation: false,
            //     items: 3,
            //     itemsDesktop: [1199, 3],
            //     itemsDesktopSmall: [980, 3],
            //     itemsTablet: [768, 2],
            //     itemsMobile: [479, 1],
            // });

            /*----------------------------
             feature-product-slider
            ------------------------------ */
            ($(".feature-product-slider")as any).owlCarousel({
                autoPlay: false,
                slideSpeed: 2000,
                pagination: false,
                navigation: true,
                margin: 30,
                items: 4,
                itemsDesktop: [1199, 4],
                itemsDesktopSmall: [980, 3],
                itemsTablet: [768, 2],
                itemsMobile: [479, 1],
            });

            /*----------------------------
             new-product-slider
            ------------------------------ */
            ($(".new-product-slider")as any).owlCarousel({
                autoPlay: false,
                slideSpeed: 2000,
                pagination: false,
                navigation: true,
                items: 4,
                itemsDesktop: [1199, 4],
                itemsDesktopSmall: [980, 3],
                itemsTablet: [768, 2],
                itemsMobile: [479, 1],
            });

            /*----------------------------
             testimonial-slider
            ------------------------------ */
            ($(".testimonial-slider")as any).owlCarousel({
                autoPlay: false,
                slideSpeed: 2000,
                pagination: true,
                navigation: false,
                items: 1,
                itemsDesktop: [1199, 1],
                itemsDesktopSmall: [980, 1],
                itemsTablet: [768, 1],
                itemsMobile: [479, 1],
            });

            /*----------------------------
             sell-slider
            ------------------------------ */
            ($(".sell-area .sell-slider")as any).owlCarousel({
                autoPlay: false,
                slideSpeed: 2000,
                pagination: false,
                navigation: false,
                items: 5,
                itemsDesktop: [1199, 4],
                itemsDesktopSmall: [1100, 3],
                itemsTablet: [768, 2],
                itemsMobile: [479, 1],
            });

            /*----------------------------
             features-home2-slider
            ------------------------------ */
            ($(".features-home2-slider")as any).owlCarousel({
                autoPlay: false,
                slideSpeed: 2000,
                pagination: false,
                navigation: true,
                items: 4,
                itemsDesktop: [1199, 3],
                itemsDesktopSmall: [980, 2],
                itemsTablet: [768, 2],
                itemsMobile: [360, 1],
            });

            /*----------------------------
             sell-off-slider
            ------------------------------ */
            ($(".sell-off-slider")as any).owlCarousel({
                autoPlay: false,
                slideSpeed: 2000,
                pagination: false,
                navigation: false,
                items: 4,
                itemsDesktop: [1199, 3],
                itemsDesktopSmall: [980, 3],
                itemsTablet: [768, 2],
                itemsMobile: [479, 1],
            });

            /*----------------------------
             product-page-slider
            ------------------------------ */
            ($(".product-page-slider")as any).owlCarousel({
                autoPlay: false,
                slideSpeed: 2000,
                pagination: false,
                navigation: true,
                items: 3,
                itemsDesktop: [1199, 3],
                itemsDesktopSmall: [980, 3],
                itemsTablet: [768, 3],
                itemsMobile: [360, 2],
            });

            /*----------------------------
            upsell-slider
            ------------------------------ */
            ($(".upsell-slider")as any).owlCarousel({
                autoPlay: false,
                slideSpeed: 2000,
                pagination: false,
                navigation: true,
                items: 4,
                itemsDesktop: [1199, 3],
                itemsDesktopSmall: [980, 3],
                itemsTablet: [768, 2],
                itemsMobile: [479, 1],
            });

            /*----------------------------
             related-slider
            ------------------------------ */
            ($(".related-slider")as any).owlCarousel({
                autoPlay: false,
                slideSpeed: 2000,
                pagination: false,
                navigation: true,
                items: 4,
                itemsDesktop: [1199, 3],
                itemsDesktopSmall: [980, 3],
                itemsTablet: [768, 2],
                itemsMobile: [479, 1],
            });

            /*----------------------------
             price-slider active
            ------------------------------ */
            ($("#slider-range")as any).slider({
                range: true,
                min: 100,
                max: 750,
                values: [100, 700],
                slide: function (event:any, ui:any) {
                    $("#amount").val("" + ui.values[0] + " -- " + ui.values[1]);
                }
            });
            $("#amount").val("" + $("#slider-range").slider("values", 0) +
                " -- " + $("#slider-range").slider("values", 1));

            /*----------------------------
             elevateZoom active
            ------------------------------ */
            /* $(".optima_zoom").elevateZoom({gallery:'optima_gallery', cursor: 'pointer', galleryActiveClass: "active", imageCrossfade: true, loadingIcon: ""});
        
            $(".optima_zoom").bind("click", function(e) {
                var ez =   $('.optima_zoom').data('elevateZoom');
                ez.closeAll();
                $.fancybox(ez.getGalleryList());
                return false;
            }); */

            /*----------------------------
             cart-plus-minus-button active
            ------------------------------ */
            $(".cart-plus-minus").append('<div class="dec qtybutton"><</div><div class="inc qtybutton">></div>');
            $(".qtybutton").on("click", function () {
                var $button = $(this);
                var oldValueStr = $button.parent().find("input").val(); // Lấy giá trị là một chuỗi hoặc undefined
                if (oldValueStr !== undefined) {
                    var oldValue = parseFloat(oldValueStr); // Chuyển đổi thành số
                    if (!isNaN(oldValue) && oldValue > 0) {
                        var newVal = oldValue - 1;
                    } else {
                        newVal = 0;
                    }
                    $button.parent().find("input").val(newVal);
                }
            });

            /*--------------------------
             scrollUp
            ---------------------------- */
            //Check to see if the window is top if not then display button
            $(window).scroll(function () {
                const $window = $(this);
                if ($window?.scrollTop?.() ?? 0 > 300) { // Sử dụng toán tử nullish coalescing ??
                    $('#scrollUp').fadeIn();
                } else {
                    $('#scrollUp').fadeOut();
                }
            });
            

            //Click event to scroll to top
            $('#scrollUp').click(function () {
                $('html, body').animate({ scrollTop: 0 }, 800);
                return false;
            });

            /*--------------------------
             tooltip
            ---------------------------- */
            // const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
            // const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

        })(jQuery);

    });
}