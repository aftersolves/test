// ========================================
// ===== THEME MODE SYSTEM (Light/Dark/System) =====
// ========================================
const THEME_KEY = 'aftersolves-theme-mode';

// Migrate from old system if needed
const oldTheme = localStorage.getItem('theme');
if (oldTheme && !localStorage.getItem(THEME_KEY)) {
    localStorage.setItem(THEME_KEY, oldTheme);
    localStorage.removeItem('theme');
}

function getThemeMode() {
    return localStorage.getItem(THEME_KEY) || 'system';
}

function applyTheme(mode) {
    const html = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (mode === 'dark' || (mode === 'system' && systemDark)) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
    
    updateThemeIcon(mode);
}

function updateThemeIcon(mode) {
    const button = document.getElementById('theme-toggle');
    if (!button) return;
    
    let iconName;
    if (mode === 'light') iconName = 'sun';
    else if (mode === 'dark') iconName = 'moon';
    else iconName = 'monitor';
    
    button.innerHTML = `<i data-lucide="${iconName}" class="w-4 h-4 lg:w-5 lg:h-5" stroke-width="1.5"></i>`;
    lucide.createIcons();
}

function setThemeMode(mode) {
    localStorage.setItem(THEME_KEY, mode);
    applyTheme(mode);
    updateThemeDropdownUI(mode);
}

function updateThemeDropdownUI(mode) {
    document.querySelectorAll('.theme-option').forEach(opt => {
        const check = opt.querySelector('.theme-check');
        if (opt.getAttribute('data-theme') === mode) {
            check.classList.remove('hidden');
        } else {
            check.classList.add('hidden');
        }
    });
}

// Initialize theme immediately
const currentThemeMode = getThemeMode();
applyTheme(currentThemeMode);

// Listen for system theme changes (when in system mode)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getThemeMode() === 'system') {
        applyTheme('system');
    }
});

// Theme dropdown event listeners (set up after DOM is ready)
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeDropdown = document.getElementById('theme-dropdown');
    const themeDropdownWrapper = document.getElementById('theme-dropdown-wrapper');

    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            themeDropdown.classList.toggle('hidden');
            updateThemeDropdownUI(getThemeMode());
        });
    }

    document.addEventListener('click', (e) => {
        if (themeDropdownWrapper && !themeDropdownWrapper.contains(e.target)) {
            themeDropdown.classList.add('hidden');
        }
    });

    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            const mode = opt.getAttribute('data-theme');
            setThemeMode(mode);
            themeDropdown.classList.add('hidden');
        });
    });

    updateThemeDropdownUI(currentThemeMode);
});

// ========================================
// ===== CUSTOM NOTIFICATION SYSTEM =====
// ========================================
function showNotification(message, type = 'info', duration = 4000) {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const icons = {
        success: 'check-circle',
        error: 'x-circle',
        warning: 'alert-triangle',
        info: 'info'
    };

    const bgColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-orange-500',
        info: 'bg-blue-500'
    };

    const notification = document.createElement('div');
    notification.className = `notif-enter pointer-events-auto ${bgColors[type]} text-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 max-w-sm`;
    notification.innerHTML = `
        <i data-lucide="${icons[type]}" class="w-5 h-5 flex-shrink-0" stroke-width="2"></i>
        <span class="text-sm font-normal flex-1 leading-snug">${message}</span>
        <button class="notif-close flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity">
            <i data-lucide="x" class="w-4 h-4" stroke-width="2"></i>
        </button>
    `;

    container.appendChild(notification);
    lucide.createIcons();

    function dismiss() {
        notification.classList.remove('notif-enter');
        notification.classList.add('notif-exit');
        setTimeout(() => notification.remove(), 300);
    }

    const dismissTimeout = setTimeout(dismiss, duration);

    notification.querySelector('.notif-close').addEventListener('click', () => {
        clearTimeout(dismissTimeout);
        dismiss();
    });
}

// ========================================
// ===== MOBILE MENU TOGGLE =====
// ========================================
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const hamburgerIcon = document.getElementById('hamburger-icon');

menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('flex');
    hamburgerIcon.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        hamburgerIcon.classList.remove('active');
    }
});

