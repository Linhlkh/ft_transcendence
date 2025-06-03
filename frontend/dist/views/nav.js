var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function setupNavbar() {
    const nav = document.getElementById("mainNav");
    if (!nav)
        return;
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    nav.innerHTML = loggedIn
        ? `
        <a href="/" class="hover:underline" data-i18n="nav_home" data-link>Home</a>
        <a href="/search" class="hover:underline" data-i18n="nav_search" data-link>Search</a>
        <a href="/profile" class="hover:underline" data-i18n="nav_profile" data-link>Profile</a>
        <a href="#" id="logoutBtn" class="hover:underline" data-i18n="nav_signout">Sign out</a>
         ${languageDropdownHTML()}
      `
        : `
        <a href="/" class="hover:underline" data-i18n="nav_home" data-link>Home</a>
        <a href="/signup" class="hover:underline" data-link data-i18n="nav_signup">Sign-up</a>
        <a href="/login" class="hover:underline" data-i18n="nav_signin" data-link>Login</a>
         ${languageDropdownHTML()}
      `;
    attachLanguageButtonEvent();
}
function attachLanguageButtonEvent() {
    const btn = document.getElementById("langDropdownBtn");
    const menu = document.getElementById("langDropdownMenu");
    btn === null || btn === void 0 ? void 0 : btn.addEventListener("click", () => {
        menu === null || menu === void 0 ? void 0 : menu.classList.toggle("hidden");
    });
}
function languageDropdownHTML() {
    return `
    <div class="relative inline-block text-left">
      <button id="langDropdownBtn" class=" hover:underline text-md focus:outline-none">
        Language
      </button>
      <div id="langDropdownMenu" class="hidden absolute right-0 mt-2 w-32 bg-white text-black rounded shadow-lg z-50">
        <button onclick="loadLanguage('en')" class="block w-full text-left px-4 py-2 hover:bg-gray-200">English</button>
        <button onclick="loadLanguage('fr')" class="block w-full text-left px-4 py-2 hover:bg-gray-200">Français</button>
      </div>
    </div>`;
}
export function loadLanguage(lang) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`../langs/${lang}.json`);
            const translations = yield response.json();
            applyTranslations(translations);
            localStorage.setItem("language", lang);
        }
        catch (err) {
            console.error("Failed to load language:", err);
        }
    });
}
function applyTranslations(translations) {
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (key && translations[key]) {
            el.textContent = translations[key];
        }
    });
}
