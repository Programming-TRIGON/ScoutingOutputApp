<template>
  <div>
    <md-field>
      <label>Scouter Name</label>
      <md-input v-model="name" placeholder="Scouter Name"></md-input>
    </md-field>
    <md-field>
      <label>Team Number</label>
      <md-input v-model="team" placeholder="Team Number"></md-input>
    </md-field>
    <md-button class="md-raised md-primary" @click="openForm">New Scouting Report</md-button>
    <md-button v-if="head_auth" class="md-raised md-primary" @click="addComment">Head of Shift</md-button>
    <md-button v-if="strategy_auth" class="md-raised md-primary" @click="openTeamList">Strategy</md-button>
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      name: "",
      team: "",
      head_auth: false,
      strategy_auth: false
    };
  },
  watch: {
    name(val) {
      console.log(val);

      if (val == "11599022") {
        this.strategy_auth = true;
      } else if (val == "11223344") {
        this.head_auth = true;
      } else {
        this.head_auth = false;
        this.strategy_auth = false;
      }
    }
  },
  methods: {
    openTeamList() {
      this.$router.push({
        name: "Team List",
        params: { submitter: this.name, mode: 2 }
      });
    },
    openForm() {
      this.$router.push({
        name: "Scouting Form",
        params: { team: String(this.team), submitter: this.name }
      });
    },
    addComment() {
      this.$router.push({
        name: "Team",
        params: { team: String(this.team), authLevel: 1 }
      });
    }
  }
};
</script>
<style lang="sass">

</style>
