document.querySelector(".header__burger--icon").addEventListener("click", function () {
  document.querySelector(".header__burger--icon").classList.toggle("active");
  document.querySelector(".header__nav").classList.toggle("active");
  document.querySelector("body").classList.toggle("lock");
});