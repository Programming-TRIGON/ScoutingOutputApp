<template>
  <!-- Your HTML goes here -->
  <div id="team">
    <md-toolbar class="md-large md-primary">
      <div class="md-toolbar-row">
        <div class="md-toolbar-section-end">
          <md-button @click="newCommentDialog = true">Add Comment</md-button>
          <md-button @click="pitScoutingDialog = true">Pit Scouting</md-button>
        </div>
      </div>

      <div class="md-toolbar-row md-toolbar-offset">
        <h3 class="md-title">Team {{team}}</h3>
      </div>
    </md-toolbar>

    <!-- New Comment Dialog -->
    <md-dialog :md-active.sync="newCommentDialog">
      <md-dialog-title>New Comment</md-dialog-title>

      <md-field>
        <label>Comment</label>
        <md-textarea v-model="comment"></md-textarea>
      </md-field>

      <md-dialog-actions>
        <md-button class="md-primary" @click="newCommentDialog = false">Close</md-button>
        <md-button class="md-primary" @click="addComment">Save</md-button>
      </md-dialog-actions>
    </md-dialog>

    <!-- Pit Scouting Dialog  -->
    <md-dialog :md-active.sync="pitScoutingDialog">
      <md-dialog-title>Pit Scouting</md-dialog-title>
      <div align="right">
        <md-switch v-model="edit">Edit</md-switch>
      </div>
      <div class="full-control">
        <md-list>
          <md-subheader>Cargo</md-subheader>

          <md-list-item>
            <md-checkbox v-model="psCargo.bottom" :disabled="disabled"/>
            <span class="md-list-item-text">Bottom</span>
          </md-list-item>

          <md-list-item>
            <md-checkbox v-model="psCargo.middle" :disabled="disabled"/>
            <span class="md-list-item-text">Middle</span>
          </md-list-item>

          <md-list-item>
            <md-checkbox v-model="psCargo.top" :disabled="disabled"/>
            <span class="md-list-item-text">Top</span>
          </md-list-item>
        </md-list>
        <md-list>
          <md-subheader>Hatch</md-subheader>

          <md-list-item>
            <md-checkbox v-model="psHatch.bottom" :disabled="disabled"/>
            <span class="md-list-item-text">Bottom</span>
          </md-list-item>

          <md-list-item>
            <md-checkbox v-model="psHatch.middle" :disabled="disabled"/>
            <span class="md-list-item-text">Middle</span>
          </md-list-item>

          <md-list-item>
            <md-checkbox v-model="psHatch.top" :disabled="disabled"/>
            <span class="md-list-item-text">Top</span>
          </md-list-item>
        </md-list>
        <md-list>
          <md-subheader>Climb</md-subheader>

          <md-list-item>
            <md-checkbox v-model="psClimb.level0" :disabled="disabled"/>
            <span class="md-list-item-text">Level 0</span>
          </md-list-item>

          <md-list-item>
            <md-checkbox v-model="psClimb.level1" :disabled="disabled"/>
            <span class="md-list-item-text">Level 1</span>
          </md-list-item>

          <md-list-item>
            <md-checkbox v-model="psClimb.level2" :disabled="disabled"/>
            <span class="md-list-item-text">Level 2</span>
          </md-list-item>
        </md-list>
      </div>
      <md-dialog-actions>
        <md-button class="md-primary" @click="pitScoutingDialog = false">Close</md-button>
        <md-button class="md-primary" @click="pitScouting">Save</md-button>
      </md-dialog-actions>
    </md-dialog>

    <!-- <md-table v-model="games" md-card md-sort="match_number" md-sort-order="asc" md-fixed-header>
      <md-table-toolbar>
        <h1 class="md-title">Matches</h1>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Match" md-sort-by="match_number">{{ item.match_number }}</md-table-cell>

        <md-table-cell
          md-label="Start Level"
          md-sort-by="auto_start_level"
        >{{ item.auto_start_level }}</md-table-cell>
        <md-table-cell md-label="Auto Rocket Cargo High" md-sort-by="auto_rocket_cargo_high">
          <b>{{ item.auto_rocket_cargo_high }}</b>
        </md-table-cell>
        <md-table-cell
          md-label="Auto Rocket Cargo Medium"
          md-sort-by="auto_rocket_cargo_medium"
        >{{ item.auto_rocket_cargo_medium }}</md-table-cell>
        <md-table-cell
          md-label="Auto Rocket Cargo Low"
          md-sort-by="auto_rocket_cargo_low"
        >{{ item.auto_rocket_cargo_low }}</md-table-cell>
        <md-table-cell
          md-label="Auto Rocket Hatch High"
          md-sort-by="auto_rocket_hatch_high"
        >{{ item.auto_rocket_hatch_high }}</md-table-cell>
        <md-table-cell
          md-label="Auto Rocket Hatch Medium"
          md-sort-by="auto_rocket_hatch_medium"
        >{{ item.auto_rocket_hatch_medium }}</md-table-cell>
        <md-table-cell
          md-label="Auto Rocket Hatch Low"
          md-sort-by="auto_rocket_hatch_low"
        >{{ item.auto_rocket_hatch_low }}</md-table-cell>
        <md-table-cell
          md-label="Auto Ship Hatch"
          md-sort-by="auto_ship_hatch"
        >{{ item.auto_ship_hatch }}</md-table-cell>
        <md-table-cell
          md-label="Auto Ship Cargo"
          md-sort-by="auto_ship_cargo"
        >{{ item.auto_ship_cargo }}</md-table-cell>

        <md-table-cell
          md-label="Teleop Rocket Cargo High"
          md-sort-by="teleop_rocket_cargo_high"
        >{{ item.teleop_rocket_cargo_high }}</md-table-cell>
        <md-table-cell
          md-label="Teleop Rocket Cargo Medium"
          md-sort-by="teleop_rocket_cargo_medium"
        >{{ item.teleop_rocket_cargo_medium }}</md-table-cell>
        <md-table-cell
          md-label="Teleop Rocket Cargo Low"
          md-sort-by="teleop_rocket_cargo_low"
        >{{ item.teleop_rocket_cargo_low }}</md-table-cell>
        <md-table-cell
          md-label="Teleop Rocket Hatch High"
          md-sort-by="teleop_rocket_hatch_high"
        >{{ item.teleop_rocket_hatch_high }}</md-table-cell>
        <md-table-cell
          md-label="Teleop Rocket Hatch Medium"
          md-sort-by="teleop_rocket_hatch_medium"
        >{{ item.teleop_rocket_hatch_medium }}</md-table-cell>
        <md-table-cell
          md-label="Teleop Rocket Hatch Low"
          md-sort-by="teleop_rocket_hatch_low"
        >{{ item.teleop_rocket_hatch_low }}</md-table-cell>
        <md-table-cell
          md-label="Teleop Ship Hatch"
          md-sort-by="teleop_ship_hatch"
        >{{ item.teleop_ship_hatch }}</md-table-cell>
        <md-table-cell
          md-label="Teleop Ship Cargo"
          md-sort-by="teleop_ship_cargo"
        >{{ item.teleop_ship_cargo }}</md-table-cell>

        <md-table-cell md-label="Climb Level" md-sort-by="climb_level">{{ item.climb_level }}</md-table-cell>
      </md-table-row>
    </md-table>-->
    <!-- Strategy only -->
    <div v-if="authLevel==2">
      <!-- Chart section -->
      <div>
        <md-radio v-model="chartMode" value="auto">Auto</md-radio>
        <md-radio v-model="chartMode" value="teleop">Teleop</md-radio>
      </div>
      <div>
        <md-radio v-model="chartPiece" value="cargo">Cargo</md-radio>
        <md-radio v-model="chartPiece" value="hatch">Hatch</md-radio>
      </div>
      <canvas
        id="canvas"
        width="722"
        height="361"
        class="chartjs-render-monitor"
        style="display: block;e width: 722px; height: 361px;"
      ></canvas>
    </div>

    <!-- Comments -->
    <div>
      <h3>Comments</h3>
      <div class="comment_list">
        <md-card v-for="(cmt,idx) in dbComments" :key="idx">
          <md-card-content>{{cmt.comment}}</md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
