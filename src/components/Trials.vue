<template>
  <div>
    <md-steppers :md-active-step.sync="active" md-linear>
      <md-step id="start" md-label="Start" :md-done.sync="start_done">
        <md-card>
          <md-card-header>Start</md-card-header>

          <md-field :class="emptyMatch">
            <label>Match Number</label>
            <md-input v-model="matchNumber" type="number" class="small-number"></md-input>
          <span class="md-error">Please input match number!</span>
          </md-field>
          <md-radio v-model="startLevel" :value="1">Level 1</md-radio>
          <md-radio v-model="startLevel" value="2">Level 2</md-radio>
        </md-card>
        <md-button class="md-raised md-primary" @click="setDone('start_done', 'auto')" :disabled="matchNumber==0">Auto</md-button>
      </md-step>

      <md-step id="auto" md-label="Auto" :md-error="secondStepError" :md-done.sync="auto_done">
        <md-card>
          <md-card-header>Auto</md-card-header>

          <md-card-content>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                <div class="md-layout-item">
                  <md-field>
                    <label>Hatch Low</label>
                    <md-input v-model="auto.hatch[0]" type="number" class="small-number"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item">
                  <md-field>
                    <label>Hatch Middle</label>
                    <md-input v-model="auto.hatch[1]" type="number" class="small-number"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item">
                  <md-field>
                    <label>Hatch Top</label>
                    <md-input v-model="auto.hatch[2]" type="number" class="small-number"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item">
                  <md-field>
                    <label>Hatch Cargoship</label>
                    <md-input v-model="auto.hatch[3]" type="number" class="small-number"></md-input>
                  </md-field>
                </div>
              </div>
              <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                <div class="md-layout-item">
                  <md-field>
                    <label>Cargo Low</label>
                    <md-input v-model="auto.cargo[0]" type="number" class="small-number"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item">
                  <md-field>
                    <label>Cargo Middle</label>
                    <md-input v-model="auto.cargo[1]" type="number" class="small-number"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item">
                  <md-field>
                    <label>Cargo Top</label>
                    <md-input v-model="auto.cargo[2]" type="number" class="small-number"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item">
                  <md-field>
                    <label>Cargo Cargoship</label>
                    <md-input v-model="auto.cargo[3]" type="number" class="small-number"></md-input>
                  </md-field>
                </div>
              </div>
            </div>
          </md-card-content>
        </md-card>
        <md-button class="md-raised md-primary" @click="setDone('auto_done', 'teleop')">Teleop</md-button>
      </md-step>

      <md-step id="teleop" md-label="Teleop" :md-done.sync="teleop_done">
        <md-card>
          <md-card-header>Teleop</md-card-header>

          <md-card-content>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                <div class="md-layout-item">
                  <md-field>
                    <label>Hatch Low</label>
                    <md-input v-model="teleop.hatch[0]" type="number" class="small-number"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item">
                  <md-field>
                    <label>Hatch Middle</label>
                    <md-input v-model="teleop.hatch[1]" type="number" class="small-number"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item">
                  <md-field>
                    <label>Hatch Top</label>
                    <md-input v-model="teleop.hatch[2]" type="number" class="small-number"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item">
                  <md-field>
                    <label>Hatch Cargoship</label>
                    <md-input v-model="teleop.hatch[3]" type="number" class="small-number"></md-input>
                  </md-field>
                </div>
              </div>
              <div class="md-layout-item">
                <div class="md-layout-item">
                  <md-field>
                    <label>Cargo Low</label>
                    <md-input v-model="teleop.cargo[0]" type="number" class="small-number"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item">
                  <md-field>
                    <label>Cargo Middle</label>
                    <md-input v-model="teleop.cargo[1]" type="number" class="small-number"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item">
                  <md-field>
                    <label>Cargo Top</label>
                    <md-input v-model="teleop.cargo[2]" type="number" class="small-number"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item">
                  <md-field>
                    <label>Cargo Cargoship</label>
                    <md-input v-model="teleop.cargo[3]" type="number" class="small-number"></md-input>
                  </md-field>
                </div>
              </div>
            </div>
          </md-card-content>
        </md-card>
        <md-button class="md-raised md-primary" @click="setDone('teleop_done','endgame')">Endgame</md-button>
      </md-step>
      <md-step id="endgame" md-label="Climb" :md-done.sync="endgame_done">
        <md-card>
          <md-card-header>Climb</md-card-header>

          <md-radio v-model="climb" :value="0">Level 0</md-radio>
          <md-radio v-model="climb" value="1">Level 1</md-radio>
          <md-radio v-model="climb" value="2">Level 2</md-radio>
          <md-radio v-model="climb" value="-1">Didn't Try</md-radio>
        </md-card>
        <md-button class="md-raised md-primary" @click="setDone('endgame_done')">Submit</md-button>
      </md-step>
    </md-steppers>
  </div>
</template>

<script>
export default {
  name: "StepperLinear",
  data: () => ({
    active: "start",
    start_done: false,
    auto_done: false,
    teleop_done: false,
    endgame_done: false,

    secondStepError: null,
    matchNumber: 0,
    startLevel: 1,
    auto: {
      hatch: [0, 0, 0, 0],
      cargo: [0, 0, 0, 0]
    },
    teleop: {
      hatch: [0, 0, 0, 0],
      cargo: [0, 0, 0, 0]
    },
    climb: 0
  }),
  computed:{
    emptyMatch (){
      return {
        'md-invalid': this.matchNumber == 0
      }
    }
  },
  methods: {
    setDone(id, index) {
      this[id] = true;

      this.secondStepError = null;

      if (index) {
        this.active = index;
      }
    },
    setError() {
      this.secondStepError = "This is an error!";
    }
  }
};
</script>

<style lang="scss" scoped>

</style>