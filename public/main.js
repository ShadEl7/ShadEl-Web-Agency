document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Clear previous status
      formStatus.textContent = "";
      formStatus.style.color = "";

      // Basic validation (HTML5 does most of it)
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();

      if (!name || !email || !message) {
        formStatus.textContent = "Please fill in all required fields.";
        formStatus.style.color = "red";
        return;
      }

      // Simple email pattern check
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        formStatus.textContent = "Please enter a valid email address.";
        formStatus.style.color = "red";
        return;
      }

      // Simulate form sending
      formStatus.style.color = "green";
      formStatus.textContent = "Sending message...";

      // Simulate server response delay
      setTimeout(() => {
        formStatus.textContent = "Thank you! Your message has been sent successfully.";
        contactForm.reset();
      }, 1500);
    });
  }
});
