<template>
  <div class="hello">
    <!--  <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li>
        <a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a>
      </li>
      <li>
        <a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a>
      </li>
      <li>
        <a href="http://chat.vuejs.org/" target="_blank" rel="noopener">Vue Community Chat</a>
      </li>
      <li>
        <a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a>
      </li>
      <li>
        <a
          href="http://vuejs-templates.github.io/webpack/"
          target="_blank"
          rel="noopener"
        >Docs for This Template</a>
      </li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li>
        <a href="http://router.vuejs.org/" target="_blank" rel="noopener">vue-router</a>
      </li>
      <li>
        <a href="http://vuex.vuejs.org/" target="_blank" rel="noopener">vuex</a>
      </li>
      <li>
        <a href="http://vue-loader.vuejs.org/" target="_blank" rel="noopener">vue-loader</a>
      </li>
      <li>
        <a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a>
      </li>
    </ul>-->
    <div>
      <h1>Teams</h1>
      <br>
      <article v-for="(team, idx) in teams" :key="idx">
        <!-- <h4>Team: {{team.Name}} {{team.Number}}</h4>
        <button @click="openTeamPage(team.Number)">Team Page</button> -->
        <md-card>
          <md-card-header>
            <div class="md-title">{{team.Name}} {{team.Number}}</div>
          </md-card-header>

          <md-card-content></md-card-content>

          <md-card-actions>
            <md-button  @click="openTeamPage(team.Number)">Team Page</md-button>
          </md-card-actions>
        </md-card>
      </article>
    </div>
  </div>
</template>

<script>
import { db } from "../main";
import axios from "axios";
export default {
  name: "hello",
  data() {
    return {
      msg: "Welcome to Your Vue.js PWA",
      teams: [],
      tba_teams: [],
      games: [],
      name: "",
      num: ""
    };
  },
  mounted() {
    this.readTeams("cache");
  },
  methods: {
    readTeams(source) {
      console.log("Getting teams from " + source);
      let cache = true;
      db.collection("Teams")
        .get({ source: source })
        .then(snapshot => {
          console.log(snapshot.size);
          if (snapshot.size == 0) this.readTeams("server");
          snapshot.forEach(team => {
            console.log(team.id, " => ", team.data());
            this.teams.push(team.data());
          });
        });
    },
    openTeamPage(team) {
      this.$router.push({ name: "Team", params: { team: String(team) } });
    }
    // getTeamsFromTBA() {
    //   axios
    //     .get(
    //       "https://www.thebluealliance.com/api/v3/district/2019isr/teams/simple",
    //       {
    //         params: {
    //           "X-TBA-Auth-Key":
    //             "xrH5bG5gww328ElniDbfigLhvcU73Vtdb0Qlh8o4WW4ztnWCbOMYW7Z29pPMh2Ch"
    //         }
    //       }
    //     )
    //     .then(response => {
    //       console.log(response)
    //       this.tba_teams = response.data;
    //       this.tba_teams.forEach((team)=>{
    //         db.collection('Teams').doc(String(team.team_number)).set({
    //           'Name':team.nickname,
    //           'Number':team.team_number
    //         })
    //       })
    //     });
    // }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #35495e;
}
</style>
