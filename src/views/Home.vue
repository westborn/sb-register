<template>
  <v-container>
    <h1>Artist Registration</h1>

    <v-layout row>
      <v-flex xs8>
        <v-card>
          <v-card-text>
            <h4>Registration Information</h4>
            <p class="text--primary">
              If you haven't registered yet, please go to the "Register" page
              and enter the basic details required.
              <br />This is not a committment, just a pre-registration to assist us
              in identifying and communicating with all artists who may be
              interested in entering this year's event.
            </p>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-text>
            <h4>Already Registered?</h4>
            <p class="text--primary">
              If you have already registered please enter your email address below
              to retrieve the detail of your Registration.
            </p>
            <p>
              If the email address below is correct you can proceed to add one or more
              entries that you'd like to submit by using the "Add Entries" tab on the menu
            </p>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-form v-model="isValid" ref="detailsForm">
      <v-layout row mt-5></v-layout>
      <v-layout row>
        <v-flex xs5>
          <v-text-field
            v-model="registeredEmail"
            :rules="emailRules"
            label="E-mail"
            prepend-icon="email"
          ></v-text-field>
        </v-flex>
        <v-flex xs3>
          <v-btn
            @click="submit"
            class="primary"
            :disabled="!isValid || sendingToServer"
          >Get Registration Details</v-btn>
          <div v-if="sendingToServer">
            <v-progress-linear :indeterminate="true"></v-progress-linear>
          </div>
        </v-flex>
      </v-layout>
    </v-form>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    sendingToServer: false,
    registeredEmail: null,
    isValid: false,
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+/.test(v) || "E-mail must be valid"
    ]
  }),
  methods: {
    submit() {
      if (this.$refs.detailsForm.validate()) {
        this.sendFormData();
      } else {
        console.log("where are we?");
      }
    }
  }
};
</script>