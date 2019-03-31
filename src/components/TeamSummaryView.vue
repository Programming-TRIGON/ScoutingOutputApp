<template>
  <!-- Your HTML goes here -->
  <div id="team-summary-view" :key="renderIdx">
    <div>
      <!-- <article v-for="(game,idx) in games" :key="idx">
        <article v-for="(data,j) in game" :key="j">{{data.key}}: {{data.value}}</article>
        <br>
        <br>
      </article>-->
      <!-- {{games}} -->
      <article>
        <b>Matches:</b>
        {{games.length}}
      </article>
      <article v-model="cargoStats">
        <b>Cargo</b>
        : Avg: {{cargoStats.avg}} Median: {{cargoStats.median}} Min: {{cargoStats.min}} Max: {{cargoStats.max}}
      </article>
      <article v-model="hatchStats">
        <b>Hatch</b>
        : Avg: {{hatchStats.avg}} Median: {{hatchStats.median}} Min: {{hatchStats.min}} Max: {{hatchStats.max}}
      </article>
      <article v-model="climbStats">
        <b>Climb</b>
        : Avg: {{climbStats.avg}} Median: {{climbStats.median}} Min: {{climbStats.min}} Max: {{climbStats.max}}
      </article>
    </div>
  </div>
</template>

<script>
/* Your JS goes here */
import { db } from "../main";

export default {
  name: "TeamSummaryView",
  data() {
    return {
      games: [],
      cargoStats: {},
      hatchStats: {},
      climbStats: {},
      erased: [],
      renderIdx: 0
    };
  },
  computed: {
    // cargoStats() {
    //   return this.generateStats("cargo");
    // },
    // hatchStats() {
    //   return this.generateStats("hatch");
    // },
    avgData() {
      return {
        cargo: this.cargoStats.avg,
        hatch: this.hatchStats.avg,
        climb: this.climbStats.avg
      };
    }
  },
  watch: {
    games() {
      this.cargoStats = this.generateStats("cargo");
      this.hatchStats = this.generateStats("hatch");
      this.climbStats = this.generateStats("climb");
      this.renderIdx++;
    },
    avgData(val) {
      this.$emit("update", val);
    },
    erased: function() {
      this.games = this.games.filter(g => !this.erased.includes(g.id));
      this.renderIdx++;
    }
  },
  firestore() {
    return {};
  },
  props: {
    team: Number
  },
  mounted() {
    // console.log("Current team: " + this.$props.team);
    db.collection("Teams")
      .doc(String(this.$props.team))
      .get()
      .then(doc => {
        if (doc.data().erased) {
          this.erased = doc.data().erased;
        } else {
          this.erased = [];
        }
        // console.log("Erased: ");
        // console.log(this.erased);

        db.collection("Teams")
          .doc(String(this.$props.team))
          .collection("Games")
          .onSnapshot(snapshot => {
            snapshot.forEach(doc => {
              let game = [];
              // console.log(doc.id, " => ", doc.data());
              if (!this.erased.includes(doc.id)) {
                Object.keys(doc.data()).forEach(key => {
                  game.push({
                    key: key,
                    value: doc.data()[key]
                  });
                });
                this.games.push(game);
              }
            });
          });
      });
  },
  methods: {
    generateStats(piece) {
      // piece = hatch/cargo/climb
      if (this.games.length == 0) {
        return { avg: 0, median: 0, min: 0, max: 0 };
      }
      let values = [];
      if (piece == "hatch" || piece == "cargo") {
        let filter = new RegExp(piece, "i");

        this.games.forEach(game => {
          if (this.isValidForPiece(game, piece)) {
            let sum = 0;
            game.forEach(pair => {
              if (pair.key.match(filter)) {
                sum += parseInt(pair.value);
              }
            });
            values.push(sum);
          }
        });
      } else {
        // piece == "climb"
        this.games.forEach(game => {
          const climbPair = game.filter(p => p.key.includes("climb_level"));
          // console.log(climbPair)
          const climbLevel = Number(climbPair[0].value);
          if (climbLevel != -1) values.push(3 * Math.pow(2, climbLevel));
        });
      }
      if(values.length==0) return { avg: 0, median: 0, min: 0, max: 0 }; 
      let stats = {
        avg: values.reduce((total, num) => total + num) / values.length,
        median: this.median(values),
        min: Math.min(...values),
        max: Math.max(...values)
      };
      return stats;
    },
    isValidForPiece(game, piece) {
      let sum = 0;

      let pieceFilter = new RegExp(piece, "i");
      let teleopFilter = new RegExp("teleop", "i");
      game.forEach(pair => {
        if (pair.key.match(pieceFilter) && pair.key.match(teleopFilter)) {
          sum += parseInt(pair.value);
        }
      });

      return sum != 0;
    },
    median(values) {
      values.sort(function(a, b) {
        return a - b;
      });

      if (values.length === 0) return 0;

      var half = Math.floor(values.length / 2);

      if (values.length % 2) return values[half];
      else return (values[half - 1] + values[half]) / 2.0;
    }
  }
};
</script>

<style>
/* Your CSS goes here */
</style>