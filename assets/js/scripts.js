/* =========================
   LipaSpot Custom Scripts (Updated)
   ========================= */

// All scripts that rely on the DOM being ready should be here
document.addEventListener("DOMContentLoaded", () => {
    // --- Scroll-based Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // This makes the CSS clip-path and fade-in effects work
    document.querySelectorAll('.fade-in, .section-title').forEach(el => {
        observer.observe(el);
    });

    // --- Testimonial carousel (auto-rotate) ---
    let testimonialIndex = 0;
    function rotateTestimonials() {
        const testimonials = document.querySelectorAll(".testimonial");
        if (testimonials.length === 0) return;

        testimonials.forEach((t, i) => {
            t.classList.toggle("active", i === testimonialIndex);
        });
        testimonialIndex = (testimonialIndex + 1) % testimonials.length;
    }
    const testimonialsExist = document.querySelectorAll(".testimonial").length > 0;
    if (testimonialsExist) {
        setInterval(rotateTestimonials, 5000);
        rotateTestimonials();
    }

    // --- Cookie consent ---
    const cookieBanner = document.getElementById("cookie-consent");
    if (cookieBanner) {
        const acceptBtn = document.getElementById("accept-cookies");
        const rejectBtn = document.getElementById("reject-cookies");
        const closeBtn = document.getElementById("close-cookies");
    
        if (!localStorage.getItem("lipaspot_cookie")) {
            cookieBanner.classList.add("show");
        }
    
        acceptBtn.addEventListener("click", () => {
            localStorage.setItem("lipaspot_cookie", "accepted");
            cookieBanner.classList.remove("show");
        });
    
        rejectBtn.addEventListener("click", () => {
            localStorage.setItem("lipaspot_cookie", "rejected");
            cookieBanner.classList.remove("show");
        });
    
        closeBtn.addEventListener("click", () => {
            cookieBanner.classList.remove("show");
        });
    }

    // --- Privacy modal ---
    const privacyModal = document.getElementById("privacy-modal");
    if (privacyModal) {
        const openBtns = document.querySelectorAll("[data-open-privacy]");
        const closeBtn = privacyModal.querySelector(".close-modal");
    
        if (openBtns.length > 0) {
            openBtns.forEach((btn) =>
                btn.addEventListener("click", () => {
                    privacyModal.style.display = "flex";
                })
            );
        }
    
        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                privacyModal.style.display = "none";
            });
        }
    
        privacyModal.addEventListener("click", (e) => {
            if (e.target === privacyModal) {
                privacyModal.style.display = "none";
            }
        });
    
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                privacyModal.style.display = "none";
            }
        });
    }

    // --- Demo form -> WhatsApp ---
    const form = document.getElementById("demo-form");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const fullname = formData.get("name") || "";
            const business = formData.get("business") || "";
            const businessType = formData.get("business_type") || "";
            const email = formData.get("email") || "";
            const phone = formData.get("phone") || "";
            const message = formData.get("message") || "";
            const whatsappNumber = "254782870821"; // ✅ your number

            const text =
                `📩 New Demo Request:%0A` +
                `*Name:* ${fullname}%0A` +
                `*Business:* ${business}%0A` +
                `*Business Type:* ${businessType}%0A` +
                `*Email:* ${email}%0A` +
                `*Phone:* ${phone}%0A` +
                `*Message:* ${message}`;

            window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank");

            setTimeout(() => {
                form.reset();
                const successMsg = document.createElement("div");
                successMsg.innerText = "✅ Your request has been sent via WhatsApp!";
                successMsg.style.color = "green";
                successMsg.style.marginTop = "15px";
                form.appendChild(successMsg);
                setTimeout(() => {
                    successMsg.remove();
                }, 5000);
            }, 500);
        });
    }

    // --- Smooth scroll for nav links ---
    const navLinks = document.querySelectorAll("a[href^='#']");
    if (navLinks.length > 0) {
        navLinks.forEach((anchor) => {
            anchor.addEventListener("click", function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute("href"));
                if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                }
            });
        });
    }

    // --- Back-to-top button ---
    // Note: The button needs a class in CSS to control its styling
    const backToTopBtn = document.createElement("button");
    backToTopBtn.innerHTML = "⬆";
    backToTopBtn.id = "back-to-top";
    backToTopBtn.classList.add('back-to-top-btn');
    document.body.appendChild(backToTopBtn);

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // --- Chatbot toggle ---
    const chatbotHeader = document.getElementById("chatbot-header");
    const chatbotBody = document.getElementById("chatbot-body");
    if (chatbotHeader && chatbotBody) {
        chatbotHeader.addEventListener("click", () => {
            chatbotBody.style.display =
                chatbotBody.style.display === "block" ? "none" : "block";
        });
    }
});