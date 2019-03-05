<template>
  <div class="hello">
    <div>
      <h1>Teams</h1>
      <md-field>
        <label>Search Teams</label>
        <md-input v-model="search" @change></md-input>
      </md-field>

      <br>
      <md-tabs v-if="authLevel==2" md-sync-route @change="onChange">
        <md-tab id="tab-cargo" md-label="Cargo" @click="onChange(0)"></md-tab>
        <md-tab id="tab-hatch" md-label="Hatch" @click="onChange(1)"></md-tab>
        <md-tab id="tab-custom" md-label="Custom" @click="onChange(2)"></md-tab>
      </md-tabs>
      <article v-for="(team, idx) in filteredTeams" :key="idx">
        <!-- <h4>Team: {{team.Name}} {{team.Number}}</h4>
        <button @click="openTeamPage(team.Number)">Team Page</button>-->
        <md-card>
          <md-card-header>
            <div class="md-title">{{team.Name}} {{team.Number}}</div>
          </md-card-header>

          <md-card-content>
            <TeamSummaryView
              v-if="authLevel==2"
              :team="team.Number"
              @update="saveSummary(team.Number,$event)"
            ></TeamSummaryView>
          </md-card-content>

          <md-card-actions>
            <md-button @click="openTeamPage(team.Number)">Team Page</md-button>
          </md-card-actions>
        </md-card>
      </article>
    </div>
  </div>
</template>

<script>
import TeamSummaryView from "./TeamSummaryView";
import { db } from "../main";
import axios from "axios";
export default {
  name: "hello",
  components: {
    TeamSummaryView
  },
  props: {
    mode: Number,
    submitter: String
  },
  data() {
    return {
      msg: "Welcome to Your Vue.js PWA",
      teams: [],
      filteredTeams: [],
      tba_teams: [],
      games: [],
      teamSummary: {},
      name: "",
      num: "",
      activeTab: 0,
      search: "",
      authLevel: 2
    };
  },
  computed: {
    sortFactor() {
      const sortings = { 0: "cargo", 1: "hatch", 2: "custom" };
      return sortings[this.activeTab];
    }
  },
  watch: {
    sortFactor: function(val) {
      this.teams = this.teams.sort(this.sortTeams);
    },
    search: function(val) {
      let filter = new RegExp(this.search, "i");
      this.filteredTeams = this.teams.filter(
        t => String(t.Number).match(filter) || t.Name.match(filter)
      );
    },
    teams:function(val){
      this.filteredTeams = this.teams
    }
  },
  mounted() {
    this.readTeams("cache");
  },
  methods: {
    sortedItems() {},
    sortTeams(t1, t2) {
      // console.log(this.teamSummary[t1.Number][this.sortFactor]);
      // console.log(this.teamSummary[t2.Number][this.sortFactor]);
      if (
        this.teamSummary[t1.Number][this.sortFactor] <
        this.teamSummary[t2.Number][this.sortFactor]
      ) {
        return 1;
      }
      if (
        this.teamSummary[t1.Number][this.sortFactor] >
        this.teamSummary[t2.Number][this.sortFactor]
      ) {
        return -1;
      }
      return 0;
    },
    readTeams(source) {
      console.log("Getting teams from " + source);
      let cache = true;
      db.collection("Teams")
        .get({ source: source })
        .then(snapshot => {
          console.log(snapshot.size);
          if (snapshot.size == 0) this.readTeams("server");
          snapshot.forEach(team => {
            // console.log(team.id, " => ", team.data());
            this.teams.push(team.data());
            if (!(team.data().Number in this.teamSummary))
              this.teamSummary[team.data().Number] = { cargo: -1, hatch: -1 };
          });
        });
    },
    openTeamPage(team) {
      console.log("Mode " + this.authLevel);
      if (this.authLevel == 0) {
        this.$router.replace({
          name: "Scouting Form",
          params: { team: String(team), submitter: this.submitter }
        });
      } else {
        this.$router.push({
          name: "Team",
          params: { team: String(team), authLevel: this.authLevel }
        });
      }
    },
    saveSummary(team, event) {
      this.teamSummary[team] = event;
      // console.log(this.teamSummary);
    },

    onChange(tabIndex) {
      console.log(tabIndex);
      this.activeTab = tabIndex;
    }
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