// ========================================
// ===== AI TOOLS DATA =====
// ========================================
const aiTools = [
    { name: "ChatGPT", img: "https://images.seeklogo.com/logo-png/46/1/chatgpt-logo-png_seeklogo-465219.png", link: "https://chat.openai.com" },
    { name: "Z.ai", img: "https://pbs.twimg.com/profile_images/1970775077181411328/W8XKaUIh_400x400.jpg", link: "https://z.ai" },
    { name: "Supabase", img: "https://logowik.com/content/uploads/images/supabase-icon1721342077.logowik.com.webp", link: "https://supabase.com" },
    { name: "Firebase", img: "https://firebase.google.com/static/images/brand-guidelines/logo-vertical.png", link: "https://firebase.google.com" },
    { name: "Cloudflare", img: "https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-avatar/avatars/cloudflare.webp", link: "https://cloudflare.com" },
    { name: "Claude", img: "https://logo-teka.com/wp-content/uploads/2026/04/claude-icon-logo.png", link: "https://claude.ai" },
    { name: "Vercel", img: "https://assets.vercel.com/image/upload/front/favicon/vercel/57x57.png", link: "https://vercel.com" },
    { name: "Tailwind", img: "https://images.seeklogo.com/logo-png/35/1/tailwind-css-logo-png_seeklogo-354675.png", link: "https://tailwindcss.com" },
    { name: "Next.js", img: "https://images.icon-icons.com/2389/PNG/512/next_js_logo_icon_145038.png", link: "https://nextjs.org" },
    { name: "GitHub", img: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png", link: "https://github.com" },
    { name: "Stripe", img: "https://img.logo.dev/stripe.com?token=live_6a1a28fd-6420-4492-aeb0-b297461d9de2&size=128&retina=true&format=png", link: "https://stripe.com" },
    { name: "Slack", img: "https://images.seeklogo.com/logo-png/49/1/slack-logo-png_seeklogo-496177.png", link: "https://slack.com" }
];

// Render AI Tools on Home
const homeAiTools = document.getElementById('home-ai-tools');
if (homeAiTools) {
    aiTools.slice(0, 5).forEach(tool => {
        homeAiTools.innerHTML += `
            <div class="flex flex-col items-center text-center group cursor-pointer">
                <a href="${tool.link}" target="_blank" class="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white dark:bg-neutral-800 mb-3 md:mb-4 overflow-hidden border-4 border-transparent group-hover:border-yellow-400 transition-all group-hover:shadow-lg flex items-center justify-center p-2">
                    <img src="${tool.img}" class="w-full h-full object-contain">
                </a>
                <span class="text-xs md:text-xl font-normal tracking-tight text-neutral-700 dark:text-neutral-300">${tool.name}</span>
            </div>
        `;
    });
    homeAiTools.innerHTML += `
        <a href="/ai-tools" data-link="/ai-tools" class="flex flex-col items-center text-center group cursor-pointer">
            <div class="w-16 h-16 md:w-24 md:h-24 rounded-full mb-3 md:mb-4 overflow-hidden flex items-center justify-center bg-yellow-200 dark:bg-yellow-900/30 text-orange-600 dark:text-yellow-400 font-normal border-4 border-transparent group-hover:border-yellow-400 transition-all text-base md:text-xl group-hover:shadow-lg">
                +6
            </div>
            <span class="text-xs md:text-xl font-normal tracking-tight text-neutral-500 dark:text-neutral-400">Powerful Tools</span>
        </a>
    `;
}

// Render AI Tools on Leadership Page
const leadershipsAiTools = document.getElementById('leaderships-ai-tools');
if (leadershipsAiTools) {
    aiTools.slice(0, 5).forEach(tool => {
        leadershipsAiTools.innerHTML += `
            <div class="flex flex-col items-center text-center group cursor-pointer">
                <a href="${tool.link}" target="_blank" class="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white dark:bg-neutral-800 mb-3 md:mb-4 overflow-hidden border-4 border-transparent group-hover:border-yellow-400 transition-all group-hover:shadow-lg flex items-center justify-center p-2">
                    <img src="${tool.img}" class="w-full h-full object-contain">
                </a>
                <span class="text-xs md:text-xl font-normal tracking-tight text-neutral-700 dark:text-neutral-300">${tool.name}</span>
            </div>
        `;
    });
    leadershipsAiTools.innerHTML += `
        <a href="/ai-tools" data-link="/ai-tools" class="flex flex-col items-center text-center group cursor-pointer">
            <div class="w-16 h-16 md:w-24 md:h-24 rounded-full mb-3 md:mb-4 overflow-hidden flex items-center justify-center bg-yellow-200 dark:bg-yellow-900/30 text-orange-600 dark:text-yellow-400 font-normal border-4 border-transparent group-hover:border-yellow-400 transition-all text-base md:text-xl group-hover:shadow-lg">
                +6
            </div>
            <span class="text-xs md:text-xl font-normal tracking-tight text-neutral-500 dark:text-neutral-400">Powerful Tools</span>
        </a>
    `;
}

// Render AI Tools on Tools Page
const aiToolsGrid = document.getElementById('ai-tools-grid');
if (aiToolsGrid) {
    aiTools.forEach(tool => {
        aiToolsGrid.innerHTML += `
            <a href="${tool.link}" target="_blank" class="bg-white dark:bg-neutral-800 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-yellow-200 dark:border-neutral-700 hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center text-center group">
                <div class="w-16 h-16 md:w-20 md:h-20 rounded-full bg-yellow-50 dark:bg-neutral-900 mb-3 md:mb-4 overflow-hidden flex items-center justify-center p-3">
                    <img src="${tool.img}" class="w-full h-full object-contain">
                </div>
                <span class="text-sm md:text-lg font-normal tracking-tight text-neutral-800 dark:text-white">${tool.name}</span>
                <span class="text-xs text-orange-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Visit Website ↗</span>
            </a>
        `;
    });
}

// ========================================
// ===== PARTNERS DATA & RENDER =====
// ========================================
const partners = [
    {
        name: "Kretworks",
        logo: "https://images.luviio.com/kretworks.gif",
        tagline: "Logo Designer & Brand Identity Studio",
        category: "Brand & Identity",
        website: "https://kretworks.com",
        about: "Kretworks is a design studio specializing in logo design and brand identity systems. As one of our trusted partners, Kretworks handles the visual identity layer for clients who need a distinct, memorable brand before we build their digital product. Their approach blends strategic thinking with refined craft — producing logos and identity systems that scale across web, app, and print.",
        services: ["Logo Design", "Brand Identity", "Visual Systems", "Design Guidelines"],
        established: "2023"
    },
    {
        name: "Luviio",
        logo: "https://images.luviio.com/aftersolves.gif.gif",
        tagline: "Creative Content & Motion Studio",
        category: "Content & Motion",
        website: "https://luviio.com",
        about: "Luviio is a creative content partner that produces motion graphics, visual assets, and brand-led storytelling. Together with AfterSolves, Luviio helps clients communicate complex technical products through engaging, high-quality visual content.",
        services: ["Motion Graphics", "Content Strategy", "Visual Assets", "Brand Storytelling"],
        established: "2023"
    },
    {
        name: "DDNetwork",
        logo: "https://images.seeklogo.com/logo-png/46/1/chatgpt-logo-png_seeklogo-465219.png",
        tagline: "Cloud Infrastructure & DevOps Partner",
        category: "Infrastructure",
        website: "https://github.com",
        about: "DDNetwork provides specialized DevOps and cloud infrastructure support for AfterSolves projects requiring complex deployments. From CI/CD pipelines to multi-region scaling, they help us ensure production systems remain reliable under load.",
        services: ["DevOps", "CI/CD Pipelines", "Cloud Architecture", "Performance Tuning"],
        established: "2024"
    }
];

const partnersGrid = document.getElementById('partners-grid');
if (partnersGrid) {
    partners.forEach((partner, index) => {
        partnersGrid.innerHTML += `
            <button type="button" data-partner-index="${index}" class="partner-card group bg-white dark:bg-neutral-800 rounded-[1.5rem] md:rounded-[2rem] border border-yellow-200 dark:border-neutral-700 p-6 md:p-8 text-left hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col">
                <div class="flex items-center justify-between mb-4 md:mb-6">
                    <div class="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-yellow-50 dark:bg-neutral-900 border border-yellow-200 dark:border-neutral-700 flex items-center justify-center p-2">
                        <img src="${partner.logo}" alt="${partner.name}" class="w-full h-full object-cover">
                    </div>
                    <span class="text-xs md:text-sm font-normal text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full border border-orange-100 dark:border-orange-900/50">${partner.category}</span>
                </div>
                <h3 class="text-xl md:text-2xl font-normal tracking-tight text-neutral-800 dark:text-white mb-1">${partner.name}</h3>
                <p class="text-sm md:text-base text-neutral-500 dark:text-neutral-400 font-normal mb-4">${partner.tagline}</p>
                <div class="flex items-center gap-2 text-sm md:text-base text-orange-500 font-normal mt-auto group-hover:gap-3 transition-all">
                    <span>View Partner Details</span>
                    <i data-lucide="arrow-right" class="w-4 h-4" stroke-width="1.5"></i>
                </div>
            </button>
        `;
    });
    lucide.createIcons();
}

// Partner modal logic
const partnerModalOverlay = document.getElementById('partner-modal-overlay');
const partnerModal = document.getElementById('partner-modal');

function openPartnerModal(index) {
    const p = partners[index];
    if (!p) return;

    partnerModal.innerHTML = `
        <div class="relative">
            <button type="button" id="partner-modal-close" class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur border border-yellow-200 dark:border-neutral-700 flex items-center justify-center hover:bg-yellow-400 hover:text-neutral-900 transition-colors" aria-label="Close">
                <i data-lucide="x" class="w-5 h-5" stroke-width="1.5"></i>
            </button>
            <div class="h-32 md:h-48 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-t-[1.5rem] md:rounded-t-[2rem] flex items-center justify-center">
                <div class="w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-3xl overflow-hidden bg-white border-4 border-white shadow-xl flex items-center justify-center p-3">
                    <img src="${p.logo}" alt="${p.name}" class="w-full h-full object-cover">
                </div>
            </div>
        </div>
        <div class="p-6 md:p-10">
            <span class="text-xs md:text-sm font-normal text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full border border-orange-100 dark:border-orange-900/50">${p.category}</span>
            <h2 class="text-2xl md:text-4xl font-normal tracking-tight text-neutral-800 dark:text-white mt-4 mb-1">${p.name}</h2>
            <p class="text-sm md:text-lg text-neutral-500 dark:text-neutral-400 font-normal mb-6">${p.tagline}</p>

            <div class="mb-6">
                <h3 class="text-base md:text-lg font-medium text-neutral-800 dark:text-white mb-2 flex items-center gap-2">
                    <i data-lucide="info" class="w-4 h-4 text-orange-500" stroke-width="1.5"></i>
                    About ${p.name}
                </h3>
                <p class="text-sm md:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">${p.about}</p>
            </div>

            <div class="mb-6">
                <h3 class="text-base md:text-lg font-medium text-neutral-800 dark:text-white mb-3 flex items-center gap-2">
                    <i data-lucide="check-circle" class="w-4 h-4 text-orange-500" stroke-width="1.5"></i>
                    Services Provided
                </h3>
                <div class="flex flex-wrap gap-2">
                    ${p.services.map(s => `<span class="text-xs md:text-sm font-normal text-neutral-700 dark:text-neutral-300 bg-yellow-100 dark:bg-neutral-700 px-3 py-1.5 rounded-full">${s}</span>`).join('')}
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-8 pt-4 border-t border-yellow-100 dark:border-neutral-700">
                <div>
                    <p class="text-xs text-neutral-400 uppercase tracking-wider mb-1">Partner Since</p>
                    <p class="text-sm md:text-base font-medium text-neutral-800 dark:text-white">${p.established}</p>
                </div>
                <div>
                    <p class="text-xs text-neutral-400 uppercase tracking-wider mb-1">Category</p>
                    <p class="text-sm md:text-base font-medium text-neutral-800 dark:text-white">${p.category}</p>
                </div>
            </div>

            <a href="${p.website}" target="_blank" rel="noopener noreferrer" class="w-full inline-flex items-center justify-center gap-2 bg-neutral-800 dark:bg-yellow-400 text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-yellow-300 transition-colors rounded-full px-6 py-3 md:py-4 text-sm md:text-base font-normal shadow-md">
                <i data-lucide="external-link" class="w-4 h-4" stroke-width="1.5"></i>
                Visit ${p.name} Website
            </a>
        </div>
    `;

    partnerModalOverlay.classList.remove('hidden');
    document.body.classList.add('modal-open');
    lucide.createIcons();

    document.getElementById('partner-modal-close').addEventListener('click', closePartnerModal);
}

function closePartnerModal() {
    partnerModalOverlay.classList.add('hidden');
    document.body.classList.remove('modal-open');
}

// Delegate clicks for partner cards
document.addEventListener('click', (e) => {
    const card = e.target.closest('.partner-card');
    if (card) {
        const index = parseInt(card.getAttribute('data-partner-index'), 10);
        openPartnerModal(index);
    }
    if (e.target === partnerModalOverlay) {
        closePartnerModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && partnerModalOverlay && !partnerModalOverlay.classList.contains('hidden')) {
        closePartnerModal();
    }
});

// ========================================
// ===== PEOPLE AT AFTERSOLVES =====
// ========================================
const people = [
    {
        name: "Danial Danish",
        title: "Founder & Intelligence Architect",
        photo: "https://images.luviio.com/danialdanish-luviio-founder.JPEG",
        about: "Leads AfterSolves' technical vision, overseeing architecture decisions across SaaS platforms and AI systems. Danial works hands-on with the engineering team to translate complex business requirements into reliable, scalable software.",
        quote: "Engineering excellence isn't a feature — it's the baseline. Everything we ship has to earn its place in production.",
        focus: ["Architecture", "AI Systems", "Strategy"]
    },
    {
        name: "Nurul Nabila",
        title: "Co-Founder & Systems Architect",
        photo: "https://images.luviio.com/bella-aftersolves.JPEG",
        about: "Designs and maintains the backend systems that power our SaaS platforms. Bella owns the UI/UX discipline at AfterSolves, ensuring every interface is accessible, intuitive, and built on a coherent design system.",
        quote: "Good systems feel invisible. The user never thinks about the infrastructure — they just get their work done.",
        focus: ["Backend", "UI/UX", "Design Systems"]
    },
    {
        name: "Putri Erinna",
        title: "Head of Client Success",
        photo: "https://images.luviio.com/putri-web.jpeg",
        about: "Owns the client relationship lifecycle — from onboarding through delivery and beyond. Putri ensures communication is transparent, timelines are honest, and every project aligns with the client's business goals.",
        quote: "Transparency builds trust. We'd rather give an honest timeline than a comfortable promise.",
        focus: ["Client Success", "Operations", "Delivery"]
    }
];

const peopleGrid = document.getElementById('people-grid');
if (peopleGrid) {
    people.forEach(person => {
        peopleGrid.innerHTML += `
            <article class="bg-white dark:bg-neutral-800 rounded-[1.5rem] md:rounded-[2rem] border border-yellow-200 dark:border-neutral-700 overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                <div class="relative aspect-[4/5] overflow-hidden bg-yellow-100 dark:bg-neutral-900">
                    <img src="${person.photo}" alt="${person.name}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div class="absolute bottom-4 left-4 right-4">
                        <h3 class="text-xl md:text-2xl font-normal tracking-tight text-white drop-shadow-md">${person.name}</h3>
                        <p class="text-sm md:text-base text-yellow-300 font-normal mt-1">${person.title}</p>
                    </div>
                </div>
                <div class="p-6 md:p-8 flex flex-col flex-1">
                    <h4 class="text-xs md:text-sm font-medium text-orange-500 uppercase tracking-wider mb-3">About at AfterSolves</h4>
                    <p class="text-sm md:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed mb-5">${person.about}</p>
                    
                    <div class="flex flex-wrap gap-2 mb-5">
                        ${person.focus.map(f => `<span class="text-xs font-normal text-neutral-600 dark:text-neutral-400 bg-yellow-100 dark:bg-neutral-700 px-3 py-1 rounded-full">${f}</span>`).join('')}
                    </div>

                    <blockquote class="mt-auto border-l-2 border-orange-400 pl-4 py-1">
                        <p class="text-sm md:text-base text-neutral-700 dark:text-neutral-200 italic font-normal leading-relaxed">"${person.quote}"</p>
                    </blockquote>
                </div>
            </article>
        `;
    });
    lucide.createIcons();
}

// ========================================
// ===== CUSTOM CALENDAR =====
// ========================================
const calState = {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    selectedDate: null,
    minDate: null
};

function getTodayStr() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

function initCalendar() {
    calState.minDate = getTodayStr();
    calState.year = new Date().getFullYear();
    calState.month = new Date().getMonth();

    const trigger = document.getElementById('calendar-trigger');
    const overlay = document.getElementById('calendar-overlay');
    const panel = document.getElementById('calendar-panel');

    if (!trigger || !overlay) return;

    trigger.addEventListener('click', () => {
        overlay.classList.remove('hidden');
        renderCalendar();
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.add('hidden');
        }
    });
}

