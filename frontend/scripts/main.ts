import { setupNavbar } from "./views/nav.js";
import { loadLanguage } from "./views/nav.js";
import { HomeView } from "./views/home.js";
import { LoginView } from "./views/login.js";
import { PageNotFoundView } from "./views/PageNotFound.js";
import { ProfileView } from "./views/profile.js";
import { SearchView } from "./views/search.js";
import { SignupView } from "./views/signup.js";
import { TournamentView } from "./views/tournament.js";
import { SinglePlayer } from "./views/single_player.js";
import { Multiplayer } from "./views/multiplayer.js";

type Route = {
	path: string;
	view: any;
	protected?: boolean;
};

const routes: Route[] = [
	{ path: "/", view: HomeView },
	{ path: "/login", view: LoginView },
	{ path: "/signup", view: SignupView },
	{ path: "/profile", view: ProfileView, protected: true },
	{ path: "/search", view: SearchView, protected: true },
	{path: "/single_player", view: SinglePlayer},
	{path: "/multiplayer", view: Multiplayer},
	// {path: "/tournoi_setup", view: TournoirSetup},
	{path: "/tournament", view: TournamentView},

];

const isLoggedIn = (): boolean => {
	return localStorage.getItem("loggedIn") === "true";
};

export const navigateTo = (url: string) => {
	history.pushState(null, "", url);
	router();
};

const router = async () => {
	const potentialMatches = routes.map(route => ({
		route,
		isMatch: location.pathname === route.path,
	}));

	let match = potentialMatches.find(p => p.isMatch);

	if (!match) {
		const view = new PageNotFoundView();
		document.querySelector("body")!.innerHTML = await view.getHtml();
		setupNavbar();
		setupLogoutHandler();
		return;
	}

	if (match.route.protected && !isLoggedIn()) {
		navigateTo("/login");
		return;
	}

  // if (isLoggedIn() && ["/login", "/signup"].includes(match.route.path)) {
  //   localStorage.setItem("loggedIn", "false");
  // }

	const view = new match.route.view();
	document.querySelector("#mainContent")!.innerHTML = await view.getHtml();

	if (typeof view.onMounted === "function") {
		await view.onMounted();
	}

	setupNavbar();
	setupLogoutHandler();

  const lang = localStorage.getItem("language") || "en";
  loadLanguage(lang);
};

const setupLogoutHandler = () => {
	const logoutBtn = document.getElementById("logoutBtn");
	if (logoutBtn) {
		logoutBtn.addEventListener("click", (e) => {
			e.preventDefault();
			localStorage.setItem("loggedIn", "false");
			navigateTo("/login");
		});
	}
};

window.addEventListener("popstate", router);

(window as any).loadLanguage = loadLanguage;

document.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("loggedIn", "true");
  // localStorage.setItem("language", "default");
  const lang = localStorage.getItem("language") || "en";
  loadLanguage(lang);

	document.body.addEventListener("click", e => {

		const target = e.target as HTMLElement;
		const link = target.closest("[data-link]") as HTMLElement | null;
		if (link) {
			e.preventDefault();
			const path = link.getAttribute("href") || link.getAttribute("data-link");
			if (path) {
				navigateTo(path);
			}
		}
	});
	router();
});