function yoSlider(options) {
    var self = this;
    
    var timeout = null; // identifier of timer
    var timeoutDelay = null; // identifier of timer delay

    var elem = options.elem, // identifier of timer
        circular = (options.circular) ? options.circular : false, // boolean - Do autoscrolling or not
        timeOffset = (options.timeOffset) ? options.timeOffset : 5000, // integer - time interval for autoscrolling (at start)
        timeDelay = (options.timeDelay) ? options.timeDelay : 10000; // integer - time interval for autoscrolling after click on prev/next buttons & thumbnail
    
    this.init = function() {
        if (elem.length !== 0) {
            var elemHtml = elem.html(),
                size = 0,
                sliderHtml = '',
                itemsHtml = '',
                thumbnailHtml = '';
            
            if (elem.children('img').length !== 0) {
                elem.addClass('slider-wrapper');
                elem.children('img').each(function() {
                    itemsHtml += '<div class="big-photos-item">' + $(this)[0].outerHTML + '</div>';
                    thumbnailHtml += '<div class="mini-photos-item"><div>' + $(this)[0].outerHTML + '</div></div>';
                    size++;
                });
                
                sliderHtml = '<div class="slider-container"><div class="slider-big-photos clearer-block">' + itemsHtml + '</div>'
                            + '<div class="slider-mini-photos clearer-block">' + thumbnailHtml + '</div></div>'
                            + '<a class="slider-nav-arrow prev">&lt;</a><a class="slider-nav-arrow next">&gt;</a>';
                            
                elem.html(sliderHtml);
                
                options.width = elem.width();
                options.size = size;
                self.setActive(0);
                
                self.autoSlide(timeOffset);
            } else {
                console.log('Sorry, selector has not images for slider.');
            }
        } else {
            console.log('Selector for slider is wrong!');
        }
    }

    this.prev = function() {
        var prevPosition = self.getActive() - 1;
        if (self.getActive() > 0) {
            elem.find('.slider-big-photos').animate({
                left : (-1) * prevPosition * options.width
            });
            self.setActive(prevPosition);
        } else {
            self.toLast();
        }
    };

    this.next = function() {
        var nextPosition = self.getActive() + 1;
        if (nextPosition < options.size) {
            elem.find('.slider-big-photos').animate({
                left : (-1) * nextPosition * options.width
            });
            self.setActive(nextPosition);
        } else {
            self.toFirst();
        }
    };
    
    this.setActive = function(index) {
        elem.find('.slider-mini-photos .mini-photos-item').removeClass('active');
        elem.find('.slider-mini-photos .mini-photos-item:eq(' + index + ')').addClass('active');
    };
    
    this.getActive = function() {
        return elem.find('.slider-mini-photos .mini-photos-item.active').index();
    };
    
    this.toFirst = function() {
        elem.find('.slider-big-photos').fadeTo('fast' , 0.2, function() {
            elem.find('.slider-big-photos').css({
                left : 0
            });
        });
        elem.find('.slider-big-photos').fadeTo('fast' , 1);
        self.setActive(0);
    };
    
    this.toLast = function() {
        var lastIndex = options.size - 1;
        elem.find('.slider-big-photos').fadeTo('fast' , 0.2, function() {
            elem.find('.slider-big-photos').css({
                left : (-1) * lastIndex * options.width
            });
        });
        elem.find('.slider-big-photos').fadeTo('fast' , 1);
        self.setActive(lastIndex);
    };
    
    this.toItem = function(index) {
        if ((index - self.getActive() == 1) || (index - self.getActive() == - 1)) {
            elem.find('.slider-big-photos').animate({
                left : (-1) * index * options.width
            });
        } else {
            elem.find('.slider-big-photos').fadeTo('fast' , 0.2, function() {
                elem.find('.slider-big-photos').css({
                    left : (-1) * index * options.width
                });
            });
            elem.find('.slider-big-photos').fadeTo('fast' , 1);
        }
        self.setActive(index);
    };
    
    this.autoSlide = function(timer) {
        if (circular) {
            timeout = setInterval(function() {
                self.next();
            }, timer);
        }
    }
    
    this.init();
    
    elem.on('click', '.slider-nav-arrow', function() {
        if ($(this).hasClass('prev')) {
            self.prev();
        } else {
            self.next();
        }
        
        clearTimeout(timeout);
        clearTimeout(timeoutDelay);
        timeoutDelay = setTimeout(function() {
            self.autoSlide(timeOffset);
        }, timeDelay - timeOffset);
    });
    
    elem.on('click', '.mini-photos-item', function() {
        var index = elem.find('.slider-mini-photos .mini-photos-item').index($(this));
        self.toItem(index);
        
        clearTimeout(timeout);
        clearTimeout(timeoutDelay);
        timeoutDelay = setTimeout(function() {
            self.autoSlide(timeOffset);
        }, timeDelay - timeOffset);
    });
}


$(function() {
    var mySlider = new yoSlider({
        elem: $('#yo-slider'),
        circular: true,
        timeOffset: 5000,
        timeDelay: 10000
    });
});