const e = document.querySelector(".header-main-ham-menu-cont")
  , n = document.querySelector(".hamburger-menu")
  , s = document.querySelector(".header-main-ham-menu")
  , t = document.querySelector(".header-main-ham-menu-close")
  , a = document.querySelectorAll(".hamburger-menu-link");
e.addEventListener("click", ()=>{
    n.classList.contains("hamburger-menu--active") ? n.classList.remove("hamburger-menu--active") : n.classList.add("hamburger-menu--active"),
    s.classList.contains("d-none") ? (s.classList.remove("d-none"),
    t.classList.add("d-none")) : (s.classList.add("d-none"),
    t.classList.remove("d-none"))
}
);
for (let e = 0; e < a.length; e++)
    a[e].addEventListener("click", ()=>{
        n.classList.remove("hamburger-menu--active"),
        s.classList.remove("d-none"),
        t.classList.add("d-none")
    }
    );
const c = document.querySelector(".header-logo-container");
c.addEventListener("click", ()=>{
    location.href = "index.html"
}
);

;
/* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  var navbar = document.getElementsByClassName("navbar")[0];
  if (prevScrollpos > currentScrollPos) {
    navbar.style.top = "0";
  } else {
    navbar.style.top = "-90px";
  }
  prevScrollpos = currentScrollPos;
};