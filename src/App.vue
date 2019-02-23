<template>
  <div id="app">
    <header>
      <span>Trigon Scouting Output App</span>
      <img src="./assets/logo.png" alt="Vue.js PWA" id="logo-image">
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  name: "app",
  data() {
    return;
    {
      user_name: "hi";
    }
  },
  mounted() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
        this.user_name = user.displayName;
        console.log(result);
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  }
};
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  text-align: center;
  margin-top: 40px;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #35495e;
  color: #ffffff;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: 0.02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}

#logo-image {
  height: 100px;
  width: 100px;
  position: absolute;
  top: 0px;
  right: 0px;
}
</style>
