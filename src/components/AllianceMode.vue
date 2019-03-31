<template>
  <div>
    <md-toolbar :class="{'md-large':true, 'md-primary':color=='blue', 'md-accent':color=='red'}">
      <div class="md-toolbar-row">
        <div class="md-toolbar-section-start">
          <md-button @click="$router.go(-1)"><md-icon>arrow_back</md-icon></md-button>
        </div>
      </div>
      <div v-if="getTBA" class="md-toolbar-row md-toolbar-offset">
        <h3 class="md-title">Match {{match}}</h3>

        <h3 class="md-title">{{color.charAt(0).toUpperCase() + color.slice(1)}} Alliance</h3>
      </div>
    </md-toolbar>
    <div>
      <article v-for="(team, idx) in teams" :key="team.Number">
        <!-- <h4>Team: {{team.Name}} {{team.Number}}</h4>
        <button @click="openTeamPage(team.Number)">Team Page</button>-->
        <md-card>
          <md-card-header>
            <div class="md-title">{{team.Number}}</div>
          </md-card-header>

          <md-card-content>
            <TeamSummaryView :team="team.Number"></TeamSummaryView>
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
import axios from "axios";
axios.defaults.headers.common["X-TBA-Auth-Key"] =
  "xrH5bG5gww328ElniDbfigLhvcU73Vtdb0Qlh8o4WW4ztnWCbOMYW7Z29pPMh2Ch";

export default {
  name: "AllianceMode",
  components: {
    TeamSummaryView
  },
  params:['tba'],
  data() {
    return {
      match: 0,
      color: "blue",
      event: "2019iscmp", 
      teams: [],
      getTBA:true
    };
  },
  mounted() {
    console.log((localStorage.getAlliance))
    this.getTBA = localStorage.getAlliance == "tba"? true:false
    console.log(this.getTBA)
    if (this.getTBA) {
      if (localStorage.allianceMatchNumber)
        this.match = localStorage.allianceMatchNumber;
      if (localStorage.allianceColor) this.color = localStorage.allianceColor;
      console.log(this.match);
      console.log(this.color);
      axios
        .get(
          "https://www.thebluealliance.com/api/v3/match/" +
            this.event +
            "_qm" +
            String(this.match) +
            "/simple"
        )
        .then(response => {
          console.log(response);
          // console.log(response.data.alliances.blue.team_keys)
          let teamKeys = [];
          teamKeys = response.data.alliances[this.color].team_keys.map(k =>
            Number(k.substring(3, k.length))
          );
          teamKeys.forEach(key => {
            this.teams.push({ Number: key });
          });
          console.log(this.teams);
        })
        .catch(response => {
          console.log(response);
        });
    }else{
        const teams = ["1","2","3"]
        teams.forEach(k=>{
            if(localStorage["allianceTeam"+k]) this.teams.push({Number:Number(localStorage["allianceTeam"+k])})
        })
    }
  },
  methods: {
    openTeamPage(team) {
      this.$router.push({
        name: "Team",
        params: { team: String(team), authLevel: 2 }
      });
    }
  }
};
</script>
