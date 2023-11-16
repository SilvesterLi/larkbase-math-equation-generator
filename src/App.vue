<template>
  <h1>{{ $t('title') }}</h1>

  <Form  />
</template>

<script>
import Form from "./components/Form.vue";
import Math from "./components/math.vue";
export default {
  name: "App",
  components: {
    Form: Form,
    Math: Math
  },

};


</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>