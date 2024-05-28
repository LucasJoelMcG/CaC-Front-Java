"use strict";
const isLoggedIn = localStorage.getItem("isLoggedIn");

if (isLoggedIn==="true") {
  if (window.location.pathname==='/') {
    window.location.href = '/pages/home.html';
  }
} else {
  if (window.location.pathname!=='/') {
    window.location.href = '/';
  }
}


function login(event) {
  event.preventDefault()
  //Obtengo los elementos necesarios para trabajar
  const emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();
  const invalidLogin = document.getElementById("invalidLoginContainer");

  //Consulto por la existencia del email y pass
  if (email && password) {
    if (emailRegex.test(email) && password.length > 0) {
      //Inicio de sesión exitoso. Uso localstorage como persistencia de sesión.
      invalidLogin.hidden = true;
      localStorage.setItem("isLoggedIn", true);
      window.location.href = '/pages/home.html';
    } else {
      invalidLogin.hidden = false;
    }
  }
}