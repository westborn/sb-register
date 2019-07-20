<template>
  <v-form v-model="valid" ref="registerForm">
    <v-container>
      <v-layout row>
        <v-flex xs6 offset-xs1>
          <v-text-field
            v-model="firstname"
            :rules="nameRules"
            :counter="40"
            label="First name"
            prepend-icon="account_circle"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs6 offset-xs1>
          <v-text-field
            v-model="lastname"
            :rules="nameRules"
            :counter="40"
            label="Last name"
            prepend-icon="account_circle"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs6 offset-xs1>
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            prepend-icon="email"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs6 offset-xs1>
          <v-text-field
            v-model="postcode"
            :rules="nameRules"
            :counter="4"
            label="Postcode"
            prepend-icon="location_on"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs6 offset-xs1>
          <v-btn @click="submit" class="primary">Submit Registration</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    valid: false,
    firstname: "",
    lastname: "",
    email: "",
    postcode: "",
    nameRules: [
      v => !!v || "Name is required",
      v => v.length >= 2 || "You need to enter at least 2 characters"
    ],
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+/.test(v) || "E-mail must be valid"
    ]
  }),
  methods: {
    submit() {
      if (this.$refs.registerForm.validate()) {
        console.log(this.firstname, this.lastname, this.email, this.postcode);
      }
    }
  }
};
</script>
