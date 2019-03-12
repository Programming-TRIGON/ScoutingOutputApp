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

    <!-- Strategy only -->
    <div v-if="authLevel==2">
      <!-- Chart and table section -->
      <div>
        <md-radio v-model="chartMode" value="auto">Auto</md-radio>
        <md-radio v-model="chartMode" value="teleop">Teleop</md-radio>
      </div>
      <div>
        <md-radio v-model="chartPiece" value="cargo">Cargo</md-radio>
        <md-radio v-model="chartPiece" value="hatch">Hatch</md-radio>
      </div>
      <div>
        <md-checkbox v-model="showSubmitter">Submitter</md-checkbox>
        <md-checkbox v-model="showStart">Start Level</md-checkbox>
        <md-checkbox v-model="showClimb">Climb Level</md-checkbox>
        <md-checkbox v-model="showComment">Comment</md-checkbox>
      </div>
      <md-table
        v-model="games"
        md-card
        md-sort="match_number"
        md-sort-order="asc"
        md-fixed-header
        :key="tableKey"
        @md-selected="onMatchTableSelect"
      >
        <md-table-toolbar>
          <h1 class="md-title">Matches</h1>
        </md-table-toolbar>

        <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="single">
          <md-table-cell md-label="Match">{{ item.match_number }}</md-table-cell>

          <md-table-cell
            v-if="showSubmitter"
            md-label="Submitter"
          >{{ item.submitter }}</md-table-cell>
          <md-table-cell
            v-if="showStart"
            md-label="Start Level"
            md-sort-by="auto_start_level"
          >{{ item.auto_start_level }}</md-table-cell>
          <md-table-cell md-label="Climb Level" v-if="showClimb">{{ item.climb_level }}</md-table-cell>
          <md-table-cell md-label="Comment" v-if="showComment">{{ item.personal_feedback }}</md-table-cell>
          <md-table-cell md-label="Ship">{{ item[chartMode + "_ship_"+chartPiece] }}</md-table-cell>
          <md-table-cell
            md-label="Rocket Low"
          >{{ item[chartMode + "_rocket_"+chartPiece + "_low"] }}</md-table-cell>
          <md-table-cell
            md-label="Rocket Medium"
          >{{ item[chartMode + "_rocket_"+chartPiece + "_medium"] }}</md-table-cell>

          <md-table-cell md-label="Rocket High">
            <b>{{item[chartMode + "_rocket_"+chartPiece + "_high"] }}</b>
          </md-table-cell>
        </md-table-row>
      </md-table>
      <md-snackbar
        md-position="center"
        :md-duration="4000"
        :md-active.sync="showSnackbar"
        md-persistent
      >
        <span>Match {{currentSelectedMatch.match_number}}</span>
        <md-button class="md-primary" @click="editSelectedMatch">
          <md-icon>edit</md-icon>
        </md-button>
        <md-button class="md-primary" @click="deleteSelectedMatch">
          <md-icon>delete</md-icon>
        </md-button>
      </md-snackbar>
      <md-snackbar
        md-position="center"
        :md-duration="4000"
        :md-active.sync="showSuccessfulDeleteSnackbar"
        md-persistent
      >
        <span>Successfully removed match {{currentSelectedMatch.match_number}}</span>
        <md-button class="md-primary" @click="restoreSelectedMatch">
          <md-icon>undo</md-icon>
        </md-button>
      </md-snackbar>

      <md-dialog :md-active.sync="showMatchEditDialog">
        <md-dialog-title>Edit match {{currentSelectedMatch.match_number}}</md-dialog-title>
        <div class="dialog-content">
          <md-content class="md-scrollbar">
            <md-field v-for="(value, key) in currentSelectedMatch" :key="key">
              <label>{{key.replace(new RegExp('_', 'g'), ' ')}}</label>
              <md-input v-model.number="currentSelectedMatch[key]"></md-input>
            </md-field>
          </md-content>
        </div>
        <md-dialog-actions>
          <md-button class="md-primary" @click="showMatchEditDialog = false">Close</md-button>
          <md-button class="md-primary" @click="saveEditsForSelectedMatch">Save</md-button>
        </md-dialog-actions>
      </md-dialog>
      <md-snackbar
        md-position="center"
        :md-duration="4000"
        :md-active.sync="showSuccessfulEditSnackbar"
        md-persistent
      >
        <span>Successfully edited match {{currentSelectedMatch.match_number}}</span>
      </md-snackbar>
      <canvas
        id="canvas"
        width="722"
        height="361"
        class="chartjs-render-monitor"
        style="display: block;e width: 722px; height: 361px;"
      ></canvas>
      <!-- <canvas
        id="climbChart"
        width="722"
        height="361"
        class="chartjs-render-monitor"
        style="display: block;e width: 722px; height: 361px;"
      ></canvas>-->
      <md-table v-model="countedClimbLevels" md-card>
        <md-table-toolbar>
          <h1 class="md-title">Climbs</h1>
        </md-table-toolbar>

        <md-table-row slot="md-table-row" slot-scope="{ item }">
          <md-table-cell md-label="Level">{{ item.key }}</md-table-cell>
          <md-table-cell md-label="Times">{{ item.value }}</md-table-cell>
        </md-table-row>
      </md-table>
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

    <!-- Deleted Matches -->
    <md-table v-model="erasedMatches" md-card
        md-fixed-header :key="tableKey"
        @md-selected="onErasedMatchTableSelect">
      <md-table-toolbar>
        <h1 class="md-title">Erased Matches</h1>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="single">
        <md-table-cell md-label="ID" >{{ item.id }}</md-table-cell>
        <md-table-cell md-label="Match" >{{ item.match_number }}</md-table-cell>
      </md-table-row>
    </md-table>
     <md-snackbar
        md-position="center"
        :md-duration="4000"
        :md-active.sync="showRestoreMatchSnackbar"
        md-persistent
      >
        <span>Click to restore match {{currentSelectedMatch.match_number}}</span>
        <md-button class="md-primary" @click="restoreSelectedMatch">
          <md-icon>undo</md-icon>
        </md-button>
      </md-snackbar>
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
      erasedMatches: [],
      dbComments: [],

      // Chart states
      chartMode: "Auto",
      chartPiece: "Cargo",
      myChart: null,
      tableKey: 0,
      showSnackbar: false,
      showSuccessfulDeleteSnackbar: false,
      currentSelectedMatch: {},
      showMatchEditDialog: false,
      showSuccessfulEditSnackbar: false,
      showRestoreMatchSnackbar: false,
      erased: [],

      showSubmitter:true,
      showStart: true,
      showClimb: true,
      showComment: false,

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
    },
    countedClimbLevels: function() {
      const levelNames = {
        "1": "Level 0",
        "2": "Level 1",
        "3": "Level 2",
        "-1": "Didn't Try"
      };
      const levels = this.games.map(g => levelNames[g.climb_level]);
      console.log(levels);
      let countedLevels = {};
      for (var i = 0; i < levels.length; ++i) {
        if (!countedLevels[levels[i]]) countedLevels[levels[i]] = 0;
        ++countedLevels[levels[i]];
      }
      // console.log(this.games);
      console.log(countedLevels);

      let ret = [];
      for (let i in countedLevels) {
        console.log(i);
        ret.push({ key: i, value: countedLevels[i] });
      }
      return ret;
    }
  },
  watch: {
    matches: function(val) {
      this.createChart();
      // this.createClimbPiChart();
    },
    chartMode: function(val) {
      this.tableKey++;
      this.createChart();
    },
    chartPiece: function(val) {
      this.tableKey++;
      this.createChart();
    },
    erased: function() {
      this.games = this.games.filter(g => !this.erased.includes(g.id));
      this.erasedMatches = this.erasedMatches.filter(g =>
        this.erased.includes(g.id)
      );
    }
  },
  mounted() {
    if (this.authLevel == 2) {
      this.createChart();
      // this.createClimbPiChart();
    }
  },
  created() {
    if (this.authLevel == 2) {
      let self = this;
      db.collection("Teams")
        .doc(this.$props.team)
        .get()
        .then(doc => {
          if (doc.data().erased) {
            self.erased = doc.data().erased;
          } else {
            self.erased = [];
          }
          console.log("Erased: ");
          console.log(this.erased);
        });

      console.log("Current team: " + this.$props.team);
      db.collection("Teams")
        .doc(this.$props.team)
        .collection("Games")
        .onSnapshot(snapshot => {
          snapshot.forEach(doc => {
            // console.log(doc.id, " => ", doc.data());

            let g = doc.data();
            g["id"] = doc.id;
            this.games.push(g);
            this.erasedMatches.push(g);
          });
          this.games.sort(
            (g1, g2) => Number(g1.match_number) - Number(g2.match_number)
          );
          this.matches = this.games.map(g => g.match_number);
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
    onMatchTableSelect(item) {
      console.log(item);
      this.currentSelectedMatch = item;
      this.showSnackbar = true;
    },
    onErasedMatchTableSelect(item){
      console.log(item)
      this.currentSelectedMatch = item
      this.showRestoreMatchSnackbar = true
    },
    deleteSelectedMatch() {
      this.erased.push(this.currentSelectedMatch.id);
      db.collection("Teams")
        .doc(this.team)
        .update({
          erased: this.erased
        });
      tableKey ++
      this.showSnackbar = false;
      this.showSuccessfulDeleteSnackbar = true;
    },
    editSelectedMatch() {
      this.showMatchEditDialog = true;
      this.showSnackbar = false;
    },
    saveEditsForSelectedMatch() {
      this.showMatchEditDialog = false;
      db.collection("Teams")
        .doc(this.team)
        .collection("Games")
        .doc(this.currentSelectedMatch.id)
        .update(this.currentSelectedMatch);

      this.showSuccessfulEditSnackbar = true;
    },
    restoreSelectedMatch() {
      var index = this.erased.indexOf(this.currentSelectedMatch.id);
      console.log("Index: " + index);
      if (index > -1) {
        this.erased.splice(index, 1);
        db.collection("Teams")
          .doc(this.team)
          .update({
            erased: this.erased
          });
      }
      this.tableKey ++
      this.showSuccessfulDeleteSnackbar = false;
      this.showRestoreMatchSnackbar = false;
    },
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

.dialog-content {
  overflow: auto;
}
</style>