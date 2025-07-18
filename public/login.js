import {getAuth, GoogleAuthProvider, signInWithPopup} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import {redirectFromLogin} from "./authcheck.js";
import app from './firebase.js';

const link = "https://reaperclone.onrender.com/";

async function fetchJSON(path) {
  const res = await fetch(link + path);
  return await res.json();
}

async function writeJSON(path, data) {
  const res = await fetch(link + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

document.addEventListener("DOMContentLoaded", async () => {
  const user = await redirectFromLogin();
  if(user){
    document.getElementById("register").style.display = "block";
  }

  document.getElementById("loginbutton").addEventListener("click", async () => {
    try{
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();
      const users = await fetchJSON("users/" + idToken);

      if(!users){
        document.getElementById("register").style.display = "block";
      }else{
        window.location.replace(link);
      }
    }catch(error){
      document.getElementById("error").innerHTML = error;
    }
  });

  document.getElementById("senduser").addEventListener("click", async () => {
    const username = document.getElementById("usernamebox").value;
    const isValid = /^[a-z0-9]+$/i.test(username);
    if(!isValid){
      document.getElementById("error").innerHTML = "Username must be alphanumeric.";
      return;
    }
    try{
      const idToken = await auth.currentUser.getIdToken();
      const result = await writeJSON("usercheck", {
        username: username,
        idToken: idToken
      });
      if(!(result.allowed == "Good!")){
        document.getElementById("error").innerHTML = result.message;
      }else{
        window.location.replace(link);
      }
    }catch(error){
      document.getElementById("error").innerHTML = error;
    }
  });
});
