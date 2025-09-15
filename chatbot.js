// A flag to ensure the greeting is only added once
let hasGreeted = false;

// UI elements
const widget = document.getElementById("chatbot-widget");
const toggle = document.getElementById("chatbot-toggle");
const closeBtn = document.getElementById("chatbot-close");
const body = document.getElementById("chatbot-body");
const input = document.getElementById("chatbot-input");
const send = document.getElementById("chatbot-send");
const typingIndicator = document.getElementById("typing-indicator");
const chatbotTeaser = document.getElementById("chatbot-teaser");

// Variables to hold our timeout IDs so we can clear them
let teaserTimeout, hideTimeout;


// --- Helper Functions ---
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) {
        return "Good morning! ☀️ I’m TechBot. How can I help you with Lipaspot?";
    } else if (hour < 18) {
        return "Good afternoon! 👋 I’m TechBot. What can I tell you about Lipaspot?";
    } else {
        return "Good evening! ✨ I’m TechBot. How can I assist you today?";
    }
}

function getAnswer(userInput) {
    userInput = userInput.toLowerCase().trim();
    let bestMatch = null;
    let bestScore = 0;

    // Your existing FAQ data with more aliases
    const faqData = [
        { q: "hello", a: "👋 Hi there! I’m TechBot. How can I help you today?", aliases: ["hi", "hey", "greetings"] },
        { q: "how are you", a: "I’m running at 100% ⚡ How are you doing?", aliases: ["how you doin'", "whats up"] },
        { q: "what is lipaspot", a: "Lipaspot is a fintech solution that automates M-Pesa confirmations, staff tracking, and business reporting.", aliases: ["what does lipaspot do", "tell me about lipaspot", "what is your service"] },
        { q: "how does lipaspot confirm m-pesa payments", a: "Our PDQ machine captures the M-Pesa confirmation and instantly broadcasts it to staff devices.", aliases: ["m-pesa confirmations", "how does the system work", "how do you confirm payments"] },
        { q: "how does the system help staff claim transactions", a: "Staff can claim transactions on their phone, linking payments to employees for tracking.", aliases: ["staff claims", "claiming transactions", "how does staff tracking work"] },
        { q: "how does lipaspot simplify end-of-shift reconciliation", a: "The system auto-generates detailed reports for each staff member at shift end.", aliases: ["shift reports", "end of day reconciliation", "reconcile daily payments"] },
        { q: "what hardware and software are required", a: "We provide a PDQ machine with Lipaspot software, a mobile app for staff, and a web dashboard for managers.", aliases: ["what do I need", "required equipment", "requirements to use lipaspot"] },
        { q: "can business owners track performance in real-time", a: "Yes, managers can monitor sales and staff activity live from the web interface.", aliases: ["real-time tracking", "track performance", "live reports"] },
        { q: "is my business data secure", a: "Yes ✅ we use strong encryption, MFA, and audits to keep your data safe.", aliases: ["data security", "is it safe", "how is my data protected"] },
        { q: "do i need to be a tech expert", a: "Nope! Lipaspot is user-friendly, with onboarding and support provided.", aliases: ["is it hard to use", "tech knowledge needed", "is it user-friendly"] },
        { q: "what kind of support do you offer", a: "We provide support via in-app chat, email, and phone 📞.", aliases: ["support options", "customer service", "how to get help"] },
        { q: "can lipaspot be customized", a: "Yes, Lipaspot can be tailored to your business needs.", aliases: ["customizable", "customization", "tailored for my business"] },
        { q: "how can i get lipaspot", a: "You can book a demo or contact us on WhatsApp to get started.", aliases: ["how to sign up", "getting started", "how to book a demo"] },
        { q: "how much does lipaspot cost", a: "We charge a setup fee plus a predictable monthly rate based on your business size.", aliases: ["price of lipaspot", "pricing", "cost", "how much is it"] },
        { q: "what kind of businesses is lipaspot for", a: "Lipaspot fits industries like retail, e-commerce, services, and more.", aliases: ["who is this for", "business types", "is it for my business"] }
    ];

    for (const item of faqData) {
        let allPossibleQuestions = [item.q.toLowerCase(), ...item.aliases.map(alias => alias.toLowerCase())];

        for (const question of allPossibleQuestions) {
            if (userInput === question) {
                return item.a;
            }
            const userWords = new Set(userInput.split(" ").filter(Boolean));
            const questionWords = new Set(question.split(" ").filter(Boolean));
            const commonWords = [...userWords].filter(word => questionWords.has(word)).length;
            const score = commonWords / userWords.size;
            if (score > bestScore) {
                bestScore = score;
                bestMatch = item.a;
            }
        }
    }
    if (bestScore > 0.3) {
        return bestMatch;
    } else {
        return "🤖 Hmm, I'm not sure about that. Could you try rephrasing your question?<br><br>You can also chat with us directly on WhatsApp:<br><a href='https://wa.me/254705292111' target='_blank' style='color:#2a7c6f; font-weight:bold;'>📲 Chat on WhatsApp</a>";
    }
}

function addMessage(text, from = "bot") {
    let msg = document.createElement("div");
    msg.className = from;
    msg.innerHTML = text;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
}

// --- Main Chatbot Logic ---
document.addEventListener("DOMContentLoaded", () => {
    // Load Lottie animations
    if (typeof lottie !== "undefined") {
        lottie.loadAnimation({
            container: document.getElementById("bot-character"),
            renderer: "svg",
            loop: true,
            autoplay: true,
            path: "https://assets1.lottiefiles.com/packages/lf20_u8o7BL.json"
        });
        lottie.loadAnimation({
            container: document.getElementById("bot-avatar"),
            renderer: "svg",
            loop: true,
            autoplay: true,
            path: "https://assets1.lottiefiles.com/packages/lf20_u8o7BL.json"
        });
    }

    // Add initial bot greeting only on the first load
    if (!hasGreeted) {
        addMessage(getGreeting());
        hasGreeted = true;
    }
    
    // Set a timeout to show the teaser after a few seconds
    teaserTimeout = setTimeout(() => {
        chatbotTeaser.classList.add('show');
    }, 2500);

    // Set another timeout to hide the teaser after a while
    hideTimeout = setTimeout(() => {
        chatbotTeaser.classList.remove('show');
    }, 8000);
});

// Toggle button logic
toggle.onclick = () => {
    widget.style.display = "flex";
    // Hide the teaser and prevent it from showing again
    chatbotTeaser.classList.remove('show');
    clearTimeout(teaserTimeout);
    clearTimeout(hideTimeout);
};

// Close button logic
closeBtn.onclick = () => {
    widget.style.display = "none";
};

// Send message logic
function sendMessage() {
    let val = input.value.trim();
    if (!val) return;
    addMessage(val, "user");
    input.value = "";

    // Show typing indicator
    typingIndicator.style.display = "flex";

    // This is the missing line to ensure it's at the very bottom
    body.appendChild(typingIndicator);

    // Scroll to the bottom of the chat body
    body.scrollTop = body.scrollHeight;

    const delay = Math.random() * 800 + 400;
    setTimeout(() => {
        // Hide typing indicator before adding the bot's response
        typingIndicator.style.display = "none";
        addMessage(getAnswer(val), "bot");
    }, delay);
}
send.onclick = sendMessage;
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});