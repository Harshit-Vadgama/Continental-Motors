/* =========================
   Menu Overlay Functions
   ========================= */
function openMenu() {
  const overlay = document.getElementById("menu-overlay");
  if (overlay) overlay.classList.add("active");
}

function closeMenu() {
  const overlay = document.getElementById("menu-overlay");
  if (overlay) overlay.classList.remove("active");
}

function toggleBrands() {
  const list = document.getElementById("brands-list");
  if (list) {
    list.style.display = list.style.display === "block" ? "none" : "block";
  }
}

function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
    closeMenu();
  }
}

function scrollToCollection() {
  const collectionSection = document.getElementById("collection-section") || document.querySelector(".collection");
  if (collectionSection) {
    collectionSection.scrollIntoView({ behavior: "smooth" });
    closeMenu();
  }
}

/* =========================
   Account & Authentication System
   ========================= */
function openAccount() {
  const modal = document.getElementById("account-modal");
  if (!modal) return;
  
  modal.style.display = "flex";
  updateModalFormState();
  closeMenu();
}

function closeAccount() {
  const modal = document.getElementById("account-modal");
  if (modal) modal.style.display = "none";
}

function switchAuthTab(tab) {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const tabLoginBtn = document.getElementById("tab-login-btn");
  const tabSignupBtn = document.getElementById("tab-signup-btn");

  if (tab === 'login') {
    loginForm.style.display = "block";
    signupForm.style.display = "none";
    tabLoginBtn.classList.add("active");
    tabSignupBtn.classList.remove("active");
  } else {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    tabSignupBtn.classList.add("active");
    tabLoginBtn.classList.remove("active");
  }
}

function toggleAdminKeyField() {
  const role = document.getElementById("signup-role").value;
  const keyField = document.getElementById("admin-key-field");
  if (keyField) {
    keyField.style.display = role === "admin" ? "block" : "none";
  }
}

function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim().toLowerCase();
  const pass = document.getElementById("signup-pass").value;
  const confirmPass = document.getElementById("signup-confirm-pass").value;
  const role = document.getElementById("signup-role").value;
  const adminKey = document.getElementById("admin-key-field").value;

  if (pass !== confirmPass) {
    alert("Passwords do not match!");
    return;
  }

  if (pass.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  if (role === "admin" && adminKey !== "admin123") {
    alert("Invalid Admin Access Passcode! (Default passcode: admin123)");
    return;
  }

  let users = JSON.parse(localStorage.getItem("cmUserAccounts") || "[]");
  if (users.some(u => u.email === email)) {
    alert("An account with this email already exists. Please log in.");
    switchAuthTab('login');
    return;
  }

  const newUser = { name, email, pass, role };
  users.push(newUser);
  localStorage.setItem("cmUserAccounts", JSON.stringify(users));

  // Set active user session
  localStorage.setItem("cmCurrentUser", JSON.stringify(newUser));

  alert(`Account successfully created! Welcome, ${name}.`);
  closeAccount();
  updateUserSessionUI();
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const pass = document.getElementById("login-pass").value;

  let users = JSON.parse(localStorage.getItem("cmUserAccounts") || "[]");
  const foundUser = users.find(u => u.email === email && u.pass === pass);

  if (!foundUser) {
    alert("Invalid email or password. Please try again.");
    return;
  }

  localStorage.setItem("cmCurrentUser", JSON.stringify(foundUser));
  alert(`Welcome back, ${foundUser.name}!`);
  closeAccount();
  updateUserSessionUI();
}

function handleLogout() {
  localStorage.removeItem("cmCurrentUser");
  alert("Logged out successfully.");
  updateUserSessionUI();
  closeAccount();
}

function updateModalFormState() {
  const currentUser = JSON.parse(localStorage.getItem("cmCurrentUser") || "null");
  const authTabs = document.querySelector(".auth-tabs");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const profileState = document.getElementById("profile-state");

  if (currentUser) {
    if (authTabs) authTabs.style.display = "none";
    if (loginForm) loginForm.style.display = "none";
    if (signupForm) signupForm.style.display = "none";
    if (profileState) {
      profileState.style.display = "block";
      document.getElementById("profile-greeting").textContent = `Welcome, ${currentUser.name}! (${currentUser.role.toUpperCase()})`;
      document.getElementById("profile-email-disp").textContent = currentUser.email;
    }
  } else {
    if (authTabs) authTabs.style.display = "flex";
    if (profileState) profileState.style.display = "none";
    switchAuthTab('login');
  }
}

