<template>
  <div class="hello">
    <div>
      <md-toolbar class="md-large md-primary">
        <div class="md-toolbar-row">
          <div class="md-toolbar-section-end">
            <md-button @click="allianceModeDialog = true">Alliance Mode</md-button>
          </div>
        </div>

        <div class="md-toolbar-row md-toolbar-offset">
          <h3 class="md-title">Teams</h3>
        </div>
      </md-toolbar>
      <md-dialog :md-active.sync="allianceModeDialog">
        <md-dialog-title>Alliance Mode</md-dialog-title>
        <div align="right">
          <md-switch v-model="getTBAAlliance">TBA</md-switch>
        </div>

        <!-- TBA alliance mode -->
        <div v-if="getTBAAlliance">
          <md-field>
            <label>Match Number</label>
            <md-input v-model="allianceMatchNumber"></md-input>
          </md-field>
          <md-field>
            <label for="alliance_color">Alliance</label>
            <md-select v-model="allianceColor" name="alliance_color" id="alliance_color">
              <md-option value="blue">Blue</md-option>
              <md-option value="red">Red</md-option>
            </md-select>
          </md-field>
        </div>

        <div v-if="!getTBAAlliance">
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
              <div class="md-layout-item">
                <md-field>
                  <label>Team 1</label>
                  <md-input v-model="allianceTeam1" type="number" class="small-number"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item">
                <md-field>
                  <label>Team 2</label>
                  <md-input v-model="allianceTeam2" type="number" class="small-number"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item">
                <md-field>
                  <label>Team 3</label>
                  <md-input v-model="allianceTeam3" type="number" class="small-number"></md-input>
                </md-field>
              </div>
            </div>
          </div>
        </div>

        <md-dialog-actions>
          <md-button class="md-primary" @click="allianceModeDialog = false">Close</md-button>
          <md-button class="md-primary" @click="openAllianceModePage">Go</md-button>
        </md-dialog-actions>
      </md-dialog>
      <!-- <md-field>
        <label for="filter_teams">Filter Teams</label>
        <md-select v-model="event_team_filter" name="filter_teams" id="filter_teams">
          <md-option value="fight-club">Fight Club</md-option>
          <md-option value="godfather">Godfather</md-option>
        </md-select>
      </md-field>-->
      <md-field>
        <label>Search Teams</label>
        <md-input v-model="search" @change></md-input>
      </md-field>

      <br>
      <md-tabs v-if="authLevel==2" md-sync-route @change="onChange">
        <md-tab id="tab-cargo" md-label="Cargo" @click="onChange(0)"></md-tab>
        <md-tab id="tab-hatch" md-label="Hatch" @click="onChange(1)"></md-tab>
        <md-tab id="tab-climb" md-label="Climb" @click="onChange(3)"></md-tab>
        <md-tab id="tab-custom" md-label="Custom" @click="onChange(2)"></md-tab>
      </md-tabs>
      <div v-if="activeTab==2">
        <md-field>
          <label>Cargo Weight</label>
          <md-input v-model="cargoCustomWeight" size="5"></md-input>
        </md-field>
        <md-field>
          <label>Hatch Weight</label>
          <md-input v-model="hatchCustomWeight"></md-input>
        </md-field>
        <md-field>
          <label>Climb Weight</label>
          <md-input v-model="climbCustomWeight"></md-input>
        </md-field>
      </div>
      <!-- Team list -->
      <div :key="renderIdx">
        <article
          v-for="(team, idx) in filteredTeams"
          :key="team.Number"
          v-if="event_teams.includes(Number(team.Number))"
        >
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
              <div v-if="activeTab==2" :key="customUpdateIndex">
                <b>Custom:</b>
                {{customData(team.Number)}}
              </div>
            </md-card-content>

            <md-card-actions>
              <md-button @click="openTeamPage(team.Number)">Team Page</md-button>
            </md-card-actions>
          </md-card>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import TeamSummaryView from "./TeamSummaryView";
