<template>
  <v-form v-model="isValid" ref="registerForm">
    <v-container>
      <v-layout row>
        <v-flex xs6 offset-xs1>
          <v-text-field
            v-model="form.firstName"
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
            v-model="form.lastName"
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
            v-model="form.phone"
            :rules="nameRules"
            :counter="40"
            label="Telephone"
            prepend-icon="phone"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs6 offset-xs1>
          <v-text-field
            v-model="form.email"
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
            v-model="form.postcode"
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
            :disabled="!isValid || sendingToServer"
          >Submit this Registration?</v-btn>
          <div v-if="sendingToServer">
            <v-progress-linear :indeterminate="true"></v-progress-linear>
          </div>
        </v-flex>
      </v-layout>
    </v-container>

    <v-layout justify-center>
      <v-dialog v-model="dialog" persistent max-width="390">
        <v-card>
          <v-card-title class="headline">{{dialogHeader}}</v-card-title>
          <v-card-text>{{dialogMessages}}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="dialog = false">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-form>
</template>

<script>
import { postData } from "../api/services";

export default {
  data: () => ({
    registerURL:
      "https://script.google.com/macros/s/AKfycbxo2AF_dFaA7mALFpgiX_h6INNrcToPCvbDJX0ZB_ClIokJdKMS/exec",
    sendingToServer: false,
    isValid: false,
    isError: false,
    dialog: false,
    dialogHeader: "",
    dialogMessages: "",
    form: {
      firstName: null,
      lastName: null,
      phone: null,
      email: null,
      postcode: null
    },
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
    mounted() {
      console.log("App mounted!");
      if (localStorage.getItem("todos"))
        this.todos = JSON.parse(localStorage.getItem("todos"));
    },
    submit() {
      if (this.$refs.registerForm.validate()) {
        this.sendFormData();
      } else {
        console.log("where are we?");
        this.submitError("Please contact us via email regarding this entry");
      }
    },
    async sendFormData() {
      this.sendingToServer = true;
      const { ok, error, data } = await postData(this.registerURL, this.form);
      this.sendingToServer = false;
      if (ok) {
        if (data.result === "ok") {
          this.submitSuccess(data.emailKey);
          localStorage.setItem("currentEmailKey", data.emailKey);
        } else {
          this.submitError(data.error);
        }
      } else {
        this.submitError(error);
      }
    },
    submitSuccess(result) {
      this.isError = false;
      this.showDialog("Registration Added", result);
      this.isError = false;

      // if (this.dialog) this.$router.push({ path: "/" });
    },
    submitError(error) {
      console.log("submitError");
      console.log(error);
      this.showDialog("Ooops - something went wrong", error);
      this.isError = false;
    },
    showDialog(header, message) {
      this.dialogHeader = header;
      this.dialogMessages = message;
      this.dialog = true;
    }
  }
};
</script>
