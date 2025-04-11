export const openModal = (currentModal) => {
    console.log("currentModal:", currentModal);
    currentModal.show();
  };
  
  export const closeModal = (currentModal) => {
    currentModal.hide();
    // reloadPage(); // Reload the page to return to the home page
  };
  
  export const reloadPage = () => {
    location.reload(); // Reload the page to return to the home page
  };
  
  export const escapeModal = (categoriesDisplayArea) => {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        postForm.reset();
        if (categoriesDisplayArea) {
          categoriesDisplayArea.innerHTML = "";
        }
      }
    });
  };
  
  export const resetModal = (currentModal) => {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        postForm.reset();
        if (categoriesDisplayArea) {
          categoriesDisplayArea.innerHTML = "";
        }
      }
    });
  };