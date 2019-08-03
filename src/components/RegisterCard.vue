<template>
  <v-card>
    <v-card-title class="pb-1 font-weight-bold">Registration Information</v-card-title>
    <v-card-text class="pt-0">
      {{register.firstName}} {{register.lastName}}
      <br />
      {{register.email}}
      <br />
      {{register.phone}}
      <br />
      {{formattedDate}}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["register"],

  computed: {
    formattedDate() {
      const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
      };
      const myDate = new Date(this.register.timestamp);
      return myDate.toLocaleDateString("en-AU", options);
    }
  }
};
</script>

<style>
</style>
