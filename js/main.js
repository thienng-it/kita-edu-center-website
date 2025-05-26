/**
 * KITA Edu Center - Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const menuButton = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    if (menuButton && navMenu) {
        menuButton.addEventListener('click', () => {
            menuButton.classList.toggle('is-active');
            navMenu.classList.toggle('is-active');
            const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
            menuButton.setAttribute('aria-expanded', !isExpanded);
            document.body.style.overflow = navMenu.classList.contains('is-active') ? 'hidden' : '';
        });

        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('is-active')) {
                    menuButton.classList.remove('is-active');
                    navMenu.classList.remove('is-active');
                    menuButton.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // --- Active Navigation Link Highlighting ---
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath || (currentPath === 'index.html' && linkPath === '')) {
             if (link.getAttribute('href') === currentPath || (currentPath === 'index.html' && link.getAttribute('href') === 'index.html')) {
                   link.classList.add('active');
             }
        }
         if (window.location.pathname.includes('/blog_posts/') && link.getAttribute('href') === 'blog.html') {
             link.classList.add('active');
         }
    });

    // --- Footer Current Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Simple Scroll Animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, {
            threshold: 0.1
        });
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- Contact Form Handling (Example - Requires Backend/Service) ---
    const generalForm = document.getElementById('contact-form') || document.getElementById('feedback-form');
    const formStatusMessageElement = document.getElementById('form-status');

    if (generalForm && formStatusMessageElement) {
        generalForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const currentLang = document.documentElement.lang || 'en';
            const currentStrings = i18nStrings[currentLang] || i18nStrings.en;

            let sendingKey = 'contactFormStatusSending';
            let successKey = 'contactFormStatusSuccess';
            let errorEndpointKey = 'contactFormStatusErrorEndpoint';
            let errorFailKey = 'contactFormStatusErrorFail';
            let errorGeneralKey = 'contactFormStatusErrorGeneral';

            if (generalForm.id === 'feedback-form') {
                sendingKey = 'feedbackFormStatusSending'; 
                successKey = 'feedbackFormStatusSuccess'; 
                errorEndpointKey = currentStrings.feedbackFormStatusErrorEndpoint ? 'feedbackFormStatusErrorEndpoint' : 'contactFormStatusErrorEndpoint';
                errorFailKey = currentStrings.feedbackFormStatusErrorFail ? 'feedbackFormStatusErrorFail' : 'contactFormStatusErrorFail';
                errorGeneralKey = currentStrings.feedbackFormStatusErrorGeneral ? 'feedbackFormStatusErrorGeneral' : 'contactFormStatusErrorGeneral';
            }

            formStatusMessageElement.textContent = currentStrings[sendingKey] || 'Sending...';
            formStatusMessageElement.className = 'form-status';

            const formData = new FormData(generalForm);
            const formAction = generalForm.getAttribute('action');

            let defaultEndpoint = 'YOUR_FORM_ENDPOINT';
            if (generalForm.id === 'feedback-form') {
                defaultEndpoint = 'YOUR_FEEDBACK_ENDPOINT';
            }

            if (!formAction || formAction === defaultEndpoint) {
                 formStatusMessageElement.textContent = currentStrings[errorEndpointKey] || 'Error: Form endpoint not configured.';
                 formStatusMessageElement.classList.add('error');
                 console.error("Form action attribute is not set correctly for form ID: " + generalForm.id);
                 return;
            }

            try {
                const response = await fetch(formAction, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatusMessageElement.textContent = currentStrings[successKey] || 'Message sent successfully!';
                    formStatusMessageElement.classList.add('success');
                    generalForm.reset();
                } else {
                    const data = await response.json().catch(() => ({}));
                    const errorMsgFromServer = data.error || `Error: <span class="math-inline">\{response\.statusText\} \(</span>{response.status})`;
                    formStatusMessageElement.textContent = (currentStrings[errorFailKey] || 'Failed to send. {errorMessage}').replace('{errorMessage}', errorMsgFromServer);
                    formStatusMessageElement.classList.add('error');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                formStatusMessageElement.textContent = currentStrings[errorGeneralKey] || 'An error occurred. Please try again later.';
                formStatusMessageElement.classList.add('error');
            }
        });
    }

    // --- Theme Toggle ---
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const bodyElement = document.body;
    const sunIcon = themeToggleButton ? themeToggleButton.querySelector('.theme-icon-sun') : null;
    const moonIcon = themeToggleButton ? themeToggleButton.querySelector('.theme-icon-moon') : null;

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            bodyElement.classList.add('dark-theme');
            if (sunIcon) sunIcon.style.display = 'none';
            if (moonIcon) moonIcon.style.display = 'inline';
        } else {
            bodyElement.classList.remove('dark-theme');
            if (sunIcon) sunIcon.style.display = 'inline';
            if (moonIcon) moonIcon.style.display = 'none';
        }
    };

    const toggleThemeAndSave = () => {
        let currentTheme = bodyElement.classList.contains('dark-theme') ? 'dark' : 'light';
        let newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
        try {
            localStorage.setItem('kita-theme', newTheme);
        } catch (e) {
            console.warn('Could not save theme preference to localStorage:', e);
        }
    };

    if (themeToggleButton && sunIcon && moonIcon) {
        themeToggleButton.addEventListener('click', toggleThemeAndSave);
        let preferredTheme = 'light';
        try {
            const savedTheme = localStorage.getItem('kita-theme');
            if (savedTheme) {
                preferredTheme = savedTheme;
            }
        } catch (e) {
            console.warn('Could not access localStorage for theme preference:', e);
        }
        applyTheme(preferredTheme);
    } else {
        if (!themeToggleButton) console.error("Theme toggle button not found.");
        if (themeToggleButton && !sunIcon) console.error("Sun icon for theme toggle not found.");
        if (themeToggleButton && !moonIcon) console.error("Moon icon for theme toggle not found.");
    }
    // --- End Theme Toggle ---

    // --- Client-Side Search ---
    const searchInput = document.getElementById('search-input');
    const searchResultsDropdown = document.getElementById('search-results-dropdown');
    const searchContainer = document.getElementById('search-container');

    const searchablePages = [
        { title: 'Home', url: 'index.html', en_title: 'Home', vi_title: 'Trang Chủ'},
        { title: 'About Us', url: 'about.html', en_title: 'About Us', vi_title: 'Về Chúng Tôi'},
        { title: 'Our Mission & Vision', url: 'about.html', en_title: 'Our Mission & Vision', vi_title: 'Sứ Mệnh & Tầm Nhìn'},
        { title: 'Why Choose KITA', url: 'about.html', en_title: 'Why Choose KITA', vi_title: 'Vì Sao Chọn KITA'},
        { title: 'Courses', url: 'courses.html', en_title: 'Courses', vi_title: 'Khóa Học'},
        { title: 'English Language Programs', url: 'courses.html#english', en_title: 'English Language Programs', vi_title: 'Chương Trình Tiếng Anh'},
        { title: 'General English', url: 'courses.html#english', en_title: 'General English', vi_title: 'Tiếng Anh Tổng Quát' },
        { title: 'IELTS Preparation', url: 'courses.html#english', en_title: 'IELTS Preparation', vi_title: 'Luyện Thi IELTS' },
        { title: 'Business English', url: 'courses.html#english', en_title: 'Business English', vi_title: 'Tiếng Anh Thương Mại' },
        { title: 'Art Performance Programs', url: 'courses.html#arts', en_title: 'Art Performance Programs', vi_title: 'Chương Trình Biểu Diễn Nghệ Thuật'},
        { title: 'ABRSM Music', url: 'courses.html#arts', en_title: 'ABRSM Music', vi_title: 'Âm Nhạc ABRSM' },
        { title: 'Drama & Public Speaking', url: 'courses.html#arts', en_title: 'Drama & Public Speaking', vi_title: 'Kịch Nghệ & Hùng Biện' },
        { title: 'Fees & Tuition', url: 'fees.html', en_title: 'Fees & Tuition', vi_title: 'Học Phí'},
        { title: 'Course Fees', url: 'fees.html', en_title: 'Course Fees', vi_title: 'Biểu Phí Khóa Học'},
        { title: 'Events & Workshops', url: 'events.html', en_title: 'Events & Workshops', vi_title: 'Sự Kiện & Hội Thảo'},
        { title: 'Upcoming Events', url: 'events.html', en_title: 'Upcoming Events', vi_title: 'Sự Kiện Sắp Tới'},
        { title: 'Blog', url: 'blog.html', en_title: 'Blog', vi_title: 'Blog'},
        { title: 'KITA Edu Blog', url: 'blog.html', en_title: 'KITA Edu Blog', vi_title: 'Blog KITA Edu'},
        { title: 'ABRSM Exam Tips (Blog Post)', url: 'blog_posts/sample-post.html', en_title: 'ABRSM Exam Tips', vi_title: 'Mẹo Thi ABRSM'},
        { title: 'Meet Our Team / Staff', url: 'staff.html', en_title: 'Meet Our Team / Staff', vi_title: 'Gặp Gỡ Đội Ngũ'},
        { title: 'Teaching Staff', url: 'staff.html', en_title: 'Teaching Staff', vi_title: 'Đội Ngũ Giảng Dạy'},
        { title: 'Support Staff', url: 'staff.html', en_title: 'Support Staff', vi_title: 'Nhân Viên Hỗ Trợ'},
        { title: 'Contact Us', url: 'contact.html', en_title: 'Contact Us', vi_title: 'Liên Hệ'},
        { title: 'Feedback', url: 'feedback.html', en_title: 'Feedback', vi_title: 'Phản Hồi'}
    ];

    if (searchInput && searchResultsDropdown && searchContainer) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase().trim();
            searchResultsDropdown.innerHTML = '';

            if (query.length < 2) {
                searchResultsDropdown.style.display = 'none';
                return;
            }
            const currentLang = document.documentElement.lang || 'en';

            const filteredPages = searchablePages.filter(page => {
                const titleToSearch = currentLang === 'vi' ? (page.vi_title || page.title) : (page.en_title || page.title);
                return titleToSearch.toLowerCase().includes(query);
            });

            if (filteredPages.length > 0) {
                filteredPages.forEach(page => {
                    const link = document.createElement('a');
                    link.href = page.url;
                    const titleToDisplay = currentLang === 'vi' ? (page.vi_title || page.title) : (page.en_title || page.title);
                    link.textContent = titleToDisplay;
                    link.addEventListener('click', function() {
                        searchResultsDropdown.style.display = 'none';
                    });
                    searchResultsDropdown.appendChild(link);
                });
                searchResultsDropdown.style.display = 'block';
            } else {
                const noResultsMessage = document.createElement('div');
                noResultsMessage.classList.add('no-results');
                const currentStrings = i18nStrings[currentLang] || i18nStrings.en;
                noResultsMessage.textContent = currentStrings.searchNoResults || 'No results found.';
                searchResultsDropdown.appendChild(noResultsMessage);
                searchResultsDropdown.style.display = 'block';
            }
        });

        document.addEventListener('click', function(event) {
            if (!searchContainer.contains(event.target)) {
                searchResultsDropdown.style.display = 'none';
            }
        });

        searchInput.addEventListener('focus', function() {
            if (searchInput.value.length >= 2 && searchResultsDropdown.hasChildNodes()) {
                if (searchResultsDropdown.querySelector('a') || searchResultsDropdown.querySelector('.no-results')) {
                    searchResultsDropdown.style.display = 'block';
                }
            }
        });
    }
    // --- End Client-Side Search ---

    // --- Simple I18N (Internationalization) ---
    const i18nStrings = {
        en: {
            // ... (all previously defined EN strings up to Events Page) ...
            pageTitle: "KITA Edu Center - English & Art Performance | HCMC",
            metaDescription: "KITA Edu Center offers premier English language and Art Performance courses in Ho Chi Minh City. Join us to unlock your potential.",
            navHome: "Home",
            navAbout: "About",
            navCourses: "Courses",
            navFees: "Fees",
            navEvents: "Events",
            navBlog: "Blog",
            navStaff: "Staff",
            navContact: "Contact",
            navFeedback: "Feedback",
            searchPlaceholder: "Search site...",
            searchNoResults: "No results found.",
            heroTitle: "Unlock Your Potential in English & Arts",
            heroSubtitle: "Join KITA Edu Center in Ho Chi Minh City for expert guidance in language and performance.",
            heroButton: "Explore Our Courses",
            welcomeTitle: "Welcome to KITA Edu Center",
            welcomeSubtitle: "Your journey towards excellence starts here.",
            centerImageAlt: "KITA Edu Center Facility",
            welcomePara1: "Located conveniently in Ho Chi Minh City, KITA Edu Center is dedicated to providing top-tier education in English language skills and a diverse range of performing arts. We believe in nurturing talent within a supportive and inspiring environment.",
            welcomePara2: "Our modern facilities, experienced instructors, and internationally recognized programs (like ABRSM) ensure our students receive the best possible preparation for their future success.",
            learnMoreButton: "Learn More About Us",
            popularProgramsTitle: "Popular Programs",
            popularProgramsSubtitle: "Discover courses designed for success.",
            englishCourseAlt: "English Course",
            commEnglishTitle: "Communicative English",
            commEnglishDesc: "Enhance your fluency and confidence for everyday communication and professional settings.",
            abrsmAlt: "ABRSM Preparation",
            abrsmTitle: "ABRSM Exam Prep",
            abrsmDesc: "Comprehensive preparation for ABRSM practical and theory music examinations.",
            publicSpeakingAlt: "Public Speaking Course",
            publicSpeakingTitle: "Public Speaking & Drama",
            publicSpeakingDesc: "Build confidence and stage presence through engaging drama and public speaking classes.",
            detailsLink: "Details &rarr;",
            viewAllCoursesButton: "View All Courses",
            ctaTitle: "Ready to Start Learning?",
            ctaSubtitle: "Contact us today for a consultation or visit our center in HCMC.",
            ctaButton: "Get In Touch",
            footerKitaEdu: "KITA Edu Center",
            footerAboutText: "Nurturing potential in English and Arts in Ho Chi Minh City since 2010.",
            footerQuickLinks: "Quick Links",
            navPrivacy: "Privacy Policy",
            footerContactInfo: "Contact Info",
            footerAddress: "123 Example Street, District 1<br>Ho Chi Minh City, Vietnam",
            footerPhoneLabel: "Phone:",
            footerEmailLabel: "Email:",
            footerCopyright: "&copy; <span id=\"current-year-i18n\"></span> KITA Edu Center. All Rights Reserved.",
            aboutPageTitle: "About Us - KITA Edu Center",
            aboutMetaDescription: "Learn about KITA Edu Center's mission, vision, values, and our commitment to quality education in HCMC.",
            aboutHeroTitle: "About KITA Edu Center",
            aboutHeroSubtitle: "Discover our passion for education and the arts.",
            missionSectionTitle: "Our Mission",
            missionImageAlt: "Illustration representing mission",
            missionText: "To provide exceptional education in English and Performing Arts, empowering students in Ho Chi Minh City to achieve their full potential, build confidence, and foster a lifelong love for learning and creativity.",
            visionSectionTitle: "Our Vision",
            visionImageAlt: "Illustration representing vision",
            visionText: "To be the leading and most trusted center for language and arts education in the region, recognized for our innovative teaching methods, student success stories, and contribution to the cultural landscape.",
            whyChooseSectionTitle: "Why Choose KITA Edu Center?",
            whyChooseSubtitle: "Experience the difference dedication makes.",
            featureExpertInstructors: "Expert Instructors",
            featureExpertDesc: "Learn from passionate, certified teachers with extensive experience in their fields.",
            featureProvenCurriculum: "Proven Curriculum",
            featureProvenDesc: "Engage with structured, effective programs including internationally recognized standards like ABRSM.",
            featureModernFacilities: "Modern Facilities",
            featureModernDesc: "Study in a comfortable, well-equipped environment designed to enhance learning.",
            featureSupportiveCommunity: "Supportive Community",
            featureSupportiveDesc: "Join a welcoming atmosphere that encourages growth, collaboration, and confidence.",
            directorSectionTitle: "Meet Our Director",
            directorImageAlt: "Director Name",
            directorName: "[Director's Name]",
            directorTitle: "Founder & Director",
            directorBio: "A brief message from the director about their passion, experience, and the center's philosophy. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            meetFullTeamButton: "Meet the Full Team",
            coursesPageTitle: "Our Courses - KITA Edu Center",
            coursesMetaDescription: "Explore English language and Art Performance courses offered at KITA Edu Center in HCMC, including ABRSM preparation.",
            coursesHeroTitle: "Our Courses",
            coursesHeroSubtitle: "Find the perfect program to enhance your skills.",
            englishProgramsTitle: "English Language Programs",
            englishProgramsSubtitle: "From foundational skills to advanced fluency.",
            genEngCourseTitle: "General English (All Levels)",
            genEngCourseDesc: "Develop comprehensive skills in reading, writing, listening, and speaking for everyday use.",
            genEngLevel: "Levels: Beginner to Advanced",
            genEngFocus: "Focus: Grammar, Vocabulary, Communication",
            genEngIdeal: "Ideal for: Overall language improvement",
            ieltsPrepCourseTitle: "IELTS Preparation",
            ieltsPrepCourseDesc: "Targeted training and strategies to help you achieve your desired score in the IELTS exam.",
            ieltsFocus: "Focus: Academic Reading/Writing, Listening/Speaking strategies",
            ieltsFeatures: "Features: Mock tests, expert feedback",
            ieltsIdeal: "Ideal for: University admission, immigration",
            bizEngCourseTitle: "Business English",
            bizEngCourseDesc: "Master the language needed for professional environments, including presentations, negotiations, and emails.",
            bizEngFocus: "Focus: Professional communication, industry vocabulary",
            bizEngActivities: "Activities: Role-playing, case studies",
            bizEngIdeal: "Ideal for: Working professionals, career advancement",
            artProgramsTitle: "Art Performance Programs",
            artProgramsSubtitle: "Express yourself through music and drama.",
            abrsmCourseTitle: "ABRSM Music (Practical & Theory)",
            abrsmCourseDesc: "Structured lessons following the ABRSM syllabus for various instruments (Piano, Violin, etc.) and music theory.",
            abrsmInstruments: "Instruments: Piano, Violin, Guitar (Specify available)",
            abrsmFocus: "Focus: Technique, repertoire, musicality, theory",
            abrsmIdeal: "Ideal for: Graded music exams, skill development",
            dramaCourseTitle: "Drama & Public Speaking",
            dramaCourseDesc: "Develop acting skills, stage presence, and confident communication through interactive drama exercises.",
            dramaFocus: "Focus: Improvisation, voice projection, character work",
            dramaBenefits: "Benefits: Confidence building, creativity",
            dramaIdeal: "Ideal for: All ages interested in performance",
            inquireNowButton: "Inquire Now",
            contactPageTitle: "Contact Us - KITA Edu Center",
            contactMetaDescription: "Get in touch with KITA Edu Center in HCMC. Find our address, phone number, email, map, and send us a message.",
            contactHeroTitle: "Contact Us",
            contactHeroSubtitle: "We're here to help. Reach out via phone, email, or the form below.",
            contactGetInTouchTitle: "Get in Touch",
            contactVisitCallEmail: "Visit us, call us, or send an email. We look forward to hearing from you!",
            contactAddressLabel: "Address:",
            contactAddressText: "123 Example Street, Ward X, District 1, Ho Chi Minh City, Vietnam",
            contactPhoneLabel: "Phone:",
            contactEmailLabel: "Email:",
            contactHoursLabel: "Hours:",
            contactHoursText: "Mon - Fri: 9:00 AM - 7:00 PM | Sat: 9:00 AM - 1:00 PM",
            contactSendMessageTitle: "Send Us a Message",
            contactFormNameLabel: "Full Name",
            contactFormNamePlaceholder: "Your Full Name",
            contactFormEmailLabel: "Email Address",
            contactFormEmailPlaceholder: "your.email@example.com",
            contactFormPhoneLabel: "Phone Number (Optional)",
            contactFormPhonePlaceholder: "+84 ...",
            contactFormSubjectLabel: "Subject",
            contactFormSubjectPlaceholder: "e.g., Course Inquiry",
            contactFormMessageLabel: "Message",
            contactFormMessagePlaceholder: "How can we help you?",
            contactFormSendButton: "Send Message",
            contactFormStatusSending: "Sending...",
            contactFormStatusSuccess: "Message sent successfully! We will get back to you soon.",
            contactFormStatusErrorEndpoint: "Error: Form endpoint not configured.",
            contactFormStatusErrorFail: "Failed to send message. {errorMessage}",
            contactFormStatusErrorGeneral: "An error occurred while sending the message. Please try again later.",
            contactMapTitle: "KITA Edu Center Location",
            staffPageTitle: "Our Team - KITA Edu Center",
            staffMetaDescription: "Meet the experienced and dedicated teaching staff at KITA Edu Center in Ho Chi Minh City.",
            staffHeroTitle: "Meet Our Team",
            staffHeroSubtitle: "Passionate educators dedicated to your success.",
            teachingStaffSectionTitle: "Teaching Staff",
            teachingStaffSectionSubtitle: "Experienced professionals in English and Arts.",
            supportStaffSectionTitle: "Support Staff",
            supportStaffSectionSubtitle: "Helping make your experience smooth.",
            staff1Name: "[Teacher Name 1]",
            staff1Title: "Senior English Instructor (IELTS Specialist)",
            staff1Bio: "MA TESOL, Cambridge CELTA certified. Over 10 years of experience helping students achieve high IELTS scores and improve academic English.",
            staff1ImageAlt: "Photo of [Teacher Name 1]",
            staff2Name: "[Teacher Name 2]",
            staff2Title: "Head of Performing Arts (Piano & Theory)",
            staff2Bio: "MMus Performance, ABRSM Examiner (DipABRSM). Specializes in advanced piano technique and comprehensive music theory instruction.",
            staff2ImageAlt: "Photo of [Teacher Name 2]",
            staff3Name: "[Teacher Name 3]",
            staff3Title: "Drama & Communications Coach",
            staff3Bio: "BA Drama & Theatre Arts. Passionate about using drama to build confidence, creativity, and effective communication skills in students of all ages.",
            staff3ImageAlt: "Photo of [Teacher Name 3]",
            staff4Name: "[Teacher Name 4]",
            staff4Title: "General English Instructor",
            staff4Bio: "BA English Language Teaching. Experienced in teaching communicative English to young learners and adults, focusing on practical application.",
            staff4ImageAlt: "Photo of [Teacher Name 4]",
            adminStaff1Name: "[Admin Staff Name 1]",
            adminStaff1Title: "Center Manager",
            adminStaff1Bio: "Oversees daily operations and student services. Contact for administrative inquiries.",
            adminStaff1ImageAlt: "Photo of [Admin Staff Name 1]",
            adminStaff2Name: "[Admin Staff Name 2]",
            adminStaff2Title: "Admissions Coordinator",
            adminStaff2Bio: "Assists with course registration, fees, and scheduling inquiries.",
            adminStaff2ImageAlt: "Photo of [Admin Staff Name 2]",
            feedbackPageTitle: "Feedback - KITA Edu Center",
            feedbackMetaDescription: "Share your feedback with KITA Edu Center. We value your opinions to help us improve.",
            feedbackHeroTitle: "Share Your Feedback",
            feedbackHeroSubtitle: "Your opinions help us grow and improve.",
            feedbackFormTitle: "We Value Your Input",
            feedbackFormNameLabel: "Full Name (Optional)",
            feedbackFormNamePlaceholder: "Your Full Name",
            feedbackFormEmailLabel: "Email Address (Optional)",
            feedbackFormEmailPlaceholder: "your.email@example.com",
            feedbackOverallExperienceLabel: "Overall Experience",
            feedbackPositiveButton: "Positive",
            feedbackImprovementButton: "Needs Improvement",
            feedbackTypeLabel: "Type of Feedback",
            feedbackTypeOptionGeneral: "General Comment",
            feedbackTypeOptionSuggestion: "Suggestion for Improvement",
            feedbackTypeOptionCompliment: "Compliment for Staff/Course",
            feedbackTypeOptionIssue: "Issue or Problem Report",
            feedbackTypeOptionQuestion: "Question",
            feedbackYourFeedbackLabel: "Your Feedback",
            feedbackFormMessagePlaceholder: "Please share your thoughts with us...",
            feedbackSubmitButton: "Submit Feedback",
            feedbackFormStatusSending: "Submitting feedback...",
            feedbackFormStatusSuccess: "Thank you for your feedback!",
            feedbackFormStatusErrorEndpoint: "Error: Feedback form endpoint not configured.",
            feedbackFormStatusErrorFail: "Failed to submit feedback. {errorMessage}",
            feedbackFormStatusErrorGeneral: "An error occurred while submitting feedback. Please try again.",
            feesPageTitle: "Fees & Tuition - KITA Edu Center",
            feesMetaDescription: "View the course fees, tuition schedules, and payment information for KITA Edu Center in HCMC.",
            feesHeroTitle: "Fees & Tuition",
            feesHeroSubtitle: "Transparent pricing for our quality programs.",
            feesScheduleTitle: "Course Fees Schedule",
            feesScheduleSubtitle: "Find detailed information below. All fees are in VND.",
            feesTableHeaderCourse: "Course / Program",
            feesTableHeaderDuration: "Duration / Frequency",
            feesTableHeaderTuition: "Tuition Fee (per term/course)",
            feesTableHeaderNotes: "Notes",
            feesGenEngL1: "General English - Level 1",
            feesGenEngL1Duration: "12 Weeks (2 sessions/week)",
            feesGenEngL1Notes: "Includes materials",
            feesGenEngL2: "General English - Level 2",
            feesGenEngL2Duration: "12 Weeks (2 sessions/week)",
            feesGenEngL2Notes: "Includes materials",
            feesIELTSPrep: "IELTS Preparation",
            feesIELTSPrepDuration: "10 Weeks (3 sessions/week)",
            feesIELTSPrepNotes: "Mock tests included",
            feesBizEng: "Business English",
            feesBizEngDuration: "8 Weeks (2 sessions/week)",
            feesBizEngNotes: "Focus on professional skills",
            feesABRSM13Piano: "ABRSM Music - Grade 1-3 (Piano)",
            feesABRSM13Duration: "Per Term (1 session/week)",
            feesABRSM13Notes: "Exam fees separate",
            feesABRSM46Violin: "ABRSM Music - Grade 4-6 (Violin)",
            feesABRSM46Duration: "Per Term (1 session/week)",
            feesABRSM46Notes: "Exam fees separate",
            feesDramaKids: "Drama & Public Speaking (Kids)",
            feesDramaKidsDuration: "Per Term (1 session/week)",
            feesDramaKidsNotes: "Performance opportunities",
            feesImportantInfoTitle: "Important Information",
            feesInfoRegFee: "A one-time registration fee of [Amount] VND applies to new students.",
            feesInfoSiblingDiscount: "Sibling discounts may be available. Please inquire.",
            feesInfoSubjectToChange: "Fees are subject to change. Please confirm upon registration.",
            feesInfoPaymentMethods: "Payment can be made via bank transfer or cash at the center.",
            feesInfoTermDates: "Term dates align with [Specify schedule, e.g., school terms].",
            feesContactButton: "Contact Us for Details",

            // Events Page - NEW
            eventsPageTitle: "Events & Workshops - KITA Edu Center",
            eventsMetaDescription: "Stay updated on upcoming events, workshops, performances, and open days at KITA Edu Center in HCMC.",
            eventsHeroTitle: "Upcoming Events",
            eventsHeroSubtitle: "Join our workshops, performances, and community gatherings.",
            eventsSectionTitle: "What's Happening at KITA Edu",
            eventsSectionSubtitle: "Mark your calendars!",
            event1Title: "Student Performance Night",
            event1Time: "6:00 PM - 8:00 PM",
            event1Location: "KITA Edu Center Hall",
            event1Description: "Come and support our talented music and drama students as they showcase their progress. Free admission, open to family and friends.",
            event1Button: "RSVP / Inquire",
            event1ImageAlt: "Student Performance Night",
            event2Title: "Free IELTS Writing Workshop",
            event2Time: "2:00 PM - 4:00 PM",
            event2Location: "KITA Edu Center - Room 3",
            event2Description: "Learn key strategies and tips for tackling IELTS Writing Task 1 and Task 2. Limited spots available.",
            event2Button: "Register Now",
            event2ImageAlt: "IELTS Workshop",
            eventPastTitle: "KITA Edu Center Open Day (Past Event)",
            eventPastTime: "10:00 AM - 3:00 PM",
            eventPastLocation: "KITA Edu Center",
            eventPastDescription: "Thank you to everyone who joined our open day! We enjoyed meeting prospective students and parents.",
            eventPastImageAlt: "Open Day (Past)",
            eventsCheckBackMsg: "Check back regularly for new events or follow us on [Social Media Link]!"
        },
        vi: {
            // ... (all previously defined VI strings up to Fees Page) ...
            pageTitle: "Trung Tâm KITA - Tiếng Anh & Biểu Diễn Nghệ Thuật | TP.HCM",
            metaDescription: "Trung Tâm Giáo Dục KITA cung cấp các khóa học Tiếng Anh và Biểu diễn Nghệ thuật hàng đầu tại TP. Hồ Chí Minh. Hãy tham gia để khai phá tiềm năng của bạn.",
            navHome: "Trang Chủ",
            navAbout: "Về Chúng Tôi",
            navCourses: "Khóa Học",
            navFees: "Học Phí",
            navEvents: "Sự Kiện",
            navBlog: "Blog",
            navStaff: "Đội Ngũ",
            navContact: "Liên Hệ",
            navFeedback: "Phản Hồi",
            searchPlaceholder: "Tìm kiếm...",
            searchNoResults: "Không tìm thấy kết quả.",
            heroTitle: "Khai Phá Tiềm Năng Tiếng Anh & Nghệ Thuật",
            heroSubtitle: "Tham gia Trung Tâm Giáo Dục KITA tại TP. Hồ Chí Minh để được hướng dẫn chuyên sâu về ngôn ngữ và biểu diễn.",
            heroButton: "Khám Phá Khóa Học",
            welcomeTitle: "Chào Mừng Đến Với Trung Tâm KITA",
            welcomeSubtitle: "Hành trình đến sự xuất sắc của bạn bắt đầu từ đây.",
            centerImageAlt: "Cơ sở vật chất Trung Tâm KITA",
            welcomePara1: "Tọa lạc tại vị trí thuận lợi ở TP. Hồ Chí Minh, Trung Tâm Giáo Dục KITA tận tâm cung cấp chương trình giáo dục hàng đầu về kỹ năng tiếng Anh và đa dạng các loại hình nghệ thuật biểu diễn. Chúng tôi tin vào việc nuôi dưỡng tài năng trong một môi trường hỗ trợ và đầy cảm hứng.",
            welcomePara2: "Cơ sở vật chất hiện đại, đội ngũ giáo viên giàu kinh nghiệm và các chương trình được quốc tế công nhận (như ABRSM) đảm bảo học viên của chúng tôi nhận được sự chuẩn bị tốt nhất cho thành công trong tương lai.",
            learnMoreButton: "Tìm Hiểu Thêm",
            popularProgramsTitle: "Chương Trình Nổi Bật",
            popularProgramsSubtitle: "Khám phá các khóa học được thiết kế cho sự thành công.",
            englishCourseAlt: "Khóa học Tiếng Anh",
            commEnglishTitle: "Tiếng Anh Giao Tiếp",
            commEnglishDesc: "Nâng cao sự lưu loát và tự tin cho giao tiếp hàng ngày và môi trường chuyên nghiệp.",
            abrsmAlt: "Luyện thi ABRSM",
            abrsmTitle: "Luyện Thi ABRSM",
            abrsmDesc: "Luyện thi toàn diện cho các kỳ thi âm nhạc thực hành và lý thuyết của ABRSM.",
            publicSpeakingAlt: "Khóa học Hùng biện",
            publicSpeakingTitle: "Hùng Biện & Kịch Nghệ",
            publicSpeakingDesc: "Xây dựng sự tự tin và bản lĩnh sân khấu qua các lớp học kịch nghệ và hùng biện tương tác.",
            detailsLink: "Chi Tiết &rarr;",
            viewAllCoursesButton: "Xem Tất Cả Khóa Học",
            ctaTitle: "Sẵn Sàng Bắt Đầu Học Tập?",
            ctaSubtitle: "Liên hệ với chúng tôi ngay hôm nay để được tư vấn hoặc ghé thăm trung tâm tại TP.HCM.",
            ctaButton: "Liên Hệ Ngay",
            footerKitaEdu: "Trung Tâm KITA",
            footerAboutText: "Ươm mầm tài năng Tiếng Anh và Nghệ thuật tại TP.HCM từ năm 2010.",
            footerQuickLinks: "Liên Kết Nhanh",
            navPrivacy: "Chính Sách Bảo Mật",
            footerContactInfo: "Thông Tin Liên Hệ",
            footerAddress: "123 Đường Mẫu, Quận 1<br>TP. Hồ Chí Minh, Việt Nam",
            footerPhoneLabel: "Điện thoại:",
            footerEmailLabel: "Email:",
            footerCopyright: "&copy; <span id=\"current-year-i18n\"></span> Trung Tâm KITA. Mọi Quyền Được Bảo Hộ.",
            aboutPageTitle: "Về Chúng Tôi - Trung Tâm KITA",
            aboutMetaDescription: "Tìm hiểu về sứ mệnh, tầm nhìn, giá trị và cam kết của Trung Tâm Giáo Dục KITA đối với giáo dục chất lượng tại TP.HCM.",
            aboutHeroTitle: "Về Trung Tâm Giáo Dục KITA",
            aboutHeroSubtitle: "Khám phá niềm đam mê giáo dục và nghệ thuật của chúng tôi.",
            missionSectionTitle: "Sứ Mệnh Của Chúng Tôi",
            missionImageAlt: "Minh họa cho sứ mệnh",
            missionText: "Cung cấp nền giáo dục xuất sắc trong lĩnh vực Tiếng Anh và Nghệ thuật Biểu diễn, giúp học viên tại TP. Hồ Chí Minh phát huy tối đa tiềm năng, xây dựng sự tự tin và nuôi dưỡng tình yêu học tập, sáng tạo suốt đời.",
            visionSectionTitle: "Tầm Nhìn Của Chúng Tôi",
            visionImageAlt: "Minh họa cho tầm nhìn",
            visionText: "Trở thành trung tâm giáo dục ngôn ngữ và nghệ thuật hàng đầu và đáng tin cậy nhất trong khu vực, được công nhận về phương pháp giảng dạy đổi mới, câu chuyện thành công của học viên và đóng góp cho văn hóa.",
            whyChooseSectionTitle: "Vì Sao Chọn Trung Tâm KITA?",
            whyChooseSubtitle: "Trải nghiệm sự khác biệt mà tâm huyết mang lại.",
            featureExpertInstructors: "Giáo Viên Chuyên Môn",
            featureExpertDesc: "Học hỏi từ những giáo viên tận tâm, có chứng chỉ và giàu kinh nghiệm trong lĩnh vực của họ.",
            featureProvenCurriculum: "Chương Trình Đã Được Chứng Minh",
            featureProvenDesc: "Tham gia các chương trình có cấu trúc, hiệu quả bao gồm các tiêu chuẩn quốc tế như ABRSM.",
            featureModernFacilities: "Cơ Sở Vật Chất Hiện Đại",
            featureModernDesc: "Học tập trong một môi trường thoải mái, được trang bị đầy đủ, thiết kế để nâng cao việc học.",
            featureSupportiveCommunity: "Cộng Đồng Hỗ Trợ",
            featureSupportiveDesc: "Tham gia một bầu không khí chào đón, khuyến khích sự phát triển, hợp tác và tự tin.",
            directorSectionTitle: "Gặp Gỡ Giám Đốc Của Chúng Tôi",
            directorImageAlt: "Tên Giám đốc",
            directorName: "[Tên Giám Đốc]",
            directorTitle: "Người Sáng Lập & Giám Đốc",
            directorBio: "Đôi lời từ giám đốc về niềm đam mê, kinh nghiệm và triết lý của trung tâm. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            meetFullTeamButton: "Gặp Gỡ Toàn Đội Ngũ",
            coursesPageTitle: "Các Khóa Học - Trung Tâm KITA",
            coursesMetaDescription: "Khám phá các khóa học Tiếng Anh và Biểu diễn Nghệ thuật tại Trung Tâm KITA TP.HCM, bao gồm luyện thi ABRSM.",
            coursesHeroTitle: "Các Khóa Học Của Chúng Tôi",
            coursesHeroSubtitle: "Tìm chương trình hoàn hảo để nâng cao kỹ năng của bạn.",
            englishProgramsTitle: "Chương Trình Tiếng Anh",
            englishProgramsSubtitle: "Từ kỹ năng nền tảng đến sự lưu loát nâng cao.",
            genEngCourseTitle: "Tiếng Anh Tổng Quát (Mọi Cấp Độ)",
            genEngCourseDesc: "Phát triển toàn diện các kỹ năng nghe, nói, đọc, viết cho giao tiếp hàng ngày.",
            genEngLevel: "Cấp độ: Sơ cấp đến Nâng cao",
            genEngFocus: "Trọng tâm: Ngữ pháp, Từ vựng, Giao tiếp",
            genEngIdeal: "Lý tưởng cho: Cải thiện ngôn ngữ toàn diện",
            ieltsPrepCourseTitle: "Luyện Thi IELTS",
            ieltsPrepCourseDesc: "Huấn luyện và chiến lược mục tiêu giúp bạn đạt điểm IELTS mong muốn.",
            ieltsFocus: "Trọng tâm: Chiến lược Đọc/Viết học thuật, Nghe/Nói",
            ieltsFeatures: "Đặc điểm: Thi thử, phản hồi từ chuyên gia",
            ieltsIdeal: "Lý tưởng cho: Du học, định cư",
            bizEngCourseTitle: "Tiếng Anh Thương Mại",
            bizEngCourseDesc: "Nắm vững ngôn ngữ cần thiết cho môi trường chuyên nghiệp, bao gồm thuyết trình, đàm phán và email.",
            bizEngFocus: "Trọng tâm: Giao tiếp chuyên nghiệp, từ vựng ngành",
            bizEngActivities: "Hoạt động: Đóng vai, nghiên cứu tình huống",
            bizEngIdeal: "Lý tưởng cho: Chuyên gia đi làm, thăng tiến sự nghiệp",
            artProgramsTitle: "Chương Trình Biểu Diễn Nghệ Thuật",
            artProgramsSubtitle: "Thể hiện bản thân qua âm nhạc và kịch nghệ.",
            abrsmCourseTitle: "Âm Nhạc ABRSM (Thực Hành & Lý Thuyết)",
            abrsmCourseDesc: "Các bài học có cấu trúc theo giáo trình ABRSM cho nhiều nhạc cụ (Piano, Violin, v.v.) và lý thuyết âm nhạc.",
            abrsmInstruments: "Nhạc cụ: Piano, Violin, Guitar (Ghi rõ các loại có sẵn)",
            abrsmFocus: "Trọng tâm: Kỹ thuật,レパートリー, cảm thụ âm nhạc, lý thuyết",
            abrsmIdeal: "Lý tưởng cho: Thi lấy chứng chỉ âm nhạc, phát triển kỹ năng",
            dramaCourseTitle: "Kịch Nghệ & Hùng Biện",
            dramaCourseDesc: "Phát triển kỹ năng diễn xuất, bản lĩnh sân khấu và giao tiếp tự tin qua các bài tập kịch tương tác.",
            dramaFocus: "Trọng tâm: Diễn xuất ứng tác, luyện giọng, xây dựng nhân vật",
            dramaBenefits: "Lợi ích: Xây dựng sự tự tin, sáng tạo",
            dramaIdeal: "Lý tưởng cho: Mọi lứa tuổi yêu thích biểu diễn",
            inquireNowButton: "Tư Vấn Ngay",
            contactPageTitle: "Liên Hệ - Trung Tâm KITA",
            contactMetaDescription: "Liên hệ với Trung Tâm Giáo Dục KITA tại TP.HCM. Tìm địa chỉ, số điện thoại, email, bản đồ và gửi tin nhắn cho chúng tôi.",
            contactHeroTitle: "Liên Hệ Với Chúng Tôi",
            contactHeroSubtitle: "Chúng tôi luôn sẵn sàng hỗ trợ và trả lời mọi thắc mắc của bạn.",
            contactGetInTouchTitle: "Liên Lạc",
            contactVisitCallEmail: "Hãy đến thăm, gọi điện hoặc gửi email cho chúng tôi. Rất mong nhận được phản hồi từ bạn!",
            contactAddressLabel: "Địa chỉ:",
            contactAddressText: "123 Đường Mẫu, Phường X, Quận 1, TP. Hồ Chí Minh, Việt Nam",
            contactPhoneLabel: "Điện thoại:",
            contactEmailLabel: "Email:",
            contactHoursLabel: "Giờ làm việc:",
            contactHoursText: "Thứ 2 - Thứ 6: 9:00 - 19:00 | Thứ 7: 9:00 - 13:00",
            contactSendMessageTitle: "Gửi Tin Nhắn Cho Chúng Tôi",
            contactFormNameLabel: "Họ và Tên",
            contactFormNamePlaceholder: "Họ và Tên Của Bạn",
            contactFormEmailLabel: "Địa Chỉ Email",
            contactFormEmailPlaceholder: "email.cua.ban@example.com",
            contactFormPhoneLabel: "Số Điện Thoại (Không bắt buộc)",
            contactFormPhonePlaceholder: "+84 ...",
            contactFormSubjectLabel: "Chủ Đề",
            contactFormSubjectPlaceholder: "Ví dụ: Yêu cầu tư vấn khóa học",
            contactFormMessageLabel: "Nội Dung Tin Nhắn",
            contactFormMessagePlaceholder: "Chúng tôi có thể giúp gì cho bạn?",
            contactFormSendButton: "Gửi Tin Nhắn",
            contactFormStatusSending: "Đang gửi...",
            contactFormStatusSuccess: "Gửi tin nhắn thành công! Chúng tôi sẽ sớm liên hệ lại với bạn.",
            contactFormStatusErrorEndpoint: "Lỗi: Điểm cuối của biểu mẫu chưa được định cấu hình.",
            contactFormStatusErrorFail: "Không thể gửi tin nhắn. {errorMessage}",
            contactFormStatusErrorGeneral: "Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại sau.",
            contactMapTitle: "Vị Trí Trung Tâm KITA",
            staffPageTitle: "Đội Ngũ Của Chúng Tôi - Trung Tâm KITA",
            staffMetaDescription: "Gặp gỡ đội ngũ giáo viên tận tâm và giàu kinh nghiệm tại Trung Tâm Giáo Dục KITA, TP.HCM.",
            staffHeroTitle: "Gặp Gỡ Đội Ngũ Của Chúng Tôi",
            staffHeroSubtitle: "Những nhà giáo dục đầy nhiệt huyết tận tâm vì sự thành công của bạn.",
            teachingStaffSectionTitle: "Đội Ngũ Giảng Dạy",
            teachingStaffSectionSubtitle: "Các chuyên gia giàu kinh nghiệm trong Tiếng Anh và Nghệ thuật.",
            supportStaffSectionTitle: "Nhân Viên Hỗ Trợ",
            supportStaffSectionSubtitle: "Giúp trải nghiệm của bạn được suôn sẻ.",
            staff1Name: "[Tên Giáo Viên 1]",
            staff1Title: "Giáo viên Tiếng Anh Cấp Cao (Chuyên Luyện IELTS)",
            staff1Bio: "Thạc sĩ TESOL, chứng chỉ Cambridge CELTA. Hơn 10 năm kinh nghiệm giúp học viên đạt điểm IELTS cao và cải thiện tiếng Anh học thuật.",
            staff1ImageAlt: "Ảnh Giáo viên 1",
            staff2Name: "[Tên Giáo Viên 2]",
            staff2Title: "Trưởng Khoa Nghệ Thuật Biểu Diễn (Piano & Lý Thuyết)",
            staff2Bio: "Thạc sĩ Âm nhạc Biểu diễn, Giám khảo ABRSM (DipABRSM). Chuyên về kỹ thuật piano nâng cao và giảng dạy lý thuyết âm nhạc toàn diện.",
            staff2ImageAlt: "Ảnh Giáo viên 2",
            staff3Name: "[Tên Giáo Viên 3]",
            staff3Title: "Huấn Luyện Viên Kịch Nghệ & Giao Tiếp",
            staff3Bio: "Cử nhân Kịch nghệ & Sân khấu. Đam mê sử dụng kịch nghệ để xây dựng sự tự tin, sáng tạo và kỹ năng giao tiếp hiệu quả cho học viên mọi lứa tuổi.",
            staff3ImageAlt: "Ảnh Giáo viên 3",
            staff4Name: "[Tên Giáo Viên 4]",
            staff4Title: "Giáo Viên Tiếng Anh Tổng Quát",
            staff4Bio: "Cử nhân Giảng dạy Tiếng Anh. Giàu kinh nghiệm giảng dạy tiếng Anh giao tiếp cho thiếu nhi và người lớn, tập trung vào ứng dụng thực tế.",
            staff4ImageAlt: "Ảnh Giáo viên 4",
            adminStaff1Name: "[Tên Nhân Viên HC 1]",
            adminStaff1Title: "Quản Lý Trung Tâm",
            adminStaff1Bio: "Giám sát hoạt động hàng ngày và dịch vụ học viên. Liên hệ για các vấn đề hành chính.",
            adminStaff1ImageAlt: "Ảnh Nhân viên HC 1",
            adminStaff2Name: "[Tên Nhân Viên HC 2]",
            adminStaff2Title: "Điều Phối Viên Tuyển Sinh",
            adminStaff2Bio: "Hỗ trợ đăng ký khóa học, học phí và các thắc mắc về lịch học.",
            adminStaff2ImageAlt: "Ảnh Nhân viên HC 2",
            feedbackPageTitle: "Phản Hồi - Trung Tâm KITA",
            feedbackMetaDescription: "Chia sẻ phản hồi của bạn với Trung Tâm Giáo Dục KITA. Chúng tôi trân trọng ý kiến của bạn để giúp chúng tôi cải thiện.",
            feedbackHeroTitle: "Chia Sẻ Phản Hồi Của Bạn",
            feedbackHeroSubtitle: "Ý kiến của bạn giúp chúng tôi phát triển và cải thiện.",
            feedbackFormTitle: "Chúng Tôi Trân Trọng Ý Kiến Của Bạn",
            feedbackFormNameLabel: "Họ và Tên (Không bắt buộc)",
            feedbackFormNamePlaceholder: "Họ và Tên Của Bạn",
            feedbackFormEmailLabel: "Địa Chỉ Email (Không bắt buộc)",
            feedbackFormEmailPlaceholder: "email.cua.ban@example.com",
            feedbackOverallExperienceLabel: "Trải Nghiệm Tổng Thể",
            feedbackPositiveButton: "Tích cực",
            feedbackImprovementButton: "Cần Cải Thiện",
            feedbackTypeLabel: "Loại Phản Hồi",
            feedbackTypeOptionGeneral: "Bình luận chung",
            feedbackTypeOptionSuggestion: "Góp ý cải thiện",
            feedbackTypeOptionCompliment: "Khen ngợi Nhân viên/Khóa học",
            feedbackTypeOptionIssue: "Báo cáo Vấn đề/Sự cố",
            feedbackTypeOptionQuestion: "Câu hỏi",
            feedbackYourFeedbackLabel: "Nội Dung Phản Hồi Của Bạn",
            feedbackFormMessagePlaceholder: "Vui lòng chia sẻ suy nghĩ của bạn với chúng tôi...",
            feedbackSubmitButton: "Gửi Phản Hồi",
            feedbackFormStatusSending: "Đang gửi phản hồi...",
            feedbackFormStatusSuccess: "Cảm ơn bạn đã phản hồi!",
            feedbackFormStatusErrorEndpoint: "Lỗi: Biểu mẫu phản hồi chưa được định cấu hình điểm cuối.",
            feedbackFormStatusErrorFail: "Không thể gửi phản hồi. {errorMessage}",
            feedbackFormStatusErrorGeneral: "Đã xảy ra lỗi khi gửi phản hồi. Vui lòng thử lại.",
            feesPageTitle: "Học Phí - Trung Tâm KITA",
            feesMetaDescription: "Xem biểu phí khóa học, lịch học và thông tin thanh toán tại Trung Tâm Giáo Dục KITA, TP.HCM.",
            feesHeroTitle: "Học Phí & Lịch Học",
            feesHeroSubtitle: "Giá cả minh bạch cho các chương trình chất lượng của chúng tôi.",
            feesScheduleTitle: "Biểu Phí Khóa Học",
            feesScheduleSubtitle: "Thông tin chi tiết bên dưới. Tất cả học phí tính bằng VND.",
            feesTableHeaderCourse: "Khóa Học / Chương Trình",
            feesTableHeaderDuration: "Thời Lượng / Tần Suất",
            feesTableHeaderTuition: "Học Phí (mỗi kỳ/khóa)",
            feesTableHeaderNotes: "Ghi Chú",
            feesGenEngL1: "Tiếng Anh Tổng Quát - Cấp Độ 1",
            feesGenEngL1Duration: "12 Tuần (2 buổi/tuần)",
            feesGenEngL1Notes: "Đã bao gồm tài liệu",
            feesGenEngL2: "Tiếng Anh Tổng Quát - Cấp Độ 2",
            feesGenEngL2Duration: "12 Tuần (2 buổi/tuần)",
            feesGenEngL2Notes: "Đã bao gồm tài liệu",
            feesIELTSPrep: "Luyện Thi IELTS",
            feesIELTSPrepDuration: "10 Tuần (3 buổi/tuần)",
            feesIELTSPrepNotes: "Đã bao gồm thi thử",
            feesBizEng: "Tiếng Anh Thương Mại",
            feesBizEngDuration: "8 Tuần (2 buổi/tuần)",
            feesBizEngNotes: "Tập trung kỹ năng chuyên nghiệp",
            feesABRSM13Piano: "Âm Nhạc ABRSM - Cấp Độ 1-3 (Piano)",
            feesABRSM13Duration: "Mỗi Kỳ (1 buổi/tuần)",
            feesABRSM13Notes: "Chưa bao gồm lệ phí thi",
            feesABRSM46Violin: "Âm Nhạc ABRSM - Cấp Độ 4-6 (Violin)",
            feesABRSM46Duration: "Mỗi Kỳ (1 buổi/tuần)",
            feesABRSM46Notes: "Chưa bao gồm lệ phí thi",
            feesDramaKids: "Kịch Nghệ & Hùng Biện (Trẻ Em)",
            feesDramaKidsDuration: "Mỗi Kỳ (1 buổi/tuần)",
            feesDramaKidsNotes: "Có cơ hội biểu diễn",
            feesImportantInfoTitle: "Thông Tin Quan Trọng",
            feesInfoRegFee: "Phí ghi danh [Số tiền] VND áp dụng cho học viên mới.",
            feesInfoSiblingDiscount: "Có thể có giảm giá cho anh chị em ruột. Vui lòng hỏi.",
            feesInfoSubjectToChange: "Học phí có thể thay đổi. Vui lòng xác nhận khi đăng ký.",
            feesInfoPaymentMethods: "Thanh toán qua chuyển khoản ngân hàng hoặc tiền mặt tại trung tâm.",
            feesInfoTermDates: "Ngày khai giảng theo [Ghi rõ lịch, ví dụ: lịch học của trường]." ,
            feesContactButton: "Liên Hệ Để Biết Chi Tiết",

            // Events Page - NEW
            eventsPageTitle: "Sự Kiện & Hội Thảo - Trung Tâm KITA",
            eventsMetaDescription: "Cập nhật các sự kiện, hội thảo, buổi biểu diễn và ngày hội thông tin sắp tới tại Trung Tâm KITA, TP.HCM.",
            eventsHeroTitle: "Sự Kiện Sắp Tới",
            eventsHeroSubtitle: "Tham gia các hội thảo, buổi biểu diễn và hoạt động cộng đồng của chúng tôi.",
            eventsSectionTitle: "Có Gì Hot Tại KITA Edu",
            eventsSectionSubtitle: "Đánh dấu lịch của bạn!",
            event1Title: "Đêm Biểu Diễn Của Học Viên",
            event1Time: "18:00 - 20:00",
            event1Location: "Hội Trường Trung Tâm KITA",
            event1Description: "Hãy đến và cổ vũ cho các tài năng âm nhạc và kịch nghệ của chúng tôi khi các em thể hiện sự tiến bộ. Vào cửa tự do, chào đón gia đình và bạn bè.",
            event1Button: "Đăng Ký / Hỏi Thêm",
            event1ImageAlt: "Đêm Biểu Diễn Học Viên",
            event2Title: "Hội Thảo Viết IELTS Miễn Phí",
            event2Time: "14:00 - 16:00",
            event2Location: "Trung Tâm KITA - Phòng 3",
            event2Description: "Học các chiến lược và mẹo quan trọng để chinh phục Task 1 và Task 2 của phần Viết IELTS. Số lượng có hạn.",
            event2Button: "Đăng Ký Ngay",
            event2ImageAlt: "Hội Thảo IELTS",
            eventPastTitle: "Ngày Hội Thông Tin KITA Edu (Đã Diễn Ra)",
            eventPastTime: "10:00 - 15:00",
            eventPastLocation: "Trung Tâm KITA",
            eventPastDescription: "Cảm ơn tất cả mọi người đã tham gia ngày hội thông tin! Chúng tôi rất vui được gặp gỡ các học viên và phụ huynh tiềm năng.",
            eventPastImageAlt: "Ngày Hội Thông Tin (Đã Qua)",
            eventsCheckBackMsg: "Kiểm tra thường xuyên để biết các sự kiện mới hoặc theo dõi chúng tôi trên [Liên kết Mạng Xã Hội]!"
        }
    };

    const langEnButton = document.getElementById('lang-en-button');
    const langViButton = document.getElementById('lang-vi-button');

    const setLanguage = (lang) => {
        const currentStrings = i18nStrings[lang] || i18nStrings.en;
        const fallbackStrings = i18nStrings.en; 

        const elements = document.querySelectorAll('[data-i18n-key]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n-key');
            const targetAttribute = el.getAttribute('data-i18n-target');
            let translation = currentStrings[key] !== undefined ? currentStrings[key] : (fallbackStrings[key] || '');


            if (targetAttribute) {
                if (el.tagName === 'TITLE' && targetAttribute === '_self') { 
                     document.title = translation;
                } else if (el.tagName === 'META' && targetAttribute === 'content' && el.getAttribute('name') === 'description'){ 
                    el.setAttribute(targetAttribute, translation);
                } else if (el.tagName === 'INPUT' && targetAttribute === 'placeholder'){
                    el.setAttribute(targetAttribute, translation);
                } else if (el.tagName === 'TEXTAREA' && targetAttribute === 'placeholder'){
                    el.setAttribute(targetAttribute, translation);
                } else if (el.tagName === 'IMG' && targetAttribute === 'alt'){
                    el.setAttribute(targetAttribute, translation);
                } else if (el.tagName === 'IFRAME' && targetAttribute === 'title'){
                    el.setAttribute(targetAttribute, translation);
                }
                else {
                    el.setAttribute(targetAttribute, translation);
                }
            } else {
                el.innerHTML = translation;
            }
        });

        if (lang === 'en') {
            if(langEnButton) langEnButton.classList.add('active-lang');
            if(langViButton) langViButton.classList.remove('active-lang');
            document.documentElement.setAttribute('lang', 'en');
        } else if (lang === 'vi') {
            if(langViButton) langViButton.classList.add('active-lang');
            if(langEnButton) langEnButton.classList.remove('active-lang');
            document.documentElement.setAttribute('lang', 'vi');
        }

        try {
            localStorage.setItem('kita-lang', lang);
        } catch (e) {
            console.warn('Could not save language preference to localStorage:', e);
        }

        const yearSpanI18n = document.getElementById('current-year-i18n');
        if (yearSpanI18n && yearSpanI18n.parentElement && yearSpanI18n.parentElement.offsetParent !== null) { 
             yearSpanI18n.textContent = new Date().getFullYear();
        } else { 
            const originalYearSpan = document.getElementById('current-year');
            if (originalYearSpan) {
                originalYearSpan.textContent = new Date().getFullYear();
            }
        }
        const formStatusElement = document.getElementById('form-status'); 
        if (formStatusElement && formStatusElement.dataset.i18nKey) { 
            const key = formStatusElement.dataset.i18nKey;
            let translation = currentStrings[key] || fallbackStrings[key] || formStatusElement.textContent;
            if (key.includes('ErrorFail') && formStatusElement.textContent.includes('Error:')) {
            }
            formStatusElement.textContent = translation;
        }
    };

    if (langEnButton && langViButton) {
        langEnButton.addEventListener('click', () => setLanguage('en'));
        langViButton.addEventListener('click', () => setLanguage('vi'));

        let preferredLang = 'en';
         try {
            const savedLang = localStorage.getItem('kita-lang');
            if (savedLang && (savedLang === 'en' || savedLang === 'vi')) {
                preferredLang = savedLang;
            }
        } catch (e) {
            console.warn('Could not access localStorage for language preference:', e);
        }
        setLanguage(preferredLang); 
    }
    // --- End Simple I18N ---

}); // End DOMContentLoaded