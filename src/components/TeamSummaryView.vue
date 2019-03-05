<template>
  <!-- Your HTML goes here -->
  <div id="team-summary-view">
    <div>
      <!-- <article v-for="(game,idx) in games" :key="idx">
        <article v-for="(data,j) in game" :key="j">{{data.key}}: {{data.value}}</article>
        <br>
        <br>
      </article>-->
      <article>
        <b>Matches:</b>
        {{games.length}}
      </article>
      <article>
        <b>Cargo</b>
        : Avg: {{cargoStats.avg}} Median: {{cargoStats.median}} Min: {{cargoStats.min}} Max: {{cargoStats.max}}
      </article>
      <article>
        <b>Hatch</b>
        : Avg: {{hatchStats.avg}} Median: {{hatchStats.median}} Min: {{hatchStats.min}} Max: {{hatchStats.max}}
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
      cargoStats:{},
      hatchStats: {}
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
      return { cargo: this.cargoStats.avg, hatch: this.hatchStats.avg };
    }
  },
  watch: {
    games(){
      this.cargoStats = this.generateStats("cargo")
      this.hatchStats = this.generateStats("hatch")
    },
    avgData(val) {
      this.$emit("update", val);
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
      .collection("Games")
      .onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          let game = [];
          // console.log(doc.id, " => ", doc.data());
          Object.keys(doc.data()).forEach(key => {
            game.push({
              key: key,
              value: doc.data()[key]
            });
          });
          this.games.push(game);
        });
      });
  },
  methods: {
    generateStats(piece) {
      // piece = hatch/cargo
      if (this.games.length == 0) {
        return { avg: 0, median: 0, min: 0, max: 0 };
      }

      let filter = new RegExp(piece, "i");
      let values = [];

      this.games.forEach(game => {
        let sum = 0;
        game.forEach(pair => {
          if (pair.key.match(filter)) {
            sum += parseInt(pair.value);
          }
        });
        values.push(sum);
      });

      let stats = {
        avg: values.reduce((total, num) => total + num) / values.length,
        median: this.median(values),
        min: Math.min(...values),
        max: Math.max(...values)
      };
      return stats;
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