import { db } from "../main";
import axios from "axios";
axios.defaults.headers.common["X-TBA-Auth-Key"] =
  "xrH5bG5gww328ElniDbfigLhvcU73Vtdb0Qlh8o4WW4ztnWCbOMYW7Z29pPMh2Ch";

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
      event_teams: [],
      games: [],
      teamSummary: {},
      name: "",
      num: "",
      activeTab: -1,
      search: "",
      authLevel: 2,
      renderIdx: 0,

      cargoCustomWeight: 0.5,
      hatchCustomWeight: 0.5,
      climbCustomWeight: 0.2,
      customUpdateIndex: 0,

      allianceModeDialog: false,
      allianceMatchNumber: 0,
      allianceColor: "blue",
      getTBAAlliance: true,
      allianceTeam1: 0,
      allianceTeam2: 0,
      allianceTeam3: 0
    };
  },
  computed: {
    sortFactor() {
      const sortings = { 0: "cargo", 1: "hatch", 2: "custom", 3:"climb"};
      return sortings[this.activeTab];
    }
  },
  watch: {
    event_teams: function() {
      this.teams = this.teams.filter(t =>
        this.event_teams.includes(Number(t.Number))
      );
      this.renderIdx++;
    },
    cargoCustomWeight: {
      handler: function(val) {
        localStorage.cargoCustomWeight = val;
        this.computeCustom();
      }
    },
    hatchCustomWeight: {
      handler: function(val) {
        localStorage.hatchCustomWeight = val;
        this.computeCustom();
      }
    },
    climbCustomWeight: {
      handler: function(val) {
        localStorage.climbCustomWeight = val;
        this.computeCustom();
      }
    },
    activeTab: {
      immediate: true,
      handler: function(val) {
        if (this.activeTab == 2) this.computeCustom();
        console.log("Sorting by " + this.sortFactor);
        this.teams = this.teams.sort(this.sortTeams);
      }
    },
    search: function(val) {
      let filter = new RegExp(this.search, "i");
      this.filteredTeams = this.teams.filter(
        t => String(t.Number).match(filter) || t.Name.match(filter)
      );
    },
    teams: function(val) {
      this.filteredTeams = this.teams;
    }
  },
  mounted() {
    if (localStorage.cargoCustomWeight)
      this.cargoCustomWeight = localStorage.cargoCustomWeight;
    if (localStorage.hatchCustomWeight)
      this.hatchCustomWeight = localStorage.hatchCustomWeight;
    if (localStorage.climbCustomWeight)
      this.climbCustomWeight = localStorage.climbCustomWeight;
    axios
      .get(
        "https://www.thebluealliance.com/api/v3/event/2019iscmp/teams/simple"
      )
      .then(response => {
        console.log(response);
        this.event_teams = response.data.map(t => t.team_number);
        console.log(this.event_teams);
      })
      .catch(response => {
        console.log(response);
      });
    this.readTeams("cache");
  },
  created() {
    this.filteredTeams = this.filteredTeams.sort(this.sortTeams);
  },
  methods: {
    openAllianceModePage() {
      localStorage.getAlliance = this.getTBAAlliance? "tba":"storage";

      if (this.getTBAAlliance) {
        localStorage.allianceMatchNumber = this.allianceMatchNumber;
        localStorage.allianceColor = this.allianceColor;
      } else {
        localStorage.removeItem("allianceMatchNumber")
        localStorage.removeItem("allianceColor")
        const teams = ["1", "2", "3"];
        teams.forEach(k => {
          localStorage["allianceTeam" + k] = Number(this["allianceTeam" + k]);
        });
      }

      this.allianceModeDialog = false;
      this.$router.push({
        path: "alliance",
        params: { tba: this.getTBAAlliance }
      });
    },
    computeCustom() {
      let self = this;
      Object.keys(this.teamSummary).forEach(function(key, index) {
        // key: the name of the object key
        // index: the ordinal position of the key within the object
        let t = self.teamSummary[key];
        t.custom =
          self.cargoCustomWeight * t.cargo
           + self.hatchCustomWeight * t.hatch
           + self.climbCustomWeight * t.climb;
      });
      this.customUpdateIndex++;
      this.teams = this.teams.sort(this.sortTeams);
    },
    customData(team) {
      // console.log(team + ":" + this.teamSummary[team].custom);
      return this.teamSummary[team].custom;
    },
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
          this.activeTab = 0;
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
      this.teamSummary[team]["custom"] = -1;

      // console.log(this.teamSummary[team]);
    },

    onChange(tabIndex) {
      console.log(tabIndex);
      if (tabIndex != -1) this.activeTab = tabIndex;
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


