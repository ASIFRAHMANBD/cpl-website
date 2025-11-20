
(function () {
    //===== Prealoder

    window.onload = function () {
        window.setTimeout(fadeout, 500);
    }

    function fadeout() {
        document.querySelector('.preloader').style.opacity = '0';
        document.querySelector('.preloader').style.display = 'none';
    }


    /*=====================================
    Sticky
    ======================================= */
    window.onscroll = function () {
        var header_navbar = document.querySelector(".navbar-area");
        var sticky = header_navbar.offsetTop;

        var logo = document.querySelector('.navbar-brand img')
        if (window.pageYOffset > sticky) {
          header_navbar.classList.add("sticky");
          logo.src = 'assets/images/logo/logo.png';
        } else {
          header_navbar.classList.remove("sticky");
          logo.src = 'assets/images/logo/logo.png';
        }

        // show or hide the back-top-top button
        var backToTo = document.querySelector(".scroll-top");
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            backToTo.style.display = "flex";
        } else {
            backToTo.style.display = "none";
        }
    };


    
    // section menu active
	function onScroll(event) {
		var sections = document.querySelectorAll('.page-scroll');
		var scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

		for (var i = 0; i < sections.length; i++) {
			var currLink = sections[i];
			var val = currLink.getAttribute('href');
			var refElement = document.querySelector(val);
			var scrollTopMinus = scrollPos + 73;
			// if (refElement.offsetTop <= scrollTopMinus && (refElement.offsetTop + refElement.offsetHeight > scrollTopMinus)) {
			// 	document.querySelector('.page-scroll').classList.remove('active');
			// 	currLink.classList.add('active');
			// } else {
			// 	currLink.classList.remove('active');
			// }
		}
	};

    window.document.addEventListener('scroll', onScroll);
    
    // for menu scroll 
    var pageLink = document.querySelectorAll('.page-scroll');

    pageLink.forEach(elem => {
        elem.addEventListener('click', e => {
            e.preventDefault();
            document.querySelector(elem.getAttribute('href')).scrollIntoView({
                behavior: 'smooth',
                offsetTop: 1 - 60,
            });
        });
    });

    // WOW active
    new WOW().init();

    let filterButtons = document.querySelectorAll('.portfolio-btn-wrapper button');
    filterButtons.forEach(e =>
        e.addEventListener('click', () => {

            let filterValue = event.target.getAttribute('data-filter');
            iso.arrange({
                filter: filterValue
            });
        })
    );

    var elements = document.getElementsByClassName("portfolio-btn");
    for (var i = 0; i < elements.length; i++) {
        elements[i].onclick = function () {
            var el = elements[0];
            while (el) {
                if (el.tagName === "BUTTON") {
                    el.classList.remove("active");
                }
                el = el.nextSibling;
            }
            this.classList.add("active");
        };
    };

    //===== mobile-menu-btn
    let navbarToggler = document.querySelector(".mobile-menu-btn");
    navbarToggler.addEventListener('click', function () {
        navbarToggler.classList.toggle("active");
    });

  /**
   * Animation on scroll function and init
   */
 function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });
 

  /**
   * Initiate Pure Counter
   */
  // new PureCounter();

  /**
   * Init isotope layout and filters
   */
   
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {

    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
  //  alert(filters);
      filters.addEventListener('click', function() {
        
        
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

    /**
   * Init isotope layout and filters Event
   */
   
  document.querySelectorAll('.isotope-layout-event').forEach(function(isotopeItem) {

    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container-event'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container-event'), {
        itemSelector: '.isotope-item-event',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
  //  alert(filters);
      filters.addEventListener('click', function() {
        
        
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  // Testimonials carousel (guard for jQuery presence)
    if (window.jQuery && $('.testimonial-carousel').length) {
      $('.testimonial-carousel').owlCarousel({
          autoplay: true,
          smartSpeed: 1000,
          loop: true,
          nav: false,
          dots: true,
          items: 1,
          dotsData: true,
      });
    }

    // Client carousel (guard for jQuery presence)
    if (window.jQuery && $('.client-carousel').length) {
      $('.client-carousel').owlCarousel({
          autoplay: true,
          autoplayTimeout: 2500,
          autoplayHoverPause: true,
          smartSpeed: 700,
          loop: true,
          nav: false,
          dots: false,
          margin: 12,
          responsive: {
            0: { items: 2 },
            576: { items: 3 },
            992: { items: 5 }
          }
      });
    }








})();

// Click ripple wave for cards (vanilla JS)
(function(){
  function addClickWave(selector){
    document.querySelectorAll(selector).forEach(function(el){
      el.addEventListener('click', function(e){
        var rect = el.getBoundingClientRect();
        var wave = document.createElement('span');
        wave.className = 'wave';
        var size = Math.max(rect.width, rect.height) * 1.2;
        wave.style.setProperty('--wave-size', size + 'px');
        wave.style.left = (e.clientX - rect.left) + 'px';
        wave.style.top = (e.clientY - rect.top) + 'px';
        el.appendChild(wave);
        wave.addEventListener('animationend', function(){ wave.remove(); });
      });
    });
  }
  addClickWave('.services-text-part-1, .services-text-part-2, .service-page-offer-content, .tech-category-card');
})();


  