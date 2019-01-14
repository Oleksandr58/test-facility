function buildProducts() {
    $.getJSON('json/products.json', function(data) {
        $.each(data, function() {
            var product = document.querySelector('#js-product'),
            name = product.content.querySelector('.product__title'),
            img = product.content.querySelector('img'),
            id = product.content.querySelector('.product__id'),
            price = product.content.querySelector('.product__price'),
            addBtn = product.content.querySelector('.product__add'),
            products = data["products"];
            
    
            for (var i = 0; i < products.length; i++) {     
              name.textContent = products[i].name;
              id.textContent = products[i].id;
              price.textContent = products[i].price + products[i].currency;
              addBtn.setAttribute('data-id', products[i].id);
              img.setAttribute("src", products[i].img);

              var clone = document.importNode(product.content, true);
            
              document.querySelector('.products__list').appendChild(clone);     
            }

            initAddBtns(products);
        });
    });
}

function initAddBtns(allProducts) {
    var addedProducts = [];

    $(document).on('click', '.js-add-product', function() {
        var btn = $(this);

        btn.toggleClass('active');

        var alreadyAddedProduct = addedProducts.filter(function(product) {
            return product.id == btn.data('id');
        });

        if (alreadyAddedProduct.length) {
            addedProducts = addedProducts.filter(function(product) {
                return product.id != btn.data('id');
            });
        } else {
            var currentProduct = allProducts.filter(function(product) {
                return product.id == btn.data('id');
            })[0];

            currentProduct.size = findProductSize(btn.data('id'));

            addedProducts.push(currentProduct);
        }

        changeAmount(addedProducts);
    });

    initAddRemoveBtns();
    initSizeBtns();
    sendOrder();

    function findProductSize(productId) {
        return $('.js-add-product[data-id="' + productId + '"]').closest('.product')
                                                        .find('.js-size-product.active')
                                                        .text();
    }

    function initAddRemoveBtns() {
        $(document).on('click', '.js-product-minus', function() {
            var amount = $(this).closest('.b-product').find('.js-product-amount'),
                amountNumber = +amount.text() - 1;

            if (amountNumber) {
                rebuildAddedObj(amount, amountNumber);
            } else {
                addedProducts = addedProducts.filter(function(product) {
                    return product.id != amount.data('id');
                });

                changeAmount(addedProducts);
            }
        });


        $(document).on('click', '.js-product-plus', function() {
            var amount = $(this).closest('.b-product').find('.js-product-amount'),
                amountNumber = +amount.text() + 1;

            rebuildAddedObj(amount, amountNumber);
        });
    }

    function rebuildAddedObj(amount, amountNumber) {
        amount.text(amountNumber);

        $.each(addedProducts, function(index, product) {
            if (product.id == amount.data('id')) product.amount = amountNumber;
        });

        buildBasket(addedProducts);

    }

    function initSizeBtns() {
        $(document).on('click', '.js-size-product', function() {
            var btn = $(this),
                addBtn = btn.closest('.product').find('.js-add-product'),
                size = '';

            if (btn.hasClass('active')) {
                btn.removeClass('active');
            } else {
                btn.closest('.product')
                    .find('.js-size-product.active')
                    .removeClass('active');

                btn.addClass('active');
                size = btn.text();
            }

            $.each(addedProducts, function(index, product) {
                if (product.id == addBtn.data('id')) product.size = size;
            });
    
            buildBasket(addedProducts);
        });
    }

    function sendOrder() {
        $('.js-send-order').on('click', function() {
            addedProducts = [];

            buildBasket(addedProducts);
            alert('Oke');
        });
    }
}

function initLikeBtns() {
    $(document).on('click', '.js-like-product', function() {
        $(this).toggleClass('active');
    });
}

function changeAmount(addedProducts) {
    var amountBlock = $('.js-product-amount');
    
    if (addedProducts.length) {
        amountBlock.show()
                    .text(addedProducts.length);
    } else {
        amountBlock.hide();
    }

    buildBasket(addedProducts);
}

function buildBasket(addedProducts) {
        var product = document.querySelector('#js-product-basket'),
        name = product.content.querySelector('.b-product__title'),
        img = product.content.querySelector('.b-product__img'),
        size = product.content.querySelector('.js-b-product__size'),
        price = product.content.querySelector('.b-product__price'),
        amount = product.content.querySelector('.js-product-amount'),
        productsList = document.querySelector('.js-basket-products'),
        totalPrice = document.querySelector('.js-total-price'),
        total = 0;

        productsList.innerHTML = '';
        totalPrice.innerHTML = ' ';

        for (var i = 0; i < addedProducts.length; i++) {
          var tempTotal = addedProducts[i].amount ? 
                            addedProducts[i].amount * (addedProducts[i].price) : 
                            addedProducts[i].price;

          name.textContent = addedProducts[i].name;
          price.textContent = tempTotal + addedProducts[i].currency;
          amount.textContent = addedProducts[i].amount ? addedProducts[i].amount : 1;
          amount.setAttribute('data-id', addedProducts[i].id);
          img.setAttribute("src", addedProducts[i].img);
          size.textContent = addedProducts[i].size ? addedProducts[i].size : '';
          
          total += +tempTotal;

          var clone = document.importNode(product.content, true);
                    
          productsList.appendChild(clone);     
        }

        totalPrice.innerHTML = total;
}

function initBasketBtns() {
    $('.js-open-basket').on('click', function() {
        $('.js-basket').toggleClass('active');
    });
}