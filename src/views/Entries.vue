<template>
  <v-form v-model="isValid" ref="entryForm">
    <v-container>
      <h3>Adding an entry for: {{form.email}}</h3>
      <v-layout row>
        <v-flex xs6 offset-xs1>
          <v-text-field
            v-model="form.title"
            :rules="nameRules"
            :counter="40"
            label="Title for this work"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs6 offset-xs1>
          <v-text-field prefix="$" v-model="form.price" label="Sale Price" required></v-text-field>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs6 offset-xs1>
          <v-radio-group v-model="form.inOrOut">
            <v-radio label="Indoor" value="Indoor"></v-radio>
            <v-radio label="Outdoor" value="Outdoor"></v-radio>
          </v-radio-group>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs6 offset-xs1>
          <v-text-field
            v-model="form.material"
            :rules="nameRules"
            :counter="40"
            label="Material(s) used"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs6 offset-xs1>
          <v-text-field
            v-model="form.size"
            :rules="nameRules"
            :counter="40"
            label="Approx Size"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs6 offset-xs1>
          <v-textarea v-model="form.description" label="Description (25 words max)" required></v-textarea>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs6 offset-xs1>
          <v-text-field v-model="form.specialReqs" label="Special Requirements"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs6 offset-xs1>
          <v-text-field v-model="form.placement" label="Placement preference (optional)"></v-text-field>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs3 offset-xs1>
          <label for="file-upload" class="v-btn v-btn--flat info">Select Image to Upload</label>
          <input
            id="file-upload"
            type="file"
            @change="fileChanged"
            style="
              position: absolute;
              height: 0.1px;
              width: 0.1px;
              overflow: hidden;
              opacity: 0;
              z-index: -1;"
          />
        </v-flex>
        <v-flex xs3>
          <v-text-field disabled v-model="form.originalFileName" label="File to be Uploaded"></v-text-field>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs6 offset-xs1>
          <v-btn
            @click="submit"
            class="primary"
            :disabled="!isValid || sendingToServer"
          >Add this piece?</v-btn>
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
import { postData, readFile } from "../api/services";

export default {
  data: () => ({
    addInfoURL:
      "https://script.google.com/macros/s/AKfycbzVZQtxm3XbHoBzLIVVD-7Ds_WIkGrjO8se4q-GzEGxyT1rg9fH/exec",
    sendingToServer: false,
    isValid: false,
    isError: false,
    dialog: false,
    dialogHeader: "",
    dialogMessages: "",
    form: {
      email: "",
      title: null,
      price: null,
      inOrOut: "Indoor",
      material: null,
      size: null,
      description: null,
      specialReqs: null,
      placement: null,
      originalFileName: null,
      fileContents: null
    },
    fileToUpload: null,
    nameRules: [
      v => !!v || "You need to enter something here",
      v => (v && v.length >= 2) || "You need to enter at least 2 characters"
    ]
  }),

  beforeRouteEnter(to, from, next) {
    if (!localStorage.getItem("currentEmailKey")) {
      const answer = window.confirm(
        "Please register or search for a current registation"
      );
      next(false);
    } else {
      next();
    }
  },
  created() {
    if (localStorage.getItem("currentEmailKey")) {
      this.form.email = localStorage.getItem("currentEmailKey");
    } else {
      this.$router.push("/");
    }
  },
  methods: {
    submit() {
      if (this.$refs.entryForm.validate()) {
        this.sendFormData();
      } else {
        console.log("where are we?");
        this.submitError("Please contact us via email regarding this entry");
      }
    },
    async sendFormData() {
      this.sendingToServer = true;
      this.form.fileContents = "";
      const self = this;
      if (this.fileToUpload) {
        const res = await readFile(this.fileToUpload);
        this.form.fileContents = res.replace(/^.*,/, "");
      }
      const { ok, error, data } = await postData(this.addInfoURL, this.form);
      this.sendingToServer = false;
      if (ok) {
        if (data.result === "ok") {
          this.submitSuccess(data.emailKey);
        } else {
          this.submitError(data.error);
        }
      } else {
        this.submitError(error);
      }
    },

    submitSuccess(result) {
      this.isError = false;
      this.showDialog("Entry Added", result);
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
    },

    fileChanged(e) {
      if (e) {
        if (e.target.files.length > 0) {
          this.fileToUpload = e.target.files[0];
          this.form.originalFileName = this.fileToUpload.name;
        }
      }
    }
  }
};
</script>
