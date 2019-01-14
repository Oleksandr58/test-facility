function initSlider(selector) {
    $(selector).slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplaySpeed: 5000,
        speed: 500,
        prevArrow: '.js-slider-prev',
        nextArrow: '.js-slider-next',
        zIndex: 0
    });    
}