<template>
  <div>
    <slot></slot>
    <button @click="sub">-1</button>
    {{result}}
    <button @click="add">+1</button>
    <div>this is inside the child component: {{ result }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "Counter",
      title: "Counter",
      result: 0
    };
  },
  watch: {
    // counter(val) {
    //   //  console.log(val)
    //   this.$emit("input", val);
    // }
  },
  props: ["value"],
  methods: {
    emitResult() {
      this.$emit("input", this.result);
    },
    changeCounter(amount) {
      this.counter += amount;
    },
    add() {
      this.result += 1;
      this.emitResult();
    },
    sub() {
      this.result -= 1;
      this.emitResult();
    }
  }
};
</script>