/* Your JS goes here */
import { db } from "../main";
import Chart from "chart.js";
import { functions } from "firebase";
export default {
  name: "Team",
  data() {
    return {
      //Data
      games: [],
      matches: [],
      dbComments: [],

      // Chart states
      chartMode: "Auto",
      chartPiece: "Cargo",
      myChart: null,

      // New comment dialog
      newCommentDialog: false,
      comment: null,

      // Pit scouting dialog
      pitScoutingDialog: false,
      edit: false,

      psCargo: { bottom: false, middle: false, top: false },
      psHatch: { bottom: false, middle: false, top: false },
      psClimb: { level0: false, level1: false, level2: false }
    };
  },
  firestore() {
    return {};
  },
  props: {
    team: String,
    authLevel: Number
  },
  computed: {
    disabled: function() {
      return !this.edit;
    }
  },
  watch: {
    matches: function(val) {
      this.createChart();
    },
    chartMode: function(val) {
      this.createChart();
    },
    chartPiece: function(val) {
      this.createChart();
    }
  },
  mounted() {
    if (this.authLevel == 2) this.createChart();
  },
  created() {
    if (this.authLevel == 2) {
      console.log("Current team: " + this.$props.team);
      db.collection("Teams")
        .doc(this.$props.team)
        .collection("Games")
        .onSnapshot(snapshot => {
          snapshot.forEach(doc => {
            // console.log(doc.id, " => ", doc.data());
            this.$data.games.push(doc.data());
            this.matches.push(doc.data().match_number);
          });
        });
    }
    db.collection("Teams")
      .doc(this.$props.team)
      .collection("Comments")
      .onSnapshot(snapshot => {
        this.dbComments = [];
        snapshot.forEach(doc => {
          // console.log(doc.id, " => ", doc.data());
          this.dbComments.push(doc.data());
        });
      });

    db.collection("Teams")
      .doc(this.$props.team)
      .get()
      .then(doc => {
        if (doc.get("pit_scouting") != null) {
          // Pit scouting exists, update it
          const data = doc.data();
          this.psCargo.top = data.cargo_top;
          this.psCargo.middle = data.cargo_middle;
          this.psCargo.bottom = data.cargo_bottom;

          this.psHatch.top = data.hatch_top;
          this.psHatch.middle = data.hatch_middle;
          this.psHatch.bottom = data.hatch_bottom;

          this.psClimb.level0 = data.climb_level0;
          this.psClimb.level1 = data.climb_level1;
          this.psClimb.level2 = data.climb_level2;
        }
      });
  },
  methods: {
    addComment() {
      // Save the comment to the database
      db.collection("Teams")
        .doc(this.$props.team)
        .collection("Comments")
        .add({
          comment: this.comment
        });
      //close the dialog
      this.newCommentDialog = false;
    },
    pitScouting() {
      db.collection("Teams")
        .doc(this.$props.team)
        .update({
          pit_scouting: true,
          cargo_top: this.psCargo.top,
          cargo_middle: this.psCargo.middle,
          cargo_bottom: this.psCargo.bottom,
          hatch_top: this.psHatch.top,
          hatch_middle: this.psHatch.middle,
          hatch_bottom: this.psHatch.bottom,
          climb_level0: this.psClimb.level0,
          climb_level1: this.psClimb.level1,
          climb_level2: this.psClimb.level2
        });
      this.pitScoutingDialog = false;
    },
    createChart() {
      let mode = this.chartMode;
      let piece = this.chartPiece;
      console.log(this.matches);
      var barChartData = {
        labels: this.matches,
        datasets: [
          {
            label: "Cargoship",
            backgroundColor: "rgba(255, 206, 86, 1)",
            data: this.games.map(game => game[mode + "_ship_" + piece])
          },
          {
            label: "Rocket Low",
            backgroundColor: "rgba(75, 192, 192, 1)",
            data: this.games.map(
              game => game[mode + "_rocket_" + piece + "_low"]
            )
          },
          {
            label: "Rocket Middle",
            backgroundColor: "rgba(153, 102, 255, 1)",
            data: this.games.map(
              game => game[mode + "_rocket_" + piece + "_medium"]
            )
          },
          {
            label: "Rocket High",
            backgroundColor: "rgba(255, 159, 64, 1)",
            data: this.games.map(
              game => game[mode + "_rocket_" + piece + "_high"]
            )
          }
        ]
      };
      if (this.myChart) {
        this.myChart.data = barChartData;
        this.myChart.update();
      } else {
        var ctx = document.getElementById("canvas").getContext("2d");
        this.myChart = new Chart(ctx, {
          type: "bar",
          data: barChartData,
          options: {
            title: {
              display: false
            },
            tooltips: {
              mode: "index",
              intersect: false
            },
            responsive: true,
            scales: {
              xAxes: [
                {
                  stacked: true
                }
              ],
              yAxes: [
                {
                  stacked: true
                }
              ]
            }
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.md-app {
  min-height: 350px;
  border: 1px solid rgba(#000, 0.12);
}

// Demo purposes only
.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}

.md-list {
  width: 320px;
  max-width: 100%;
  display: inline-block;
  border: 1px solid rgba(#000, 0.12);
  vertical-align: top;
}

.full-control {
  width: 320px;
  max-width: 100%;
  height: 400px;
  display: inline-block;
  overflow: auto;
  border: 1px solid rgba(#000, 0.12);
  vertical-align: top;
}

.comment_list {
  max-height: 400px;
}
</style>