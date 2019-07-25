<template>
  <nav>
    <v-toolbar flat app style="background: #085982;">
      <v-toolbar-title class="white--text">
        <span>Sculpture Bermagui - Registration Form</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-side-icon @click="drawer = !drawer" class="white--text"></v-toolbar-side-icon>
    </v-toolbar>

    <v-navigation-drawer app v-model="drawer" style="background: #085982;">
      <v-list class="pt-0">
        <v-img
          src="https://sculpturebermagui.org.au/wp-content/uploads/2017/10/sculpture-bermagui-nsw.jpg"
          style="width:150px;height:auto;"
        ></v-img>

        <v-list-tile v-for="link in links" :key="link.text" router :to="link.route">
          <v-list-tile-action>
            <v-icon class="white--text">{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="white--text">{{ link.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      drawer: null,
      links: [
        { icon: "home", text: "Home", route: "/" },
        { icon: "how_to_reg", text: "Register", route: "/register" },
        { icon: "insert_photo", text: "Add Entries", route: "/entries" }
      ]
    };
  }
};
</script>

<style>
.v-toolbar__content {
  padding-left: 10vw;
}
</style>
