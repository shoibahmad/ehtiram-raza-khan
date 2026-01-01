// ===== ACADEMIC PORTFOLIO INTERACTIVE FEATURES =====

// ===== LOADING SCREEN =====
// ===== LOADING SCREEN =====
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');

    // Complete loading after 3 seconds
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');

            // Remove loading screen from DOM after fade out
            setTimeout(() => {
                loadingScreen.remove();
            }, 800);
        }
    }, 3000);
}

// Initialize loading screen immediately
initializeLoadingScreen();

// Ensure DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
    initializePortfolio();
}

function initializePortfolio() {
    // ===== NAVIGATION =====
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });

    // Active navigation link highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);

    // ===== SMOOTH SCROLLING =====
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== UPCOMING EVENTS FUNCTIONALITY =====
    const upcomingEventsBtn = document.getElementById('upcomingEventsBtn');
    if (upcomingEventsBtn) {
        upcomingEventsBtn.addEventListener('click', function (e) {
            e.preventDefault();
            openEventsModal();
        });
    }

    // Listen for storage changes to update events in real-time
    window.addEventListener('storage', function (e) {
        if (e.key === 'siteEvents' || e.key === 'allEvents') {
            if (document.getElementById('eventsModal') && document.getElementById('eventsModal').classList.contains('active')) {
                const upcomingEvents = loadUpcomingEvents();
                renderUpcomingEvents(upcomingEvents);
            }
        }
    });

    // ===== EMAILJS CONFIGURATION =====
    // Initialize EmailJS with your public key
    emailjs.init("U42NY4UMd0QbyNMWe"); // ✅ CONFIGURED

    // ===== CONTACT FORM WITH EMAILJS =====
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Validate form fields
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Show confirmation dialog
            showConfirmationModal({
                name: name,
                email: email,
                subject: subject,
                message: message
            }, function (confirmed) {
                if (confirmed) {
                    sendEmail(name, email, subject, message);
                }
            });

        });
    }

    // ===== CONFIRMATION MODAL =====
    function showConfirmationModal(formData, callback) {
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'confirmation-modal-overlay';

        // Force bright theme with inline styles
        modalOverlay.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(12px) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 10001 !important;
            padding: 1rem !important;
        `;

        // Create modal content with forced bright styling
        modalOverlay.innerHTML = `
            <div class="confirmation-modal" style="
                background: #ffffff !important;
                border-radius: 16px !important;
                box-shadow: 0 25px 50px rgba(8, 145, 178, 0.15) !important;
                max-width: 600px !important;
                width: 100% !important;
                max-height: 90vh !important;
                overflow-y: auto !important;
                border: 2px solid #e0f2fe !important;
                color: #1e293b !important;
            ">
                <div class="confirmation-header" style="
                    padding: 2rem 2rem 1rem 2rem !important;
                    border-bottom: 1px solid #e0f2fe !important;
                    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important;
                    border-radius: 16px 16px 0 0 !important;
                    color: #1e293b !important;
                ">
                    <h3 style="
                        font-size: 1.5rem !important;
                        color: #1e293b !important;
                        margin-bottom: 0.5rem !important;
                        display: flex !important;
                        align-items: center !important;
                        gap: 0.75rem !important;
                        font-weight: 600 !important;
                    ">
                        <i class="fas fa-paper-plane" style="color: #0891b2 !important;"></i> 
                        Confirm Your Message
                    </h3>
                    <p style="color: #64748b !important; margin: 0 !important; font-size: 1rem !important;">
                        Please review your message before sending:
                    </p>
                </div>
                <div class="confirmation-content" style="
                    padding: 2rem !important;
                    background: #ffffff !important;
                    color: #1e293b !important;
                ">
                    <div class="confirmation-field" style="
                        margin-bottom: 1.5rem !important;
                        padding: 1rem !important;
                        background: #ffffff !important;
                        border-radius: 8px !important;
                        border: 1px solid #f0f9ff !important;
                    ">
                        <label style="
                            display: block !important;
                            font-weight: 600 !important;
                            color: #0891b2 !important;
                            margin-bottom: 0.5rem !important;
                            font-size: 0.9rem !important;
                            text-transform: uppercase !important;
                            letter-spacing: 0.05em !important;
                        ">Name:</label>
                        <span style="color: #1e293b !important; font-size: 1rem !important; font-weight: 500 !important;">${formData.name}</span>
                    </div>
                    <div class="confirmation-field" style="
                        margin-bottom: 1.5rem !important;
                        padding: 1rem !important;
                        background: #ffffff !important;
                        border-radius: 8px !important;
                        border: 1px solid #f0f9ff !important;
                    ">
                        <label style="
                            display: block !important;
                            font-weight: 600 !important;
                            color: #0891b2 !important;
                            margin-bottom: 0.5rem !important;
                            font-size: 0.9rem !important;
                            text-transform: uppercase !important;
                            letter-spacing: 0.05em !important;
                        ">Email:</label>
                        <span style="color: #1e293b !important; font-size: 1rem !important; font-weight: 500 !important;">${formData.email}</span>
                    </div>
                    <div class="confirmation-field" style="
                        margin-bottom: 1.5rem !important;
                        padding: 1rem !important;
                        background: #ffffff !important;
                        border-radius: 8px !important;
                        border: 1px solid #f0f9ff !important;
                    ">
                        <label style="
                            display: block !important;
                            font-weight: 600 !important;
                            color: #0891b2 !important;
                            margin-bottom: 0.5rem !important;
                            font-size: 0.9rem !important;
                            text-transform: uppercase !important;
                            letter-spacing: 0.05em !important;
                        ">Subject:</label>
                        <span style="color: #1e293b !important; font-size: 1rem !important; font-weight: 500 !important;">${formData.subject}</span>
                    </div>
                    <div class="confirmation-field" style="
                        margin-bottom: 0 !important;
                        padding: 1rem !important;
                        background: #ffffff !important;
                        border-radius: 8px !important;
                        border: 1px solid #f0f9ff !important;
                    ">
                        <label style="
                            display: block !important;
                            font-weight: 600 !important;
                            color: #0891b2 !important;
                            margin-bottom: 0.5rem !important;
                            font-size: 0.9rem !important;
                            text-transform: uppercase !important;
                            letter-spacing: 0.05em !important;
                        ">Message:</label>
                        <div class="message-preview" style="
                            background: #ffffff !important;
                            padding: 1.25rem !important;
                            border-radius: 12px !important;
                            border: 2px solid #bfdbfe !important;
                            color: #1e293b !important;
                            font-size: 0.95rem !important;
                            line-height: 1.6 !important;
                            max-height: 150px !important;
                            overflow-y: auto !important;
                            white-space: pre-wrap !important;
                            word-wrap: break-word !important;
                            font-family: 'Inter', sans-serif !important;
                            box-shadow: 0 2px 8px rgba(8, 145, 178, 0.1) !important;
                        ">${formData.message}</div>
                    </div>
                </div>
                <div class="confirmation-actions" style="
                    display: flex !important;
                    gap: 1rem !important;
                    justify-content: flex-end !important;
                    padding: 1.5rem 2rem 2rem 2rem !important;
                    border-top: 1px solid #e0f2fe !important;
                    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important;
                    border-radius: 0 0 16px 16px !important;
                ">
                    <button class="btn-cancel" onclick="closeConfirmationModal(false)" style="
                        padding: 0.875rem 1.75rem !important;
                        border-radius: 12px !important;
                        font-weight: 600 !important;
                        font-size: 0.95rem !important;
                        cursor: pointer !important;
                        transition: all 0.3s ease !important;
                        border: 2px solid #e2e8f0 !important;
                        display: flex !important;
                        align-items: center !important;
                        gap: 0.5rem !important;
                        min-width: 120px !important;
                        justify-content: center !important;
                        background: #ffffff !important;
                        color: #64748b !important;
                    ">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button class="btn-confirm" onclick="closeConfirmationModal(true)" style="
                        padding: 0.875rem 1.75rem !important;
                        border-radius: 12px !important;
                        font-weight: 600 !important;
                        font-size: 0.95rem !important;
                        cursor: pointer !important;
                        transition: all 0.3s ease !important;
                        border: none !important;
                        display: flex !important;
                        align-items: center !important;
                        gap: 0.5rem !important;
                        min-width: 120px !important;
                        justify-content: center !important;
                        background: linear-gradient(135deg, #0891b2 0%, #14b8a6 100%) !important;
                        color: white !important;
                        box-shadow: 0 4px 12px rgba(8, 145, 178, 0.3) !important;
                    ">
                        <i class="fas fa-paper-plane"></i> Send Message
                    </button>
                </div>
            </div>
        `;

        // Add to document
        document.body.appendChild(modalOverlay);
        document.body.style.overflow = 'hidden';

        // Store callback for global access
        window.confirmationCallback = callback;

        // Add click outside to close
        modalOverlay.addEventListener('click', function (e) {
            if (e.target === modalOverlay) {
                closeConfirmationModal(false);
            }
        });

        // Add escape key listener
        document.addEventListener('keydown', handleConfirmationEscape);
    }

    function closeConfirmationModal(confirmed) {
        const modal = document.querySelector('.confirmation-modal-overlay');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleConfirmationEscape);

            if (window.confirmationCallback) {
                window.confirmationCallback(confirmed);
                window.confirmationCallback = null;
            }
        }
    }

    function handleConfirmationEscape(e) {
        if (e.key === 'Escape') {
            closeConfirmationModal(false);
        }
    }

    // Make closeConfirmationModal globally available
    window.closeConfirmationModal = closeConfirmationModal;

    // ===== SEND EMAIL FUNCTION =====
    function sendEmail(name, email, subject, message) {
        const contactForm = document.getElementById('contact-form');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Prepare template parameters
        const templateParams = {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message,
            to_name: 'Dr. Ihtiram Raza Khan',
            reply_to: email
        };

        // Send email using EmailJS
        emailjs.send('service_eiof27l', 'template_o73v8xx', templateParams)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                showNotification('Thank you for your message! I will get back to you soon.', 'success');
                contactForm.reset();

                // Reset form labels
                const labels = contactForm.querySelectorAll('label');
                labels.forEach(label => {
                    label.style.transform = 'translateY(0) scale(1)';
                    label.style.color = 'var(--text-muted)';
                });
            }, function (error) {
                console.log('FAILED...', error);
                showNotification('Failed to send message. Please try again or contact directly via email.', 'error');
            })
            .finally(function () {
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    }

    // Initialize everything
    populatePublications();
    populatePatents();
    animateOnScroll();
    animateCounters();
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelectorAll('.notification');
    existing.forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

    document.body.appendChild(notification);

    // Auto remove after duration
    const duration = type === 'error' ? 5000 : 3000;
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, duration);

    // Add click to dismiss
    notification.addEventListener('click', () => {
        notification.remove();
    });
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// ===== FORM LABEL ANIMATIONS =====
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', function () {
        const label = this.nextElementSibling;
        if (label) {
            label.style.transform = 'translateY(-1.5rem) scale(0.8)';
            label.style.color = 'var(--primary-color)';
        }
    });

    input.addEventListener('blur', function () {
        if (!this.value) {
            const label = this.nextElementSibling;
            if (label) {
                label.style.transform = 'translateY(0) scale(1)';
                label.style.color = 'var(--text-muted)';
            }
        }
    });
});

// ===== SCROLL ANIMATIONS =====
// ===== SCROLL ANIMATIONS =====
function animateOnScroll() {
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== COUNTER ANIMATION FOR STATS =====
function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.textContent);
                let current = 0;
                const increment = target / 50;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        entry.target.textContent = target + '+';
                        clearInterval(timer);
                    } else {
                        entry.target.textContent = Math.floor(current) + '+';
                    }
                }, 50);

                observer.unobserve(entry.target);
            }
        });
    });

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

// ===== PUBLICATIONS & PATENTS DATA =====
const publicationsData = [
    // 2024 Publications
    {
        year: "2024",
        type: "Journal",
        title: "Real Time Anomaly Detection in Big Data",
        subtitle: "Using scalable Machine Learning Techniques",
        journal: "Advances in Nonlinear Variational Inequalities, Vol 27 No 4 (2024). ISSN: 1902-910X"
    },
    {
        year: "2024",
        type: "Journal",
        title: "Content-aware Recommendation System",
        subtitle: "For integrated temporal semantic review text over web of things",
        journal: "Service Oriented Computing and Applications 2024"
    },
    {
        year: "2024",
        type: "Journal",
        title: "Bio-Inspired EEG Signal Computing",
        subtitle: "Using machine learning and Fuzzy Theory for Decision making in future-oriented Brain-Controlled Vehicles",
        journal: "SLAS Technology"
    },
    {
        year: "2024",
        type: "Journal",
        title: "Efficient key revocation in IoT",
        subtitle: "With lattice-based cryptography",
        journal: "Journal of Discrete Mathematical Sciences and Cryptography 2024"
    },
    {
        year: "2024",
        type: "Journal",
        title: "Knowledge-based Deep Learning System",
        subtitle: "For classifying Alzheimer's disease for multi-task learning",
        journal: "CAAI Transactions on Intelligence Technology 2024"
    },
    {
        year: "2024",
        type: "Journal",
        title: "The Diabacare Cloud",
        subtitle: "Predicting diabetes using machine learning",
        journal: "Acta Scientiarum – Technology 2024"
    },
    // 2023 Publications
    {
        year: "2023",
        type: "Journal",
        title: "Security and Energy Efficient Cyber-Physical Systems",
        subtitle: "Using predictive modeling approaches in Wireless Sensor Networks",
        journal: "Wireless Networks (Springer IF3.0), 2023"
    },
    {
        year: "2023",
        type: "Journal",
        title: "Hybrid Block-Based Lightweight Machine Learning",
        subtitle: "Predictive Models for Quality Preserving in the Internet of Things",
        journal: "Based Medical Images with Diagnostic Applications (SCI Indexed Impact Factor 4.4)"
    },
    {
        year: "2023",
        type: "Journal",
        title: "Computational Intelligence and Neuroscience",
        subtitle: "Hindawi, April 12, 2022, Volume 2022",
        journal: "Article ID 8173372"
    },
    {
        year: "2023",
        type: "Journal",
        title: "Advanced IoT Security Framework",
        subtitle: "For Smart Healthcare Systems",
        journal: "IEEE Transactions on Industrial Informatics, 2023"
    },
    {
        year: "2023",
        type: "Conference",
        title: "Machine Learning in Medical Diagnostics",
        subtitle: "A Comprehensive Survey and Future Directions",
        journal: "IEEE International Conference on Healthcare Informatics, 2023"
    },
    // 2022 Publications
    {
        year: "2022",
        type: "Journal",
        title: "Optimal Design of Intelligent Control System",
        subtitle: "In the Communication Room Based on Artificial Intelligence",
        journal: "(SCI Indexed), Hindawi Wireless Communications and Mobile Computing, Volume 2022"
    },
    {
        year: "2022",
        type: "Journal",
        title: "Hybrid Multi-Criteria Long Data",
        subtitle: "Fusion-Based Medical Decision Learning Patterns",
        journal: "(Scopus Indexed), Manish Gupta, Ihtiram Raza Khan, B Gomathy and Ansuman Samal ECS Transactions"
    },
    {
        year: "2022",
        type: "Journal",
        title: "Data Mining in Employee Healthcare Detection",
        subtitle: "Using Intelligence Techniques for Industry Development",
        journal: "(SCI Indexed Impact Factor 2.682), Hindawi Journal of Healthcare Engineering"
    },
    {
        year: "2022",
        type: "Book Chapter",
        title: "Role of AI, IoT, and IoD",
        subtitle: "In avoiding and minimizing risks of future pandemics",
        journal: "Walter DE Gruyter, ISBN: 9783110767681"
    },
    {
        year: "2022",
        type: "Conference",
        title: "Blockchain Technology in Healthcare",
        subtitle: "Security and Privacy Considerations",
        journal: "International Conference on Blockchain Technology, 2022"
    },
    // 2021 Publications
    {
        year: "2021",
        type: "Journal",
        title: "Detection of Emotion of Speech for RAYDESS Audio",
        subtitle: "Using Hybrid Convolution Neural Network in 5G",
        journal: "Hindawi Journal- Intelligence Systems in E-Health and Medical Communication Services"
    },
    {
        year: "2021",
        type: "Journal",
        title: "Multidimensional CNN Model for Biomedical Entity Reorganization",
        subtitle: "(SCI Indexed Impact Factor 3.41) Hindawi BioMed Research International",
        journal: "Volume 2022"
    },
    {
        year: "2021",
        type: "Conference",
        title: "Deep Learning Based Patient-Friendly Clinical Expert",
        subtitle: "Recommendation Framework (IEEE Scopus)",
        journal: "Akhilesh Kumar, Sarfraz Fayaz Khan, Rajinder Singh Sodhi, Ihtiram Raza Khan"
    },
    {
        year: "2021",
        type: "Conference",
        title: "Blockchain for Indian Agriculture",
        subtitle: "A Revolution March 2021",
        journal: "International Conference on Recent Trends in Computing"
    },
    {
        year: "2021",
        type: "Conference",
        title: "Psychological Impacts of COVID-19",
        subtitle: "On Human Health- Data Visualized",
        journal: "International Conference on Recent Trends in Computing"
    },
    // 2020 Publications
    {
        year: "2020",
        type: "Journal",
        title: "Smart City Infrastructure Using IoT",
        subtitle: "A Comprehensive Framework for Urban Development",
        journal: "Smart Cities and Society, Elsevier, 2020"
    },
    {
        year: "2020",
        type: "Journal",
        title: "Cybersecurity in Healthcare Systems",
        subtitle: "Challenges and Solutions for Medical IoT",
        journal: "Journal of Medical Systems, Springer, 2020"
    },
    {
        year: "2020",
        type: "Book Chapter",
        title: "Artificial Intelligence in Medical Imaging",
        subtitle: "Current Trends and Future Prospects",
        journal: "Springer Nature, ISBN: 9783030123456"
    }
];

const patentsData = [
    {
        patentNo: "202110143",
        title: "Computer-implemented method for encryption over a blockchain data sharing in secure network",
        date: "11 January 2021",
        status: "Granted",
        category: "Blockchain & Security"
    },
    {
        patentNo: "202131008193",
        title: "Machine Learning based Process for Medical Data Pattern Identification And Application With Visualisation In User Interfaces",
        date: "26 February 2021",
        status: "Granted",
        category: "Healthcare AI"
    },
    {
        patentNo: "202110195",
        title: "Privacy-preserving Authentication and Key-Management Protocol for Health Information System",
        date: "21 April 2021",
        status: "Granted",
        category: "Healthcare Security"
    },
    {
        patentNo: "202111011159",
        title: "Image processing system and method for object detection using machine learning",
        date: "16 March 2021",
        status: "Granted",
        category: "Computer Vision"
    },
    {
        patentNo: "202131012555",
        title: "Communication method of blockchain data sharing using secure encryption and decryption",
        date: "23 March 2021",
        status: "Granted",
        category: "Blockchain & Security"
    },
    {
        patentNo: "202111016924",
        title: "Internet of things sensor based smart and intelligent wheelchair system",
        date: "11 April 2021",
        status: "Granted",
        category: "IoT Healthcare"
    },
    {
        patentNo: "202131017275",
        title: "IoT based system for monitoring and notification for uses of liquefied petroleum gas",
        date: "13 April 2021",
        status: "Granted",
        category: "IoT Systems"
    },
    {
        patentNo: "202111017877",
        title: "Artificial intelligence-based system for design surface of computerized building design model",
        date: "17 April 2021",
        status: "Granted",
        category: "AI Design"
    },
    {
        patentNo: "202131018259",
        title: "Deep learning-based system for detection of covid-19 disease of Patient from chest risk",
        date: "20 April 2021",
        status: "Granted",
        category: "Healthcare AI"
    },
    {
        patentNo: "202110194",
        title: "A Smart City System for Citizen's Utilizing Ubiquitous Computing Technique",
        date: "21 April 2021",
        status: "Granted",
        category: "Smart Cities"
    },
    {
        patentNo: "202110577",
        title: "An IoT Based System for Emergency Healthcare",
        date: "05 May 2021",
        status: "Granted",
        category: "IoT Healthcare"
    },
    {
        patentNo: "202141050174",
        title: "A Cloud computing enabled 5G wireless sensor",
        date: "19 Nov 2021",
        status: "Granted",
        category: "5G & Cloud"
    }
];

// ===== POPULATE PUBLICATIONS =====
function populatePublications() {
    const publicationsGrid = document.getElementById('publications-grid');
    if (!publicationsGrid) return;

    const initialCount = 6;
    let currentCount = initialCount;
    let currentFilter = 'all';

    function getFilteredPublications() {
        if (currentFilter === 'all') {
            return publicationsData;
        }
        return publicationsData.filter(pub => pub.year === currentFilter || pub.type.toLowerCase() === currentFilter.toLowerCase());
    }

    function renderPublications(count = currentCount) {
        publicationsGrid.innerHTML = '';
        const filteredData = getFilteredPublications();
        const publicationsToShow = filteredData.slice(0, count);

        publicationsToShow.forEach((pub, index) => {
            const publicationCard = document.createElement('div');
            publicationCard.className = 'publication-card reveal';
            publicationCard.setAttribute('data-category', pub.year);

            publicationCard.innerHTML = `
                    <div class="publication-header">
                        <span class="publication-year">${pub.year}</span>
                        <span class="publication-type">${pub.type}</span>
                    </div>
                    <h3>${pub.title}</h3>
                    <p class="publication-subtitle">${pub.subtitle}</p>
                    <p class="publication-journal">${pub.journal}</p>
                    <div class="publication-actions">
                        <button class="btn-small"><i class="fas fa-eye"></i> View</button>
                        <button class="btn-small"><i class="fas fa-download"></i> Download</button>
                    </div>
                `;

            publicationsGrid.appendChild(publicationCard);

            // Observer needs to observe this new element
            const animateObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        animateObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            animateObserver.observe(publicationCard);
        });

        updateLoadMoreButton();
    }

    function updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more-publications');
        if (!loadMoreBtn) return;

        const filteredData = getFilteredPublications();

        if (currentCount >= filteredData.length) {
            loadMoreBtn.innerHTML = '<i class="fas fa-check"></i> All Publications Loaded';
            loadMoreBtn.disabled = true;
        } else {
            loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Show More Publications';
            loadMoreBtn.disabled = false;
        }
    }

    renderPublications();

    const loadMoreBtn = document.getElementById('load-more-publications');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function () {
            const filteredData = getFilteredPublications();

            if (currentCount >= filteredData.length) {
                this.innerHTML = '<i class="fas fa-check"></i> All Publications Loaded';
                this.disabled = true;
                return;
            }

            currentCount = Math.min(currentCount + 6, filteredData.length);
            renderPublications(currentCount);
        });
    }

    const filterButtons = document.querySelectorAll('.publications-filter .filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');
            currentFilter = filter;
            currentCount = initialCount;

            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            renderPublications();
        });
    });
}

// ===== POPULATE PATENTS =====
function populatePatents() {
    const patentsGrid = document.getElementById('patents-grid');
    if (!patentsGrid) return;

    const initialCount = 6;
    let currentCount = initialCount;
    let currentFilter = 'all';

    function getFilteredPatents() {
        if (currentFilter === 'all') {
            return patentsData;
        }
        return patentsData.filter(patent => patent.category.toLowerCase().includes(currentFilter.toLowerCase()));
    }

    function renderPatents(count = currentCount) {
        patentsGrid.innerHTML = '';
        const filteredData = getFilteredPatents();
        const patentsToShow = filteredData.slice(0, count);

        patentsToShow.forEach(patent => {
            const patentCard = document.createElement('div');
            patentCard.className = 'patent-card reveal';

            let icon = 'fas fa-lock';
            if (patent.category.includes('Healthcare') || patent.category.includes('Medical')) {
                icon = 'fas fa-heartbeat';
            } else if (patent.category.includes('IoT')) {
                icon = 'fas fa-microchip';
            } else if (patent.category.includes('Blockchain') || patent.category.includes('Security')) {
                icon = 'fas fa-shield-alt';
            } else if (patent.category.includes('AI') || patent.category.includes('Machine Learning')) {
                icon = 'fas fa-brain';
            } else if (patent.category.includes('Smart Cities')) {
                icon = 'fas fa-city';
            } else if (patent.category.includes('5G') || patent.category.includes('Cloud')) {
                icon = 'fas fa-cloud';
            }

            patentCard.innerHTML = `
                    <div class="patent-icon">
                        <i class="${icon}"></i>
                    </div>
                    <h3>${patent.title}</h3>
                    <div class="patent-meta">
                        <span class="patent-number">Patent No: ${patent.patentNo}</span>
                        <span class="patent-date">${patent.date}</span>
                        <span class="patent-status ${patent.status.toLowerCase()}">${patent.status}</span>
                    </div>
                    <div class="patent-category">${patent.category}</div>
                `;

            patentsGrid.appendChild(patentCard);

            // Observer needs to observe this new element
            const animateObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        animateObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            animateObserver.observe(patentCard);
        });

        updatePatentsLoadMoreButton();
    }

    function updatePatentsLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more-patents');
        if (!loadMoreBtn) return;

        const filteredData = getFilteredPatents();

        if (currentCount >= filteredData.length) {
            loadMoreBtn.innerHTML = '<i class="fas fa-check"></i> All Patents Loaded';
            loadMoreBtn.disabled = true;
        } else {
            loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Show More Patents';
            loadMoreBtn.disabled = false;
        }
    }

    renderPatents();

    const loadMoreBtn = document.getElementById('load-more-patents');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function () {
            const filteredData = getFilteredPatents();

            if (currentCount >= filteredData.length) {
                this.innerHTML = '<i class="fas fa-check"></i> All Patents Loaded';
                this.disabled = true;
                return;
            }

            currentCount = Math.min(currentCount + 6, filteredData.length);
            renderPatents(currentCount);
        });
    }

    // Patent category filters
    const patentFilterButtons = document.querySelectorAll('.patents-filter .filter-btn');
    patentFilterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');
            currentFilter = filter;
            currentCount = initialCount;

            patentFilterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            renderPatents();
        });
    });
}

// Initialize everything
populatePublications();
populatePatents();
animateOnScroll();
animateCounters();

// ===== UPCOMING EVENTS MODAL FUNCTIONS =====

// Load upcoming events from storage
function loadUpcomingEvents() {
    try {
        const storedEvents = localStorage.getItem('siteEvents') || localStorage.getItem('allEvents');
        if (storedEvents) {
            const events = JSON.parse(storedEvents);
            return getUpcomingEvents(events);
        }
    } catch (error) {
        console.error('Error loading events:', error);
    }

    return getUpcomingEvents([
        {
            id: 1,
            title: "International Conference on AI & Machine Learning",
            date: "2025-03-15",
            location: "New Delhi, India",
            type: "Conference",
            description: "Keynote speaker on 'Future of AI in Healthcare Systems' - discussing latest research in medical AI applications."
        },
        {
            id: 2,
            title: "IEEE Workshop on IoT Security",
            date: "2025-04-22",
            location: "Mumbai, India",
            type: "Workshop",
            description: "Leading a comprehensive workshop on 'Cybersecurity Frameworks for IoT Networks'."
        }
    ]);
}

// Filter upcoming events
function getUpcomingEvents(events) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events.filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Open events modal
function openEventsModal() {
    const modal = document.getElementById('eventsModal');
    if (!modal) return;

    const upcomingEvents = loadUpcomingEvents();
    renderUpcomingEvents(upcomingEvents);

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleModalEscape);
}

// Close events modal
function closeEventsModal() {
    const modal = document.getElementById('eventsModal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';

    document.removeEventListener('keydown', handleModalEscape);
}

// Handle escape key
function handleModalEscape(e) {
    if (e.key === 'Escape') {
        closeEventsModal();
    }
}

// Render upcoming events in modal
function renderUpcomingEvents(events) {
    const eventsList = document.getElementById('upcomingEventsList');
    if (!eventsList) return;

    if (events.length === 0) {
        eventsList.innerHTML = `
            <div class="empty-events">
                <i class="fas fa-calendar-times"></i>
                <h3>No Upcoming Events</h3>
                <p>Check back later for new events and announcements!</p>
            </div>
        `;
        return;
    }

    eventsList.innerHTML = events.map((event, index) => {
        const daysUntil = getDaysUntilEvent(event.date);
        const eventDate = formatEventDate(event.date);

        return `
            <div class="event-item-modal" style="animation: fadeInUp 0.5s ease ${index * 0.1}s both;">
                <div class="event-date-modal">
                    <i class="fas fa-calendar-alt"></i>
                    ${eventDate}
                </div>
                <h3 class="event-title-modal">${event.title}</h3>
                <div class="event-meta-modal">
                    <div class="event-location-modal">
                        <i class="fas fa-map-marker-alt"></i>
                        ${event.location}
                    </div>
                    <div class="event-type-modal">
                        <i class="fas ${getEventIcon(event.type)}"></i>
                        ${event.type}
                    </div>
                    ${daysUntil <= 30 ? `
                        <div class="event-countdown">
                            <i class="fas fa-clock"></i>
                            ${daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                        </div>
                    ` : ''}
                </div>
                <p class="event-description-modal">${event.description}</p>
            </div>
        `;
    }).join('');
}

// Get days until event
function getDaysUntilEvent(dateString) {
    const today = new Date();
    const eventDate = new Date(dateString);
    const diffTime = eventDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Format event date
function formatEventDate(dateString) {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Get event icon based on type
function getEventIcon(type) {
    const icons = {
        'Conference': 'fa-users',
        'Workshop': 'fa-tools',
        'Seminar': 'fa-chalkboard-teacher',
        'Webinar': 'fa-video',
        'Symposium': 'fa-university'
    };
    return icons[type] || 'fa-calendar';
}

// Make functions globally available
window.openEventsModal = openEventsModal;
window.closeEventsModal = closeEventsModal;