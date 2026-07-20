/**
 * SCRIPT - OXYGEN WEBSITE REDESIGN
 * Custom interactions, split texts, custom cursor, scroll reveals, count-up stats, interactive map
 * Author: Tristan
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    
    if (cursor && cursorDot) {
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });
        
        // Smooth cursor follow (lerp)
        const animateCursor = () => {
            const lerpFactor = 0.15;
            cursorX += (mouseX - cursorX) * lerpFactor;
            cursorY += (mouseY - cursorY) * lerpFactor;
            
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
            
            requestAnimationFrame(animateCursor);
        };
        animateCursor();
        
        // Hover effects on interactive elements
        const hoverables = document.querySelectorAll('a, button, .service-row, .map-visual circle, .checkbox-btn, input, textarea, select');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovered');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovered');
            });
        });
    }

    // 2. Fullscreen Menu Toggle
    const menuTrigger = document.querySelector('.menu-trigger');
    const fullscreenNav = document.querySelector('.fullscreen-nav');
    
    if (menuTrigger && fullscreenNav) {
        menuTrigger.addEventListener('click', () => {
            menuTrigger.classList.toggle('active');
            fullscreenNav.classList.toggle('active');
            
            // Prevent body scroll when menu is active
            if (fullscreenNav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu on link click
        const navLinks = fullscreenNav.querySelectorAll('.nav-menu-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuTrigger.classList.remove('active');
                fullscreenNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // 3. Floating Pill Dock Navigation entrance animation
    const navPill = document.querySelector('.nav-pill-container');
    if (navPill) {
        setTimeout(() => {
            navPill.classList.add('visible');
        }, 800);
        
        // Active states on scroll
        const sections = document.querySelectorAll('section[id], header[id]');
        const pillLinks = document.querySelectorAll('.nav-pill-link');
        
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPos = window.scrollY + 150;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            pillLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href.includes(current) && current !== '') {
                    link.classList.add('active');
                }
            });
        });
    }

    // 4. Hero Text Split-Word Entrance Animation
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.innerHTML;
        // Check if we already wrapped it or just do it once
        if (!heroTitle.querySelector('span')) {
            const words = text.split(' ');
            heroTitle.innerHTML = words.map((word, i) => {
                return `<span style="transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s">${word}</span>`;
            }).join(' ');
            
            // Trigger animation immediately after load
            setTimeout(() => {
                heroTitle.querySelectorAll('span').forEach(span => {
                    span.style.opacity = '1';
                    span.style.transform = 'translateY(0)';
                });
            }, 100);
        }
    }

    // 5. Scroll Reveal - Intersection Observer
    const reveals = document.querySelectorAll('.reveal, .stagger-reveal');
    if (reveals.length > 0) {
        const observerOptions = {
            root: null,
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // If it's a count-up stat, trigger counting
                    if (entry.target.classList.contains('about-stats')) {
                        const countElements = entry.target.querySelectorAll('[data-target]');
                        countElements.forEach(el => animateCount(el));
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        reveals.forEach(el => revealObserver.observe(el));
    }

    // 6. Stats Count Up Animation
    const animateCount = (element) => {
        const target = parseFloat(element.getAttribute('data-target'));
        const suffix = element.getAttribute('data-suffix') || '';
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        
        const updateCount = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = easeProgress * target;
            
            if (target % 1 === 0) {
                element.textContent = Math.floor(currentValue) + suffix;
            } else {
                element.textContent = currentValue.toFixed(1) + suffix;
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                element.textContent = target + suffix;
            }
        };
        
        requestAnimationFrame(updateCount);
    };

    // 7. Services Editorial Accordion
    const serviceRows = document.querySelectorAll('.service-row');
    if (serviceRows.length > 0) {
        serviceRows.forEach(row => {
            row.addEventListener('click', () => {
                const isActive = row.classList.contains('active');
                
                // Close all rows
                serviceRows.forEach(r => r.classList.remove('active'));
                
                // Open clicked if it wasn't active
                if (!isActive) {
                    row.classList.add('active');
                }
            });
        });
        
        // Open the first one by default
        serviceRows[0].classList.add('active');
    }

    // 8. Offices Map Interaction
    const mapPins = document.querySelectorAll('.map-visual circle');
    const detailCard = document.querySelector('.map-details-card');
    
    // Office database
    const offices = {
        paris: {
            city: 'Paris',
            address: '57 rue Réaumur, 75002 Paris',
            phone: '01 41 11 37 70',
            email: 'paris@oxygen-rp.com'
        },
        bordeaux: {
            city: 'Bordeaux',
            address: '15 Quai de Bacalan, 33300 Bordeaux',
            phone: '05 56 00 20 20',
            email: 'bordeaux@oxygen-rp.com'
        },
        toulouse: {
            city: 'Toulouse',
            address: '53 rue de la pomme, 31000 Toulouse',
            phone: '05 32 11 07 30',
            email: 'toulouse@oxygen-rp.com'
        },
        nantes: {
            city: 'Nantes',
            address: '12 Square de la Métairie, 44000 Nantes',
            phone: '02 40 89 20 10',
            email: 'nantes@oxygen-rp.com'
        },
        lille: {
            city: 'Lille',
            address: '40 Rue de l\'Hôpital Militaire, 59800 Lille',
            phone: '03 20 10 30 40',
            email: 'lille@oxygen-rp.com'
        },
        strasbourg: {
            city: 'Strasbourg',
            address: '12 rue du Vieux Marché aux Grains, 67000 Strasbourg',
            phone: '03 67 10 05 68',
            email: 'strasbourg@oxygen-rp.com'
        },
        lyon: {
            city: 'Lyon',
            address: '10 Rue de la République, 69002 Lyon',
            phone: '04 78 30 40 50',
            email: 'lyon@oxygen-rp.com'
        },
        marseille: {
            city: 'Marseille',
            address: '26 Rue Grignan, 13001 Marseille',
            phone: '04 91 20 30 40',
            email: 'marseille@oxygen-rp.com'
        },
        angers: {
            city: 'Angers',
            address: '6 Place de la Gare, 49100 Angers',
            phone: '02 41 20 30 40',
            email: 'angers@oxygen-rp.com'
        },
        rennes: {
            city: 'Rennes',
            address: '8 rue de Léon, 35000 Rennes',
            phone: '06 83 81 61 61',
            email: 'rennes@oxygen-rp.com'
        }
    };
    
    if (mapPins.length > 0 && detailCard) {
        const updateOfficeCard = (key) => {
            const data = offices[key];
            if (!data) return;
            
            // Fade out
            detailCard.style.opacity = '0';
            detailCard.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                document.getElementById('map-city').textContent = data.city;
                document.getElementById('map-address').textContent = data.address;
                document.getElementById('map-email').textContent = data.email;
                document.getElementById('map-email').setAttribute('href', `mailto:${data.email}`);
                document.getElementById('map-phone').textContent = data.phone;
                document.getElementById('map-phone').setAttribute('href', `tel:${data.phone.replace(/\s+/g, '')}`);
                
                // Fade in
                detailCard.style.opacity = '1';
                detailCard.style.transform = 'translateY(0)';
            }, 300);
        };
        
        mapPins.forEach(pin => {
            pin.addEventListener('click', () => {
                mapPins.forEach(p => p.classList.remove('active'));
                pin.classList.add('active');
                
                // Find pin class mapping
                const pinClass = Array.from(pin.classList).find(c => c.endsWith('-pin'));
                if (pinClass) {
                    const key = pinClass.replace('-pin', '');
                    updateOfficeCard(key);
                }
            });
        });
        
        // Initial setup - Paris active
        const parisPin = document.querySelector('.paris-pin');
        if (parisPin) parisPin.classList.add('active');
        updateOfficeCard('paris');
    }

    // 9. Appointment Booking Form Handling
    const bookingForm = document.getElementById('oxygen-booking-form');
    const formContainer = document.querySelector('.booking-form');
    const successMsg = document.querySelector('.form-success-message');
    
    if (bookingForm && formContainer && successMsg) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation check
            const inputs = bookingForm.querySelectorAll('.form-input[required]');
            let valid = true;
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    valid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (!valid) return;
            
            // Simulate API Call / submission success animation
            const submitBtn = bookingForm.querySelector('.form-submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Envoi en cours...';
            
            setTimeout(() => {
                // Fade out form elements
                bookingForm.style.transition = 'opacity 0.5s ease';
                bookingForm.style.opacity = '0';
                
                setTimeout(() => {
                    bookingForm.style.display = 'none';
                    successMsg.style.display = 'block';
                    
                    // Scroll to container top smoothly
                    formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 500);
            }, 1500);
        });
    }
});
