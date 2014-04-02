(function($, UI) {

    "use strict";

    var Slideshow = function(element, options) {

        var $this            = this,
            $element         = $(element);
            this.container   = $element.find(".uk-slideshow-slides");
            this.slides      = this.container.children();
            this.slidesCount = this.slides.length;
            this.active      = 0,
            this.animating   = false;

        if($element.data("slideshow")) return;

        this.options = $.extend({}, Slideshow.defaults, options);

        // Set animation effect
        $element.addClass(this.options.animation);

        // Set start slide
        this.slides.eq(this.options.start).addClass("uk-active");
        this.current = this.options.start;

        // set background image from img
        this.slides.each(function() {

            var $this = $(this);

            $this.css({"background-image":"url("+ $this.find(">img").attr("src") + ")"});

        });

        $element.on("click", [this.options.next, this.options.previous].join(","), function(e) {
            e.preventDefault();
            $this[$(this).is($this.options.next) ? "next" : "previous"]();
        });

        $element.data("slideshow", this);

        $(window).on("resize load", UI.Utils.debounce(function(){ $this.resize(); }, 100));

        this.resize();
    };

    $.extend(Slideshow.prototype, {

        current: false,

        resize: function() {

            var $this = this, height = 0;

            if (this.options.height === "auto") {

                this.slides.css("height", "").each(function() {
                    height = Math.max(height, $(this).height());
                });

            } else {
                height = this.options.height;
            }

            this.container.css("height", height);
            this.slides.css("height", height);

        },

        show: function(index, direction) {

            if (this.animating) return;

            this.animating = true;

            var $this   = this,
                current = this.slides.eq(this.current),
                next    = this.slides.eq(index),
                dir     = direction ? direction : this.current < index ? "next" : "previous";

            next.one("transitionend animationend webkitAnimationEnd", function() {

                if(!$this.animating) return;

                current.removeClass("uk-active " + (dir === "next" ? "uk-slide-out-next" : "uk-slide-out-prev"));
                next.addClass("uk-active").removeClass(dir === "next" ? "uk-slide-in-next" : "uk-slide-in-prev");

                $this.animating = false;

            });

            current.addClass(dir == "next" ? "uk-slide-out-next" : "uk-slide-out-prev");
            next.addClass(dir == "next" ? "uk-slide-in-next" : "uk-slide-in-prev");

            next.width(); // force redraw

            this.current = index;

        },

        next: function() {
            this.show(this.slides[this.current + 1] ? (this.current + 1) : 0, "next");
        },

        previous: function() {
            this.show(this.slides[this.current - 1] ? (this.current - 1) : (this.slides.length - 1), "previous");
        }

    });

    Slideshow.defaults = {
        animation: "uk-slideshow-animation-press-away",
        duration: 5000,
        height: "auto",
        next: ".uk-slidenav-next",
        previous: ".uk-slidenav-previous",
        start: 0,
        autoplay : true
    };

    UI["slideshow"] = Slideshow;

    // init code
    $(document).on("uk-domready", function(e) {
        $("[data-uk-slideshow]").each(function() {

            var slideshow = $(this);

            if (!slideshow.data("slideshow")) {
                var obj = new Slideshow(slideshow, UI.Utils.options(slideshow.attr("data-uk-slideshow")));
            }
        });
    });

})(jQuery, jQuery.UIkit);