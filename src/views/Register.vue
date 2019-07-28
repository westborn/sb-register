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
            :disabled="!isValid || submitting"
          >Submit this Registration?</v-btn>
          <div v-if="submitting">
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
async function postData(url, obj) {
  const opts = {
    method: "post",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(obj)
  };
  try {
    const string = await fetch(url, opts);
    const res = await string.json();
    return { ok: true, data: res };
  } catch (error) {
    console.log("in postData-catch");
    console.log(error.stack);
    return { ok: false, error };
  }
}

export default {
  data: () => ({
    registerURL:
      "https://script.google.com/macros/s/AKfycbxo2AF_dFaA7mALFpgiX_h6INNrcToPCvbDJX0ZB_ClIokJdKMS/exec",
    submitting: false,
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
    submit() {
      if (this.$refs.registerForm.validate()) {
        this.sendFormData();
      } else {
        console.log("where are we?");
      }
    },
    async sendFormData() {
      this.submitting = true;
      const { ok, error, data } = await postData(this.registerURL, this.form);
      this.submitting = false;
      if (ok) {
        console.log(data);
        if (data.result === "ok") {
          this.submitSuccess(data.emailKey);
        } else {
          console.log("here");
          this.submitError(data.error);
        }
      } else {
        console.log("there");
        this.submitError(error);
      }
    },
    submitSuccess(result) {
      this.isError = false;
      this.dialogHeader = "All added OK";
      this.dialogMessages = result;
      this.dialog = true;
    },
    submitError(error) {
      console.log("submitError");
      console.log(error);
      this.dialogHeader = "Ooops - something went wrong";
      this.dialogMessages = error;
      this.dialog = true;
      this.isError = false;
    }
  }
};

//   submit() {
//     if (this.$refs.registerForm.validate()) {
//       this.submitting = true;
//       postData(
//         "https://script.google.com/macros/s/AKfycbxo2AF_dFaA7mALFpgiX_h6INNrcToPCvbDJX0ZB_ClIokJdKMS/exec",
//         {
//           method: "post",
//           headers: { "Content-Type": "text/plain;charset=utf-8" },
//           body: JSON.stringify(this.form)
//         }
//       ).then(res => {
//         console.log(this);
//         this.submitting = false;
//         this.$refs.registerForm.reset();
//       });
//     }
//   }
// }
</script>
