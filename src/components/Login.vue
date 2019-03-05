<template>
  <div>
    <md-field>
      <label>Scouter Name</label>
      <md-input v-model="name" placeholder="Scouter Name"></md-input>
    </md-field>
    <md-button class="md-raised md-primary" @click="openTeamList(0)">New Scouting Report</md-button>
    <md-button v-if="head_auth" class="md-raised md-primary" @click="openTeamList(1)">Head of Shift</md-button>
    <md-button v-if="strategy_auth" class="md-raised md-primary" @click="openTeamList(2)">Strategy</md-button>
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      name: "",
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
    openTeamList(mode) {
      this.$router.push({ name: "Team List", params: { mode: mode , submitter:this.name} });
    }
  }
};
</script>
<style lang="sass">

</style>
