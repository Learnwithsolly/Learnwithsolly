// Smooth Scrolling for Navigation Links
document.querySelectorAll("nav ul li a").forEach(anchor => {
    anchor.addEventListener("click", function(event) {
        event.preventDefault();
        const sectionId = this.getAttribute("href").substring(1);
        document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
    });
});

// Simple Pop-up for Contact Section
document.getElementById("contact").addEventListener("click", function() {
    alert("Thank you for reaching out! I'll get back to you soon.");
});
