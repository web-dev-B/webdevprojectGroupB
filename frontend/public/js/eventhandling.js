import {
    closeModal,
    reloadPage,
    escapeModal,
  } from "./modalInteraction.js";
  import { renderingAvatar } from "./renderingUser.js";
  
  export const registration = (backendUrl) => {
    //gets the submit button inside the signup form modal
    const registrationForm = document.getElementById("registrationForm");
  
    //add event listener to the submit button
    registrationForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const username = document.getElementById("registeredUsername").value;
      const email = document.getElementById("registeredEmail").value;
      const password = document.getElementById("registeredPassword").value;
      const registerData = { username, email, password };
      try {
        const response = await fetch(`${backendUrl}/user/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registerData),
        });
        if (response.ok) {
          alert("Registration successful!");
          registrationForm.reset();
          const registerModal = bootstrap.Modal.getInstance(
            document.getElementById("registerModal")
          );
  
          closeModal(registerModal);
        } else {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }
      } catch (err) {
        if (err.message) {
          alert(err.message);
        } else {
          alert("Registration failed. Please try again.");
        }
      }
    });
    const closeRegisterModalButton = document.getElementById(
      "closeRegisterModalButton"
    );
    closeRegisterModalButton.addEventListener("click", () => {
      registrationForm.reset();
    });
  };
  
  export const login = (backendUrl) => {
    //get the submit button inside the login form modal
    const loginForm = document.getElementById("loginForm");
  
    //event listener to the submit button
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;
      const loginData = { email, password };
      try {
        const response = await fetch(`${backendUrl}/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        });
  
        if (response.ok) {
          const responseData = await response.json();
          const token = responseData.token;
          const userData = await getUserInfo(token, backendUrl);
          localStorage.setItem("token", token);
          localStorage.setItem("userData", JSON.stringify(userData));
          console.log("login -> userData", userData);
          hideLoginButton(userData);
          alert("Login successful!");
          loginForm.reset();
          const loginModal = bootstrap.Modal.getInstance(
            document.getElementById("loginModal")
          );
          closeModal(loginModal);
          reloadPage();
        } else {
          hideLoginButton(null);
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }
      } catch (err) {
        if (err.message) {
          alert(err.message);
        } else {
          alert("Login failed. Please try again.");
        }
      }
    });
    const closeLoginModalButton = document.getElementById(
      "closeLoginModalButton"
    );
    closeLoginModalButton.addEventListener("click", () => {
      loginForm.reset();
    });
  };
  
  export const renderingCategory = (currentCategory) => {
    const categoriesDisplayArea = document.getElementById(
      "categoriesDisplayArea"
    );
    const categoryBadge = document.createElement("span");
    categoryBadge.classList = "categoryBadge badge bg-success me-1";
    categoryBadge.textContent = currentCategory;
    categoriesDisplayArea.appendChild(categoryBadge);
    categoryBadge.addEventListener("click", () => {
      categoryBadge.remove();
    });
  };
  
  export const addNewPost = (backendUrl) => {
    const postFormSubmit = document.getElementById("postFormSubmit");
  
    const categoryInput = document.getElementById("categoryInput");
  
    categoryInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const currentCategory = categoryInput.value;
        categoryInput.value = "";
        renderingCategory(currentCategory);
      }
    });
  
    postFormSubmit.addEventListener("click", async (event) => {
      event.preventDefault();
      const formData = new FormData();
      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;
      const categoriesForSubmit = document.querySelectorAll(".categoryBadge");
      const photos = document.getElementById("photos").files;
      //checks if the input element exists and files are attached
      if (photos) {
        for (let i = 0; i < photos.length; i++) {
          formData.append("photo", photos[i]);
        }
      }
  
      try {
        const token = localStorage.getItem("token");
        const userDataString = localStorage.getItem("userData");
        const userData = JSON.parse(userDataString);
        const account_id = userData.account_id;
  
        formData.append("account_id", account_id);
        formData.append("title", title);
        formData.append("description", description);
        categoriesForSubmit.forEach((category, index) => {
          formData.append(`category[${index}]`, category.textContent);
        });
        console.log("formData", formData);
        const response = await fetch(`${backendUrl}/posts/new`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData, 
        });
  
        if (response.ok) {
          alert("Post added successfully!");
          const postModal = bootstrap.Modal.getInstance(
            document.getElementById("postModal")
          );
          postForm.reset();
          // closeModal(postModal);
          reloadPage();
        } else {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }
      } catch (err) {
        if (err.message) {
          alert(err.message);
        } else {
          alert("Post failed. Please try again.");
        }
      }
    });
    const closePostModalButton = document.getElementById(
      "closeAddPostModalButton"
    );
    closePostModalButton.addEventListener("click", () => {
      postForm.reset();
      categoriesDisplayArea.innerHTML = "";
    });
    escapeModal(categoriesDisplayArea);
  };
  
  export const logout = () => {
    const logoutButton = document.getElementById("logoutButton");
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      hideLoginButton(null);
      jumpToHomePage();
    });
  };
  
  
  export const jumpToHomePage = () => {
    window.location.href = "index.html";
  };
  export const jumpToTrendingPage = () => {
    const carouselItem = document.querySelector("#trendingTitle");
    carouselItem.addEventListener("click", () => {
      window.location.href = "trending.html";
    });
  };
  
  export const jumpToFollowingPage = () => {
    const carouselItem = document.querySelector("#followingTitle");
    carouselItem.addEventListener("click", () => {
      window.location.href = "following.html";
    });
  };
  
  export const jumpToSearchResult = () => {
    const searchButton = document.getElementById("searchButton");
    const searchInput = document.querySelector("#searchInput");
    const performSearch = () => {
      const keyword = searchInput.value;
      window.location.href = `searchResult.html?keyword=${encodeURIComponent(
        keyword
      )}`;
      searchInput.value = "";
    };
  
    searchButton.addEventListener("click", performSearch);
    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        performSearch();
      }
    });
  };
  
  export const jumpToPostDetailPage = () => {
    const postItems = document.querySelectorAll(`[class*="postId:"]`);
    postItems.forEach((postItem) => {
      const cardBody = postItem.querySelector(".card-body");
      const cardHeader = postItem.querySelector(".card-header");
      cardHeader.addEventListener("click", () => {
        const postClassList = postItem.classList;
        const postId = postClassList[postClassList.length - 1].split(":")[1];
        window.location.href = `postDetail.html?postId=${encodeURIComponent(
          postId
        )}`;
      });
      cardBody.addEventListener("click", () => {
        const postClassList = postItem.classList;
        const postId = postClassList[postClassList.length - 1].split(":")[1];
        window.location.href = `postDetail.html?postId=${encodeURIComponent(
          postId
        )}`;
      });
    });
  };
  
  export const loginStatusIsValid = async (localToken, backendUrl) => {
    try {
      const response = await fetch(`${backendUrl}/user/verification`, {
        headers: { Authorization: `Bearer ${localToken}` },
      });
      if (response.ok) {
        const userDataString = localStorage.getItem("userData");
        const userData = JSON.parse(userDataString);
        console.log("userData", userData);
        hideLoginButton(userData);
        renderingAvatar(userData);
        console.log("Login session is valid");
        return true;
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        hideLoginButton(null);
        console.log("Login session is invalid");
        return false;
      }
    } catch (error) {
      console.error("Failed to verify user:", error);
    }
  };
  
  const getUserInfo = async (token, backendUrl) => {
    try {
      const response = await fetch(`${backendUrl}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        return response.json();
      } else {
        //error handling when fetching user data
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };
  
  const hideLoginButton = (userLoginSuccessfully) => {
    const loginButton = document.getElementById("loginButton");
    const logoutButton = document.getElementById("logoutButton");
  
    if (userLoginSuccessfully) {
      loginButton.classList.add("d-none");
      logoutButton.classList.remove("d-none");
    } else {
      loginButton.classList.remove("d-none");
      logoutButton.classList.add("d-none");
    }
  };
  
  export const hideFollowingCollection = (userLoginSuccessfully) => {
    const followingCollection = document.getElementById("followingCollection");
    if (userLoginSuccessfully) {
      followingCollection.classList.remove("d-none");
    } else {
      followingCollection.classList.add("d-none");
    }
  };
  

  