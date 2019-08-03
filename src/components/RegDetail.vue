<template>
  <v-card>
    <v-card-title class="pb-1 font-weight-bold">{{entry.title}}</v-card-title>
    <v-card-text class="pt-0">
      Price: ${{entry.price}}
      <br />
      Size: {{entry.size}}
      <br />
      Placement: {{entry.placement}}
      <br />
      Material: {{entry.material}}
      <br />
      Special Requirements: {{entry.specialReqs}}
      <br />
      Description: {{entry.description}}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["entry"]
};
</script>

<style>
</style>
