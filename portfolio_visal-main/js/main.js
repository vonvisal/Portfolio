$(document).ready(function() {

    /* 0. Light / Dark Mode Toggle */
    const root = document.documentElement;
    const $themeToggle = $('#themeToggle');

    function getCurrentTheme() {
        return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }

    $themeToggle.on('click', function() {
        const newTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    /* 1. Navbar Scroll Effect */
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.site-nav').addClass('scrolled');
        } else {
            $('.site-nav').removeClass('scrolled');
        }
    });

    /* 1b. Mobile menu toggle */
    const $navToggle = $('#navToggle');
    const $navLinksPanel = $('#navLinks');

    function closeMobileMenu() {
        $navToggle.removeClass('open').attr('aria-expanded', 'false');
        $navLinksPanel.removeClass('open');
    }

    $navToggle.on('click', function() {
        const isOpen = $navLinksPanel.toggleClass('open').hasClass('open');
        $navToggle.toggleClass('open', isOpen).attr('aria-expanded', isOpen);
    });

    /* 1c. Scrollspy: highlight nav link for section in view */
    const $sections = $('section[id]');
    const $navLinks = $('.nav-link');

    function updateActiveNavLink() {
        let scrollPos = $(window).scrollTop() + 100; // offset for navbar height
        let currentId = null;

        $sections.each(function() {
            const top = $(this).offset().top;
            const bottom = top + $(this).outerHeight();
            if (scrollPos >= top && scrollPos < bottom) {
                currentId = $(this).attr('id');
            }
        });

        if (currentId) {
            $navLinks.removeClass('active');
            $navLinks.filter('[href="#' + currentId + '"]').addClass('active');
        }
    }

    $(window).on('scroll', updateActiveNavLink);
    updateActiveNavLink(); // run once on load

    /* 2. Smooth Scrolling */
    $('a.nav-link, .custom-btn, .custom-btn-outline').on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;

            closeMobileMenu();

            $('html, body').animate({
                scrollTop: $(hash).offset().top - 70 // Adjust offset for fixed navbar
            }, 800, function(){
                window.location.hash = hash;
            });
        }
    });

    /* 3. Typing Effect */
    const texts = ["Web Developer Intern"];
    let count = 0;
    let index = 0;
    let currentText = '';
    let letter = '';
    let isDeleting = false;

    function type() {
        if (count === texts.length) {
            count = 0;
        }
        currentText = texts[count];

        if (isDeleting) {
            letter = currentText.slice(0, --index);
        } else {
            letter = currentText.slice(0, ++index);
        }

        document.getElementById('typed-text').textContent = letter;

        let typeSpeed = 100;

        if (isDeleting) {
            typeSpeed /= 2; // Delete faster
        }

        if (!isDeleting && letter.length === currentText.length) {
            typeSpeed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && letter.length === 0) {
            isDeleting = false;
            count++;
            typeSpeed = 500; // Pause before typing next word
        }

        setTimeout(type, typeSpeed);
    }
    
    // Start typing effect
    type();


    /* 4. Portfolio Filtering */
    $('.filter-btn').on('click', function() {
        // Active class toggle
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');

        const filterValue = $(this).attr('data-filter');

        if(filterValue === 'all') {
            $('.portfolio-item').show(400);
        } else {
            $('.portfolio-item').not('.' + filterValue).hide(400);
            $('.portfolio-item').filter('.' + filterValue).show(400);
        }
    });

    /* 5. Scroll Animations (Intersection Observer fallback using jQuery) */
    // Native Intersection Observer is better for performance
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                $(entry.target).addClass('visible');
                // Optional: stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    $('.fade-in').each(function() {
        observer.observe(this);
    });

    /* 6. Contact Form Submission (Prevent default for demo) */
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        
        // Simple visual feedback
        const btn = $(this).find('button[type="submit"]');
        const originalText = btn.text();
        
        btn.html('<i class="fas fa-circle-notch fa-spin"></i> Sending...');
        btn.prop('disabled', true);
        
        setTimeout(() => {
            btn.html('<i class="fas fa-check"></i> Sent Successfully!');
            btn.removeClass('btn-primary').addClass('btn-success');
            
            // Reset form
            this.reset();
            
            setTimeout(() => {
                btn.html(originalText);
                btn.removeClass('btn-success').addClass('btn-primary');
                btn.prop('disabled', false);
            }, 3000);
            
        }, 1500);
    });
    
    /* 7. Set background colors for placeholder images */
    $('.placeholder-img').each(function() {
        const bg = $(this).attr('data-bg');
        if(bg) {
            // Because we don't have actual images yet, we style the img tag's background
            // and use a transparent pixel or just let the background color show
            $(this).css('background-color', bg);
            // Replace src with a transparent pixel to show background color
            $(this).attr('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
        }
    });

    /* 8. Mouse Parallax Effect on Hero */
    $(document).on('mousemove', function(e) {
        // Only run if hero is visible (for performance)
        if (window.scrollY < window.innerHeight) {
            const x = (e.clientX * -1) / 50;
            const y = (e.clientY * -1) / 50;
            
            // Move background shapes slightly
            $('.hero-bg-shapes').css('transform', `translate(${x}px, ${y}px)`);
        }
    });
});
