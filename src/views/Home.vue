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
    <template v-if="isRegistered">
      <v-layout mt-4 row>
        <v-flex xs8>
          <Register-Card :register="register"></Register-Card>
        </v-flex>
      </v-layout>
      <v-layout mt-4 row>
        <v-flex xs8>
          <Reg-Detail v-for="entry in entries" :key="entry.timestamp" :entry="entry"></Reg-Detail>
        </v-flex>
      </v-layout>
    </template>
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
  </v-container>
</template>
<script>
import { postData, readFile } from "../api/services";
import RegDetail from "../components/RegDetail.vue";
import RegisterCard from "../components/RegisterCard";

export default {
  components: {
    RegDetail: RegDetail,
    RegisterCard: RegisterCard
  },
  data: () => ({
    getDetailsURL:
      "https://script.google.com/macros/s/AKfycbwqubyO9eNQWIWJVjyVFFElr3rfi1DwYyu_2KvPbxWdTD8OhShb/exec",
    sendingToServer: false,
    registeredEmail: "",
    isValid: false,
    isError: false,
    dialog: false,
    dialogHeader: "",
    dialogMessages: "",
    entries: [],
    register: {},
    isRegistered: false,
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
    },

    async sendFormData() {
      this.sendingToServer = true;
      const { ok, error, data } = await postData(this.getDetailsURL, {
        email: this.registeredEmail
      });
      if (ok) {
        if (data.result === "ok") {
          this.register = data.response.register;
          this.entries = data.response.entries;
          this.isRegistered = true;
        } else {
          this.submitError(data.error);
        }
      } else {
        this.submitError(error);
      }
      this.sendingToServer = false;
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
  },
  computed: {
    fullName() {
      if (this.register.firstName) {
        return `${this.register.firstName} ${this.register.lastName}`;
      }
    }
  }
};
</script>