function renderCalendar() {
    const panel = document.getElementById('calendar-panel');
    if (!panel) return;

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const firstDay = new Date(calState.year, calState.month, 1);
    const lastDay = new Date(calState.year, calState.month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const today = new Date();
    const canGoPrev = new Date(calState.year, calState.month - 1, 1) >= new Date(today.getFullYear(), today.getMonth(), 1);

    let html = `
        <div class="flex items-center justify-between mb-4">
            <button type="button" id="cal-prev" class="p-2 rounded-lg hover:bg-yellow-100 dark:hover:bg-neutral-700 transition-colors ${!canGoPrev ? 'opacity-30 cursor-not-allowed' : ''}" ${!canGoPrev ? 'disabled' : ''}>
                <i data-lucide="chevron-left" class="w-5 h-5" stroke-width="1.5"></i>
            </button>
            <span class="text-sm md:text-base font-medium text-neutral-800 dark:text-white">${monthNames[calState.month]} ${calState.year}</span>
            <button type="button" id="cal-next" class="p-2 rounded-lg hover:bg-yellow-100 dark:hover:bg-neutral-700 transition-colors">
                <i data-lucide="chevron-right" class="w-5 h-5" stroke-width="1.5"></i>
            </button>
        </div>
        <div class="grid grid-cols-7 gap-1 mb-2">
    `;

    dayShort.forEach(d => {
        html += `<div class="text-xs text-neutral-400 dark:text-neutral-500 text-center font-medium pb-1">${d}</div>`;
    });
    html += `</div>`;

    html += `<div class="grid grid-cols-7 gap-1">`;

    for (let i = 0; i < startDayOfWeek; i++) {
        html += `<div></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${calState.year}-${String(calState.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isPast = dateStr < calState.minDate;
        const isSelected = dateStr === calState.selectedDate;
        const isToday = dateStr === calState.minDate;

        let classes = 'calendar-day text-sm w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg transition-all cursor-pointer ';

        if (isPast) {
            classes += 'text-neutral-300 dark:text-neutral-600 cursor-not-allowed';
        } else if (isSelected) {
            classes += 'bg-yellow-400 text-neutral-900 font-medium shadow-md';
        } else if (isToday) {
            classes += 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium ring-1 ring-orange-400';
        } else {
            classes += 'hover:bg-yellow-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300';
        }

        html += `<div class="${classes}" data-date="${isPast ? '' : dateStr}">${day}</div>`;
    }

    html += `</div>`;

    html += `
        <div class="mt-4 pt-3 border-t border-yellow-100 dark:border-neutral-700 flex items-center justify-between">
            <button type="button" id="cal-today" class="text-xs text-orange-500 hover:text-orange-600 font-medium py-1.5 px-3 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
                Jump to Today
            </button>
            <button type="button" id="cal-close" class="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 font-medium py-1.5 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                Close
            </button>
        </div>
    `;

    panel.innerHTML = html;
    lucide.createIcons();

    const prevBtn = document.getElementById('cal-prev');
    const nextBtn = document.getElementById('cal-next');
    const todayBtn = document.getElementById('cal-today');
    const closeBtn = document.getElementById('cal-close');
    const overlay = document.getElementById('calendar-overlay');

    if (prevBtn && !prevBtn.disabled) {
        prevBtn.addEventListener('click', () => {
            calState.month--;
            if (calState.month < 0) { calState.month = 11; calState.year--; }
            renderCalendar();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            calState.month++;
            if (calState.month > 11) { calState.month = 0; calState.year++; }
            renderCalendar();
        });
    }

    if (todayBtn) {
        todayBtn.addEventListener('click', () => {
            const t = new Date();
            calState.year = t.getFullYear();
            calState.month = t.getMonth();
            renderCalendar();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            overlay.classList.add('hidden');
        });
    }

    document.querySelectorAll('.calendar-day[data-date]').forEach(dayEl => {
        const date = dayEl.getAttribute('data-date');
        if (date) {
            dayEl.addEventListener('click', () => {
                calState.selectedDate = date;
                document.getElementById('call-date').value = date;

                const [y, m, d] = date.split('-').map(Number);
                const dateObj = new Date(y, m - 1, d);
                const displayStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
                document.getElementById('calendar-display').textContent = displayStr;
                document.getElementById('calendar-display').classList.remove('text-neutral-400');

                overlay.classList.add('hidden');
            });
        }
    });
}

initCalendar();

// ========================================
// ===== MULTI-STEP FORM LOGIC =====
// ========================================
const formSteps = document.querySelectorAll('.form-step');
const progressBar = document.getElementById('progress-bar');
const stepIndicator = document.getElementById('step-indicator');
const stepPercentage = document.getElementById('step-percentage');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const projectForm = document.getElementById('project-form');
const formSuccess = document.getElementById('form-success');
const progressContainer = document.getElementById('progress-container');

let currentStep = 1;
const totalSteps = 6;

function updateStep(newStep) {
    formSteps.forEach(step => step.classList.remove('active'));
    const targetStep = document.querySelector(`.form-step[data-step="${newStep}"]`);
    if (targetStep) targetStep.classList.add('active');
    
    currentStep = newStep;
    
    const percentage = Math.round((newStep / totalSteps) * 100);
    progressBar.style.width = percentage + '%';
    stepIndicator.textContent = `Step ${newStep} of ${totalSteps}`;
    stepPercentage.textContent = percentage + '%';
    
    prevBtn.disabled = (newStep === 1);
    
    if (newStep === totalSteps) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    }
    
    lucide.createIcons();
    targetStep.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function validateStep(step) {
    const stepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    let isValid = true;
    let errorMsg = '';

    if (step === 4) {
        const fullName = stepEl.querySelector('[name="fullName"]').value.trim();
        const email = stepEl.querySelector('[name="email"]').value.trim();
        const phone = stepEl.querySelector('[name="phone"]').value.trim();
        if (!fullName) { isValid = false; errorMsg = 'Please enter your full name.'; }
        else if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { isValid = false; errorMsg = 'Please enter a valid email address.'; }
        else if (!phone) { isValid = false; errorMsg = 'Please enter your phone number.'; }
    }

    if (step === 5) {
        const timezone = stepEl.querySelector('[name="timezone"]').value;
        const callDate = stepEl.querySelector('[name="callDate"]').value;
        const callTimeRadio = stepEl.querySelector('[name="callTime"]:checked');
        
        if (!timezone) { isValid = false; errorMsg = 'Please select a time zone.'; }
        else if (!callDate) { isValid = false; errorMsg = 'Please choose a date for your call.'; }
        else if (!callTimeRadio) { isValid = false; errorMsg = 'Please choose a time slot for your call.'; }
        else {
            const timeStr = callTimeRadio.value;
            const [time, period] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            
            const selectedDateTime = new Date(`${callDate}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`);
            const now = new Date();
            if (selectedDateTime < now) {
                isValid = false;
                errorMsg = 'The selected date and time is in the past. Please choose a future date and time.';
            }
        }
    }

    if (step === 6) {
        const hearAboutUs = stepEl.querySelector('[name="hearAboutUs"]:checked');
        if (!hearAboutUs) {
            isValid = false;
            errorMsg = 'Please tell us how you heard about us.';
        } else if (hearAboutUs.value === 'AI') {
            const aiSource = stepEl.querySelector('[name="aiSource"]:checked');
            if (!aiSource) {
                isValid = false;
                errorMsg = 'Please select which AI platform you used.';
            } else if (aiSource.value === 'Custom AI') {
                const customName = stepEl.querySelector('[name="customAIName"]').value.trim();
                if (!customName) {
                    isValid = false;
                    errorMsg = 'Please enter the custom AI name.';
                }
            }
        } else if (hearAboutUs.value === 'Other') {
            const customSource = stepEl.querySelector('[name="customOtherSource"]').value.trim();
            if (!customSource) {
                isValid = false;
                errorMsg = 'Please specify where you heard about us.';
            }
        }
    }

    if (!isValid && errorMsg) {
        showNotification(errorMsg, 'warning');
    }

    return isValid;
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                updateStep(currentStep + 1);
            }
        }
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            updateStep(currentStep - 1);
        }
    });
}

if (submitBtn) {
    submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            const formData = new FormData(projectForm);
            const data = Object.fromEntries(formData);
            
            const payload = {
                name: data.fullName,
                email: data.email,
                phone: data.phone,
                business: data.businessName || 'N/A',
                help: data.vision || 'N/A',
                meetingType: data.meetingMethod,
                timezone: data.timezone,
                date: data.callDate,
                time: data.callTime,
                source: data.hearAboutUs === 'AI' ? (data.aiSource === 'Custom AI' ? data.customAIName : data.aiSource) : (data.hearAboutUs === 'Other' ? data.customOtherSource : data.hearAboutUs)
            };

            try {
                const response = await fetch('https://emailsubs.aftersolves.workers.dev/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if (response.ok) {
                    projectForm.classList.add('hidden');
                    progressContainer.classList.add('hidden');
                    formSuccess.classList.remove('hidden');
                    lucide.createIcons();
                    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    showNotification('Project request submitted successfully!', 'success');
                } else {
                    throw new Error('Failed to submit form');
                }
            } catch (error) {
                showNotification('There was an error submitting your request. Please try again.', 'error');
                submitBtn.textContent = 'Submit Project Request ✓';
                submitBtn.disabled = false;
            }
        }
    });
}

// ========================================
// ===== CONDITIONAL LOGIC: How did you hear about us =====
// ========================================
const hearAboutUsRadios = document.querySelectorAll('input[name="hearAboutUs"]');
const aiSourceSection = document.getElementById('ai-source-section');
const otherSourceSection = document.getElementById('other-source-section');
const aiSourceRadios = document.querySelectorAll('input[name="aiSource"]');
const customAIInput = document.getElementById('custom-ai-input');

hearAboutUsRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        aiSourceSection.classList.add('hidden');
        otherSourceSection.classList.add('hidden');
        customAIInput.classList.add('hidden');
        
        aiSourceRadios.forEach(r => r.checked = false);
        
        if (radio.value === 'AI' && radio.checked) {
            aiSourceSection.classList.remove('hidden');
        } else if (radio.value === 'Other' && radio.checked) {
            otherSourceSection.classList.remove('hidden');
        }
    });
});

aiSourceRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        if (radio.value === 'Custom AI' && radio.checked) {
            customAIInput.classList.remove('hidden');
        } else {
            customAIInput.classList.add('hidden');
        }
    });
});

// ========================================
// ===== NEWSLETTER LOGIC (Uses same Worker as Project Form) =====
// ========================================
const newsletterSubmit = document.getElementById('newsletter-submit');
const newsletterEmail = document.getElementById('newsletter-email');
const newsletterFormContainer = document.getElementById('newsletter-form-container');
const newsletterSuccess = document.getElementById('newsletter-success');

if (newsletterSubmit) {
    newsletterSubmit.addEventListener('click', async () => {
        const email = newsletterEmail.value.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showNotification('Please enter a valid email address.', 'warning');
            return;
        }

        newsletterSubmit.textContent = 'Sending...';
        newsletterSubmit.disabled = true;

        try {
            // Send to the same Cloudflare Worker as "Start A Project"
            // Using newsletter: true flag so the worker knows how to handle it
            const response = await fetch('https://emailsubs.aftersolves.workers.dev/', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newsletter: true })
            });

            if (response.ok) {
                newsletterFormContainer.classList.add('hidden');
                newsletterSuccess.classList.remove('hidden');
                lucide.createIcons();
                showNotification('Successfully subscribed to the newsletter!', 'success');
            } else {
                throw new Error('Failed to subscribe');
            }
        } catch (error) {
            showNotification('There was an error subscribing to the newsletter. Please try again.', 'error');
            newsletterSubmit.textContent = 'Subscribe';
            newsletterSubmit.disabled = false;
        }
    });
}

// ========================================
// ===== SEO METADATA PER PAGE =====
// ========================================
const pageMeta = {
    '/': { 
        title: 'AfterSolves', 
        description: 'AfterSolves builds modern websites, SaaS products, and AI systems that scale. Partner with our senior engineering team focused on performance, automation, and precision.',
        type: 'website'
    },
    '/home': { 
        title: 'AfterSolves', 
        description: 'AfterSolves builds modern websites, SaaS products, and AI systems that scale. Partner with our senior engineering team focused on performance, automation, and precision.',
        type: 'website'
    },
    '/about': { 
        title: 'About Us - AfterSolves', 
        description: 'Learn about AfterSolves, our mission, and our team of senior engineers and designers building scalable software and AI systems.',
        type: 'website'
    },
    '/leaderships': { 
        title: 'People at AfterSolves - Our Team', 
        description: 'Meet the people behind AfterSolves. Senior engineers, designers, and strategists who care deeply about the craft of building modern software and AI systems.',
        type: 'website'
    },
    '/partnership': { 
        title: 'Our Partners - AfterSolves', 
        description: 'AfterSolves partners with trusted studios and specialists to deliver end-to-end solutions. Meet our partners including Kretworks, our logo and brand identity collaborator.',
        type: 'website'
    },
    '/careers': { 
        title: 'Careers - AfterSolves', 
        description: 'Join the AfterSolves team. We are looking for exceptional engineers, designers, and strategists who want to push the boundaries of AI and software development.',
        type: 'website'
    },
    '/contact': { 
        title: 'Contact Us - AfterSolves', 
        description: 'Get in touch with AfterSolves for project inquiries, support, or technical consultations. Email us at hello@aftersolves.com.',
        type: 'website'
    },
    '/services': { 
        title: 'Services - AfterSolves', 
        description: 'Explore AfterSolves services: SaaS development, AI systems integration, UI/UX design, and more. Built for scale and performance.',
        type: 'website'
    },
    '/saas-dev': { 
        title: 'SaaS Development - AfterSolves', 
        description: 'We architect and build Software as a Service (SaaS) platforms from the ground up using modern stacks like Next.js, Supabase, and Tailwind.',
        type: 'website'
    },
    '/ai-systems': { 
        title: 'AI Systems Integration - AfterSolves', 
        description: 'Custom AI integrations, RAG systems, workflow automation, and predictive analytics to give your business a competitive edge.',
        type: 'website'
    },
    '/ui-ux/design': { 
        title: 'UI/UX Design - AfterSolves', 
        description: 'Beautiful, accessible, and conversion-optimized interfaces backed by a comprehensive design system. Dark mode ready components.',
        type: 'website'
    },
    '/resources': { 
        title: 'Resources - AfterSolves', 
        description: 'Learn and grow with AfterSolves resources. Deep dives into engineering, design, and AI topics.',
        type: 'website'
    },
    '/case-studies': { 
        title: 'Case Studies - AfterSolves', 
        description: 'See how AfterSolves helped clients scale their platforms, automate support with AI, and achieve significant business growth.',
        type: 'website'
    },
    '/ai-tools': { 
        title: 'AI Tools & Stack - AfterSolves', 
        description: 'Explore the AI and infrastructure tools we use at AfterSolves to deliver results fast. ChatGPT, Supabase, Vercel, and more.',
        type: 'website'
    },
    '/project': { 
        title: 'Start a Project - AfterSolves', 
        description: 'Initiate your project with AfterSolves. Define your scope, budget, and timeline. Book a technical consultation today.',
        type: 'website'
    },
    '/legal': { 
        title: 'Legal & Policies - AfterSolves', 
        description: 'Review AfterSolves legal policies including Privacy Policy, Terms & Conditions, Refund Policy, and Payment Policy.',
        type: 'website'
    },
    '/privacy': { 
        title: 'Privacy Policy - AfterSolves', 
        description: 'AfterSolves Privacy Policy. Learn how we collect, use, store, disclose, and protect your personal information when you use our services.',
        type: 'article'
    },
    '/terms': { 
        title: 'Terms & Conditions - AfterSolves', 
        description: 'AfterSolves Terms & Conditions. Read the terms governing your use of our website and services including SaaS development and AI integration.',
        type: 'article'
    },
    '/refund': { 
        title: 'Refund Policy - AfterSolves', 
        description: 'AfterSolves Refund Policy. Learn about our refund eligibility, partial refunds, and non-refundable items for digital services.',
        type: 'article'
    },
    '/payment': { 
        title: 'Payment Policy - AfterSolves', 
        description: 'AfterSolves Payment & Installment Policy. Learn about our payment options, installment plans, late payment fees, and pricing transparency.',
        type: 'article'
    }
};

// ===== Update SEO Meta Tags Dynamically =====
function updateSEO(path) {
    const meta = pageMeta[path] || pageMeta['/'];
    const baseUrl = 'https://aftersolves.com';
    const fullUrl = baseUrl + path;

    document.title = meta.title;

    function updateMeta(attr, attrValue, content) {
        let tag = document.querySelector(`meta[${attr}="${attrValue}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute(attr, attrValue);
            document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
    }

    updateMeta('name', 'description', meta.description);
    
    // Ensure site name is always AfterSolves across all pages
    updateMeta('property', 'og:site_name', 'AfterSolves');
    
    updateMeta('property', 'og:title', meta.title);
    updateMeta('property', 'og:description', meta.description);
    updateMeta('property', 'og:url', fullUrl);
    updateMeta('property', 'og:type', meta.type);
    updateMeta('name', 'twitter:title', meta.title);
    updateMeta('name', 'twitter:description', meta.description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
    }
    canonical.href = fullUrl;
}

// ========================================
// ===== ROUTER LOGIC =====
// ========================================
const routes = {
    '/': 'home',
    '/home': 'home',
    '/about': 'about',
    '/leaderships': 'leaderships',
    '/partnership': 'partnership',
    '/careers': 'careers',
    '/contact': 'contact',
    '/services': 'services',
    '/saas-dev': 'saas-dev',
    '/ai-systems': 'ai-systems',
    '/ui-ux/design': 'ui-ux-design',
    '/resources': 'resources',
    '/case-studies': 'case-studies',
    '/ai-tools': 'ai-tools',
    '/project': 'project',
    '/legal': 'legal',
    '/privacy': 'privacy',
    '/terms': 'terms',
    '/refund': 'refund',
    '/payment': 'payment'
};

const renderPage = (path) => {
    const pageId = routes[path] || 'home';
    
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    updateSEO(path);
    lucide.createIcons();
    
    // Close mobile menu on navigation
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('flex');
    hamburgerIcon.classList.remove('active');
    
    // Close theme dropdown on navigation
    const themeDropdown = document.getElementById('theme-dropdown');
    if (themeDropdown) themeDropdown.classList.add('hidden');
    
    // Scroll to top
    window.scrollTo(0, 0);

    // Handle legal sub-pages anchor links
    if (path === '/privacy' || path === '/terms' || path === '/refund' || path === '/payment') {
        setTimeout(() => {
            if (window.location.hash) {
                const target = document.querySelector(window.location.hash);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }, 100);
    }
};

// Handle Link Clicks
document.body.addEventListener('click', (e) => {
    if (e.target.matches('[data-link]') || e.target.closest('[data-link]')) {
        e.preventDefault();
        const linkElement = e.target.closest('[data-link]');
        const path = linkElement.getAttribute('data-link');
        
        history.pushState({}, '', path);
        renderPage(path);
    }
});

// Handle in-page anchor links (for legal sub-pages)
document.body.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (anchor) {
        const activePage = document.querySelector('.page-content.active');
        if (activePage && (activePage.id === 'privacy' || activePage.id === 'terms' || activePage.id === 'refund' || activePage.id === 'payment' || activePage.id === 'legal')) {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
});

// Handle Browser Back/Forward
window.addEventListener('popstate', () => {
    renderPage(window.location.pathname);
});

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    renderPage(window.location.pathname);
    lucide.createIcons();
});
