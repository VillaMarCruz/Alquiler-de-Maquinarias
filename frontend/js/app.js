const dark = document.querySelector(".dark");
const night = document.querySelector(".night");
const light = document.querySelector(".light");
const sidebar = document.querySelector(".sidebar");
const activeListItem = document.querySelector(".list-item.active");

/**
 * Modo Dark
 */
dark.addEventListener("click", () => {
    sidebar.className = "sidebar";
    activeListItem.className = "list-item active";
});

/**
 * Modo Oscuro
 */
night.addEventListener("click", () => {
    sidebar.className = "sidebar night";
    activeListItem.className = "list-item night active";
});

/**
 * Modo Claro
 */
light.addEventListener("click", () => {
    sidebar.className = "sidebar light";
    activeListItem.className = "list-item light active";
});