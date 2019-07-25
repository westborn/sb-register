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
          <v-btn
            @click="submit"
            class="primary"
            :disabled="!valid || loading"
          >Submit this Registration?</v-btn>
          <div v-if="loading">
            <v-progress-linear :indeterminate="true"></v-progress-linear>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
async function postData(url, opts) {
  try {
    const res = await fetch(url, opts);
    return await res.json();
  } catch (e) {
    console.log("in postData");
    console.log(e.stack);
  }
}

export default {
  data: () => ({
    registerURL:
      "https://script.google.com/macros/s/AKfycbzVZQtxm3XbHoBzLIVVD-7Ds_WIkGrjO8se4q-GzEGxyT1rg9fH/exec",
    loading: false,
    valid: false,
    firstname: null,
    lastname: null,
    email: null,
    postcode: null,
    nameRules: [
      v => !!v || "Name is required",
      v => (v && v.length >= 2) || "You need to enter at least 2 characters"
    ],
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+/.test(v) || "E-mail must be valid"
    ]
  }),
  methods: {
    submit() {
      if (this.$refs.registerForm.validate()) {
        const formFields = {
          email: this.email,
          firstname: this.firstname,
          lastname: this.lastname,
          postcode: this.postcode
        };
        this.loading = true;
        const self = this;
        this.loading = true;
        postData(
          "https://script.google.com/macros/s/AKfycbxo2AF_dFaA7mALFpgiX_h6INNrcToPCvbDJX0ZB_ClIokJdKMS/exec",
          {
            method: "post",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(formFields)
          }
        ).then(res => {
          // console.log(self);
          self.loading = false;
          self.$refs.registerForm.reset();
        });
      }
    }
  }
};
</script>
