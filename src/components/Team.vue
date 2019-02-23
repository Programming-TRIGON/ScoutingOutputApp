<template>
  <!-- Your HTML goes here -->
  <div id="team">
    Hello team {{team}}!
    <div>
      <article v-for="(game,idx) in games" :key="idx">
        <article v-for="(data,j) in game" :key="j">{{data.key}}: {{data.value}}</article>
        <br>
        <br>
      </article>
    </div>
  </div>
</template>

<script>
/* Your JS goes here */
import { db } from "../main";

export default {
  name: "Team",
  data() {
    return {
      games: []
    };
  },
  firestore() {
    return {
    };
  },
  props: {
    team: String
  },
  created(){
      console.log("Current team: " + this.$props.team)
      db.collection("Teams")
        .doc(this.$props.team)
        .collection("Games")
        .onSnapshot(snapshot => {
          snapshot.forEach(doc => {
            let game = [];
            console.log(doc.id, " => ", doc.data());
            Object.keys(doc.data()).forEach(key => {
              game.push({
                key: key,
                value: doc.data()[key]
              });
            });
            this.$data.games.push(game);
          });
        });
  },
  methods: {
    
  }
};
</script>

<style>
/* Your CSS goes here */
</style>