function updateUserSessionUI() {
  const currentUser = JSON.parse(localStorage.getItem("cmCurrentUser") || "null");
  const navBtn = document.getElementById("account-nav-btn");
  const adminNavLink = document.getElementById("admin-nav-link");
  const menuAdminItem = document.getElementById("menu-admin-item");

  if (currentUser) {
    if (navBtn) navBtn.textContent = `👤 ${currentUser.name}`;
    if (currentUser.role === "admin") {
      if (adminNavLink) adminNavLink.style.display = "inline-block";
      if (menuAdminItem) menuAdminItem.style.display = "block";
    } else {
      if (adminNavLink) adminNavLink.style.display = "none";
      if (menuAdminItem) menuAdminItem.style.display = "none";
    }
  } else {
    if (navBtn) navBtn.textContent = "👤 Log In";
    if (adminNavLink) adminNavLink.style.display = "none";
    if (menuAdminItem) menuAdminItem.style.display = "none";
  }
}

/* =========================
   FAQ Accordion Toggle
   ========================= */
function toggleFaq(button) {
  const faqItem = button.parentElement;
  const isActive = faqItem.classList.contains("active");

  document.querySelectorAll(".faq-item").forEach((item) => {
    item.classList.remove("active");
  });

  if (!isActive) {
    faqItem.classList.add("active");
  }
}

/* =========================
   Featured Card Hover Effects
   ========================= */
document.querySelectorAll(".featured-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    const video = card.querySelector("video");
    if (video) {
      video.play().catch(() => {});
    }
  });

  card.addEventListener("mouseleave", () => {
    const video = card.querySelector("video");
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  });
});

/* =========================
   Expand / Collapse Card Details
   ========================= */
function toggleDetails(cardId) {
  const card = document.getElementById(cardId);
  if (!card) return;

  const details = card.querySelector(".car-details");
  const video = card.querySelector("video");
  const isExpanded = card.classList.contains("expanded");

  if (isExpanded) {
    card.classList.remove("expanded");
    if (details) details.style.display = "none";
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  } else {
    card.classList.add("expanded");
    if (details) details.style.display = "block";
    if (video) video.play().catch(() => {});
  }
}

function resetCard(cardId) {
  const card = document.getElementById(cardId);
  if (!card) return;

  card.classList.remove("expanded");
  const details = card.querySelector(".car-details");
  if (details) details.style.display = "none";
  const video = card.querySelector("video");
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
}

document.addEventListener("click", function (e) {
  const expandedCards = document.querySelectorAll(".car-card.expanded");
  expandedCards.forEach((card) => {
    if (!card.contains(e.target)) {
      card.classList.remove("expanded");
      const details = card.querySelector(".car-details");
      if (details) details.style.display = "none";
      const video = card.querySelector("video");
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    }
  });
});

/* =========================
   Reserve Button Flow & Admin Order Sync
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  updateUserSessionUI();

  const reserveButtons = document.querySelectorAll(".reserve-btn");

  reserveButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const carName = btn.dataset.car;
      const price = btn.dataset.price;

      const currentUser = JSON.parse(localStorage.getItem("cmCurrentUser") || "null");
      let defaultPromptVal = currentUser ? `${currentUser.name}, ${currentUser.email}` : "";

      const userInfo = prompt(
        "Enter your Name and Email (comma separated):\nExample: Mihir, mihir@gmail.com",
        defaultPromptVal
      );

      if (!userInfo) {
        alert("Reservation cancelled. Name and Email required.");
        return;
      }

      const parts = userInfo.split(",");
      const [userName, userEmail] = parts.map((s) => s.trim());
      if (!userName || !userEmail) {
        alert("Please enter both Name and Email correctly.");
        return;
      }

      const formattedPrice = Number(price).toLocaleString('en-IN');
      const confirmReserve = confirm(
        `Confirm reservation for ${carName} at ₹${formattedPrice}?\nName: ${userName}\nEmail: ${userEmail}`
      );
      if (!confirmReserve) {
        alert("Reservation cancelled.");
        return;
      }

      const reservationObj = {
        name: userName,
        email: userEmail,
        car: carName,
        price: formattedPrice,
        date: new Date().toLocaleString(),
        status: "Confirmed"
      };

      // Save for current active receipt
      localStorage.setItem("receiptData", JSON.stringify(reservationObj));

      // Append to allReservations array for Admin Dashboard tracking
      let allReservations = JSON.parse(localStorage.getItem("allReservations") || "[]");
      allReservations.unshift(reservationObj);
      localStorage.setItem("allReservations", JSON.stringify(allReservations));

      window.location.href = "receipt.html";
    });
  });

  // Attach dynamic fallbacks for missing images
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", function () {
      this.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200' viewBox='0 0 320 200'><rect width='100%' height='100%' fill='%23141414'/><text x='50%' y='50%' fill='%23C0C0C0' font-family='sans-serif' font-size='16' font-weight='bold' text-anchor='middle'>CONTINENTAL MOTORS</text></svg>";
    });
  });
});