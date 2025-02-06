document.addEventListener("DOMContentLoaded", () => {
    // Navigation
    const burger = document.querySelector(".burger")
    const nav = document.querySelector(".nav-links")
    const navLinks = document.querySelectorAll(".nav-links li")
    const signInBtn = document.querySelector(".sign-in")
    const registerBtn = document.querySelector(".register")
    // Modal elements
    const modal = document.getElementById("auth-modal")
    const closeBtn = document.querySelector(".close")
    const modalTitle = document.getElementById("modal-title")
    const authForm = document.getElementById("auth-form")
    const authSubmit = document.getElementById("auth-submit")
    const authSwitch = document.getElementById("auth-switch")
    const confirmPasswordGroup = document.getElementById("confirm-password-group")
    const confirmPasswordInput = document.getElementById("confirm-password")
    const rememberMeGroup = document.getElementById("remember-me")
  
    // Toggle navigation
    burger.addEventListener("click", () => {
      nav.classList.toggle("active")
  
      // Animate links
      navLinks.forEach((link, index) => {
        if (link.style.animation) {
          link.style.animation = ""
        } else {
          link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`
        }
      })
  
      // Burger animation
      burger.classList.toggle("toggle")
    })
  
    // Modal functions
    function showModal(title) {
      modalTitle.textContent = title
      authSubmit.textContent = title
      if (title === "Register") {
        confirmPasswordGroup.style.display = "block"
        confirmPasswordInput.required = true
        rememberMeGroup.style.display = "none"
        authSwitch.innerHTML = 'Already have an account? <a href="#">Sign In</a>'
      } else {
        confirmPasswordGroup.style.display = "none"
        confirmPasswordInput.required = false
        rememberMeGroup.style.display = "flex"
        authSwitch.innerHTML = 'Don\'t have an account? <a href="#">Register</a>'
      }
      modal.style.display = "block"
      document.body.style.overflow = "hidden"
    }
  
    function hideModal() {
      modal.style.display = "none"
      document.body.style.overflow = "auto"
      authForm.reset()
    }
  
    // Modal event listeners
    signInBtn?.addEventListener("click", () => showModal("Sign In"))
    registerBtn?.addEventListener("click", () => showModal("Register"))
    closeBtn.addEventListener("click", hideModal)
  
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        hideModal()
      }
    })
  
    // Switch between Sign In and Register
    authSwitch.addEventListener("click", (e) => {
      e.preventDefault()
      const isSignIn = modalTitle.textContent === "Sign In"
      showModal(isSignIn ? "Register" : "Sign In")
    })
  
    // Handle form submission
    authForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const email = authForm.email.value
      const password = authForm.password.value
  
      if (modalTitle.textContent === "Register") {
        const confirmPassword = authForm.confirmPassword.value
        if (password !== confirmPassword) {
          alert("Passwords don't match!")
          return
        }
      }
  
      // Here you would typically send the data to your server
      console.log(`${modalTitle.textContent}:`, { email, password })
      alert(`${modalTitle.textContent} successful!`)
      hideModal()
    })
  
    // Social authentication
    const socialButtons = document.querySelectorAll(".social-btn")
    socialButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault()
        const provider = button.classList.contains("facebook") ? "Facebook" : "Google"
        // Here you would typically initiate the social authentication process
        console.log(`Authenticating with ${provider}`)
        alert(`${provider} authentication initiated!`)
      })
    })
  
    // Testimonials Slider
    const track = document.querySelector(".testimonial-track")
    const slides = document.querySelectorAll(".testimonial-slide")
    const prevButton = document.querySelector(".nav-button.prev")
    const nextButton = document.querySelector(".nav-button.next")
    const dotsContainer = document.querySelector(".testimonial-dots")
  
    let currentIndex = 0
    let startPos = 0
    let currentTranslate = 0
    const prevTranslate = 0
    let isDragging = false
    let animationID = 0
  
    // Create dots
    slides.forEach((_, index) => {
      const dot = document.createElement("div")
      dot.classList.add("dot")
      if (index === 0) dot.classList.add("active")
      dot.addEventListener("click", () => goToSlide(index))
      dotsContainer.appendChild(dot)
    })
  
    function updateSlider() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`
      document.querySelectorAll(".dot").forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex)
      })
    }
  
    function goToSlide(index) {
      currentIndex = index
      updateSlider()
    }
  
    function nextSlide() {
      currentIndex = (currentIndex + 1) % slides.length
      updateSlider()
    }
  
    function prevSlide() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length
      updateSlider()
    }
  
    // Event Listeners
    prevButton?.addEventListener("click", prevSlide)
    nextButton?.addEventListener("click", nextSlide)
  
    // Touch events
    track.addEventListener("touchstart", touchStart)
    track.addEventListener("touchmove", touchMove)
    track.addEventListener("touchend", touchEnd)
  
    // Mouse events
    track.addEventListener("mousedown", touchStart)
    track.addEventListener("mousemove", touchMove)
    track.addEventListener("mouseup", touchEnd)
    track.addEventListener("mouseleave", touchEnd)
  
    function touchStart(event) {
      startPos = getPositionX(event)
      isDragging = true
      animationID = requestAnimationFrame(animation)
    }
  
    function touchMove(event) {
      if (isDragging) {
        const currentPosition = getPositionX(event)
        currentTranslate = prevTranslate + currentPosition - startPos
      }
    }
  
    function touchEnd() {
      isDragging = false
      cancelAnimationFrame(animationID)
  
      const movedBy = currentTranslate - prevTranslate
  
      if (movedBy < -100 && currentIndex < slides.length - 1) {
        currentIndex++
      }
  
      if (movedBy > 100 && currentIndex > 0) {
        currentIndex--
      }
  
      updateSlider()
    }
  
    function animation() {
      setSliderPosition()
      if (isDragging) requestAnimationFrame(animation)
    }
  
    function setSliderPosition() {
      track.style.transform = `translateX(${currentTranslate}px)`
    }
  
    function getPositionX(event) {
      return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX
    }
  
    // Auto-play functionality
    let autoplayInterval = setInterval(nextSlide, 5000)
  
    track.addEventListener("mouseenter", () => {
      clearInterval(autoplayInterval)
    })
  
    track.addEventListener("mouseleave", () => {
      autoplayInterval = setInterval(nextSlide, 5000)
    })
  
    // Initialize slider
    updateSlider()
  
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
        document.querySelector(this.getAttribute("href")).scrollIntoView({
          behavior: "smooth",
        })
      })
    })
  
    // Contact form submission
    const contactForm = document.getElementById("contact-form")
    contactForm?.addEventListener("submit", (e) => {
      e.preventDefault()
      // Here you would typically send the form data to your server
      alert("Message sent successfully!")
      contactForm.reset()
    })
  
    // Newsletter form submission
    const newsletterForm = document.getElementById("newsletter-form")
    newsletterForm?.addEventListener("submit", (e) => {
      e.preventDefault()
      // Here you would typically send the email to your server
      alert("Thank you for subscribing to our newsletter!")
      newsletterForm.reset()
    })
  })
  
  