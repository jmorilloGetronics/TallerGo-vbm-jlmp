(() => {
	const pageMeta = [
		{ match: /^\/$/, icon: "bi-house-door-fill" },
		{ match: /\/mechanics/, icon: "bi-wrench-adjustable-circle" },
		{ match: /\/workshops/, icon: "bi-buildings" },
		{ match: /\/brands/, icon: "bi-badge-ad" },
		{ match: /\/vehicles/, icon: "bi-car-front-fill" },
		{ match: /\/users/, icon: "bi-people-fill" },
		{ match: /\/profile/, icon: "bi-person-circle" },
		{ match: /\/login/, icon: "bi-box-arrow-in-right" },
		{ match: /\/auth/, icon: "bi-key-fill" }
	];

	document.addEventListener("DOMContentLoaded", () => {
		setActiveNavigation();
		syncNavbarOnScroll();
		decorateTitles();
		enhanceListCards();
		enhancePasswordFields();
		animateCounters();
		revealBlocks();
		syncFooterYear();
		liftAlertsToToasts();
	});

	function setActiveNavigation() {
		const currentPath = window.location.pathname || "/";

		document.querySelectorAll(".navbar .nav-link[href]").forEach((link) => {
			const url = new URL(link.href, window.location.origin);
			const linkPath = url.pathname;
			const isHome = linkPath === "/" && currentPath === "/";
			const isSection = linkPath !== "/" && currentPath.startsWith(linkPath);

			link.classList.toggle("active", isHome || isSection);
		});
	}

	function syncNavbarOnScroll() {
		const navbar = document.querySelector(".navbar");
		if (!navbar) {
			return;
		}

		const applyState = () => {
			navbar.classList.toggle("navbar-scrolled", window.scrollY > 12);
		};

		applyState();
		window.addEventListener("scroll", applyState, { passive: true });
	}

	function decorateTitles() {
		const currentPath = window.location.pathname || "/";
		const meta = pageMeta.find((entry) => entry.match.test(currentPath));
		if (!meta) {
			return;
		}

		document.querySelectorAll(".form-card > h1, .list-card > h1").forEach((title) => {
			if (title.dataset.decorated === "true") {
				return;
			}

			const icon = document.createElement("i");
			icon.className = `bi ${meta.icon}`;
			icon.setAttribute("aria-hidden", "true");
			icon.style.marginRight = "0.55rem";
			icon.style.color = "#ef4444";
			title.prepend(icon);
			title.dataset.decorated = "true";
		});
	}

	function enhanceListCards() {
		document.querySelectorAll(".list-card").forEach((card) => {
			const table = card.querySelector("table");
			if (!table) {
				return;
			}

			wrapTable(table);
			decorateActionButtons(table);
			buildToolbar(card, table);
		});

		document.querySelectorAll(".form-card table").forEach((table) => {
			wrapTable(table);
			decorateActionButtons(table);
		});
	}

	function wrapTable(table) {
		if (table.parentElement && table.parentElement.classList.contains("table-responsive")) {
			return;
		}

		const wrapper = document.createElement("div");
		wrapper.className = "table-responsive";
		table.parentNode.insertBefore(wrapper, table);
		wrapper.appendChild(table);
	}

	function buildToolbar(card, table) {
		if (card.querySelector(":scope > .list-toolbar")) {
			return;
		}

		const directChildren = Array.from(card.children);
		const title = directChildren.find((child) => child.tagName === "H1");
		const primaryAction = directChildren.find((child) => child.matches("a.btn, button.btn"));
		const toolbar = document.createElement("div");
		const main = document.createElement("div");
		const actions = document.createElement("div");

		toolbar.className = "list-toolbar";
		main.className = "list-toolbar-main";
		actions.className = "list-toolbar-actions";

		if (title) {
			main.appendChild(title);
		}

		if (primaryAction && primaryAction.closest("table") === null) {
			primaryAction.classList.add("btn-add");
			prependIcon(primaryAction, "bi-plus-lg");
			actions.appendChild(primaryAction);
		}

		const search = document.createElement("label");
		search.className = "toolbar-search";
		search.innerHTML = '<i class="bi bi-search"></i><input type="search" placeholder="Filtrar registros">';
		const input = search.querySelector("input");
		const emptyState = ensureEmptyState(table);

		input.addEventListener("input", () => filterTable(table, input.value, emptyState));
		actions.appendChild(search);

		toolbar.appendChild(main);
		toolbar.appendChild(actions);
		card.insertBefore(toolbar, card.firstElementChild);
	}

	function ensureEmptyState(table) {
		const wrapper = table.parentElement;
		let emptyState = wrapper.nextElementSibling;

		if (!emptyState || !emptyState.classList.contains("table-empty")) {
			emptyState = document.createElement("div");
			emptyState.className = "table-empty";
			emptyState.textContent = "No hay resultados para el filtro aplicado.";
			wrapper.insertAdjacentElement("afterend", emptyState);
		}

		return emptyState;
	}

	function filterTable(table, value, emptyState) {
		const query = value.trim().toLowerCase();
		let visibleRows = 0;

		table.querySelectorAll("tbody tr").forEach((row) => {
			const content = row.textContent.toLowerCase();
			const matches = content.includes(query);
			row.classList.toggle("is-filtered-out", !matches);
			if (matches) {
				visibleRows += 1;
			}
		});

		emptyState.classList.toggle("is-visible", visibleRows === 0);
	}

	function decorateActionButtons(table) {
		table.querySelectorAll("a.btn-sm, button.btn-sm").forEach((button) => {
			const text = button.textContent.trim().toLowerCase();

			if (button.dataset.enhanced === "true") {
				return;
			}

			button.classList.add("action-chip");

			if (button.classList.contains("btn-danger") || text.includes("borrar") || text.includes("eliminar") || text.includes("despedir")) {
				button.classList.add("is-danger");
				prependIcon(button, "bi-trash3");
			} else if (button.classList.contains("btn-primary") || text.includes("editar")) {
				button.classList.add("is-edit");
				prependIcon(button, "bi-pencil-square");
			} else {
				button.classList.add("is-view");
				prependIcon(button, "bi-eye");
			}

			button.dataset.enhanced = "true";
		});
	}

	function prependIcon(button, iconClass) {
		if (button.querySelector("i.bi")) {
			return;
		}

		const icon = document.createElement("i");
		icon.className = `bi ${iconClass}`;
		icon.setAttribute("aria-hidden", "true");
		button.prepend(icon);
	}

	function enhancePasswordFields() {
		document.querySelectorAll('input[type="password"]').forEach((input) => {
			if (input.closest(".password-field")) {
				return;
			}

			const wrapper = document.createElement("div");
			wrapper.className = "password-field";
			input.parentNode.insertBefore(wrapper, input);
			wrapper.appendChild(input);

			const toggle = document.createElement("button");
			toggle.type = "button";
			toggle.className = "password-toggle";
			toggle.setAttribute("aria-label", "Mostrar u ocultar contrasena");
			toggle.innerHTML = '<i class="bi bi-eye"></i>';
			toggle.addEventListener("click", () => {
				const isPassword = input.type === "password";
				input.type = isPassword ? "text" : "password";
				toggle.innerHTML = isPassword ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
			});

			wrapper.appendChild(toggle);
		});
	}

	function animateCounters() {
		const counters = document.querySelectorAll("[data-count]");
		if (!counters.length) {
			return;
		}

		const start = (element) => {
			const target = Number(element.dataset.count || 0);
			const duration = 1100;
			const startTime = performance.now();

			const tick = (time) => {
				const progress = Math.min((time - startTime) / duration, 1);
				const eased = 1 - Math.pow(1 - progress, 3);
				element.textContent = new Intl.NumberFormat("es-ES").format(Math.round(target * eased));

				if (progress < 1) {
					requestAnimationFrame(tick);
				}
			};

			requestAnimationFrame(tick);
		};

		const observer = new IntersectionObserver((entries, currentObserver) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) {
					return;
				}

				start(entry.target);
				currentObserver.unobserve(entry.target);
			});
		}, { threshold: 0.45 });

		counters.forEach((counter) => observer.observe(counter));
	}

	function revealBlocks() {
		const blocks = document.querySelectorAll(".hero-panel, .feature-card, .metric-card, .form-card, .list-card, .login-card, .error-shell");
		if (!blocks.length) {
			return;
		}

		blocks.forEach((block, index) => {
			block.classList.add("reveal");
			block.style.transition = `opacity 420ms ease ${Math.min(index * 40, 180)}ms, transform 420ms ease ${Math.min(index * 40, 180)}ms`;
		});

		const observer = new IntersectionObserver((entries, currentObserver) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) {
					return;
				}

				entry.target.classList.add("is-visible");
				currentObserver.unobserve(entry.target);
			});
		}, { threshold: 0.12 });

		blocks.forEach((block) => observer.observe(block));
	}

	function syncFooterYear() {
		document.querySelectorAll("[data-year]").forEach((node) => {
			node.textContent = new Date().getFullYear();
		});
	}

	function liftAlertsToToasts() {
		const alerts = document.querySelectorAll(".alert");
		const container = document.getElementById("toast-container");

		if (!alerts.length || !container) {
			return;
		}

		alerts.forEach((alert, index) => {
			const message = alert.textContent.replace(/\s+/g, " ").trim();
			if (!message || alert.dataset.toastLifted === "true") {
				return;
			}

			const type = alert.classList.contains("alert-danger")
				? "error"
				: alert.classList.contains("alert-success")
					? "success"
					: "info";

			window.setTimeout(() => pushToast(container, message, type), 140 * index);
			alert.dataset.toastLifted = "true";
		});
	}

	function pushToast(container, message, type) {
		const toast = document.createElement("div");
		const icon = type === "success"
			? "bi-check2-circle"
			: type === "error"
				? "bi-exclamation-octagon"
				: "bi-info-circle";

		toast.className = `tg-toast is-${type}`;
		toast.innerHTML = `<i class="bi ${icon}"></i><span>${message}</span>`;
		container.appendChild(toast);

		window.setTimeout(() => {
			toast.classList.add("is-leaving");
			window.setTimeout(() => toast.remove(), 240);
		}, 4200);
	}
})();
