window.addEventListener("scroll", function() {
  const header = document.querySelector("header");

  if (window.scrollY > 0) {
    dix.classList.add("scrolled");
  } else {
    dix.classList.remove("scrolled");
  }
});

