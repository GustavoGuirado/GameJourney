document.addEventListener("DOMContentLoaded", () => {
  const btnStart = document.querySelector(".btn-start");
  const btnNext = document.querySelector(".btn-next");
  const navbarRight = document.querySelector(".nav-right");

  const LIBRARY_PAGE = "./pages/library.html";

  // Função para criar o botão "Minha Biblioteca"
  function createLibraryButton() {
    if (!document.querySelector(".btn-library") && navbarRight) {
      const libBtn = document.createElement("button");
      libBtn.textContent = "Minha Biblioteca";
      libBtn.className = "btn-library";
      libBtn.setAttribute("aria-label", "Acessar minha biblioteca");
      libBtn.addEventListener("click", () => {
        window.location.href = LIBRARY_PAGE;
      });
      navbarRight.appendChild(libBtn);
    }
  }

  // Recupera dados do usuário no localStorage
  const userData = JSON.parse(localStorage.getItem("userData")) || {};

  // Scroll suave para onboarding
  if (btnStart) {
    btnStart.addEventListener("click", () => {
      const onboarding = document.getElementById("onboarding");
      if (onboarding) onboarding.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Criação da biblioteca
  if (btnNext) {
    btnNext.addEventListener("click", () => {
      localStorage.setItem("userData", JSON.stringify({ ...userData, hasLibrary: true }));
      window.location.href = LIBRARY_PAGE;
    });
  }

  // Mostrar botão "Minha Biblioteca" apenas se biblioteca existir
  if (userData.hasLibrary) {
    createLibraryButton();
  }
});
