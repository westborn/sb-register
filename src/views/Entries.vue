<template>
  <v-form v-model="valid" ref="entryForm">
    <v-container>
      <v-layout row>
        <v-flex xs6 offset-xs1>
          <v-text-field
            v-model="title"
            :rules="nameRules"
            :counter="40"
            label="Title for this work"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs6 offset-xs1>
          <v-text-field prefix="$" v-model="price" label="Sale Price" required></v-text-field>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs6 offset-xs1>
          <v-radio-group v-model="inOrOut">
            <v-radio label="Indoor" value="Indoor"></v-radio>
            <v-radio label="Outdoor" value="Outdoor"></v-radio>
          </v-radio-group>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs6 offset-xs1>
          <v-text-field
            v-model="material"
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
            v-model="size"
            :rules="nameRules"
            :counter="40"
            label="Approx Size"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs6 offset-xs1>
          <v-textarea v-model="description" label="Description (25 words max)" required></v-textarea>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs6 offset-xs1>
          <v-text-field v-model="specialReqs" label="Special Requirements"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs6 offset-xs1>
          <v-text-field v-model="placement" label="Placement preference (optional)"></v-text-field>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs3 offset-xs1>
          <label
            for="file-upload"
            class="v-btn v-btn--flat info"
          >Click to Select Image File to Upload</label>
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
          <v-text-field disabled v-model="originalFileName" label="File to be Uploaded"></v-text-field>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs6 offset-xs1>
          <v-btn @click="submit" class="primary" :disabled="!valid || loading">Add this piece?</v-btn>
          <div v-if="loading">
            <v-progress-linear :indeterminate="true"></v-progress-linear>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import { fileURLToPath } from "url";

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
    addInfoURL:
      "https://script.google.com/macros/s/AKfycbzVZQtxm3XbHoBzLIVVD-7Ds_WIkGrjO8se4q-GzEGxyT1rg9fH/exec",
    email: "george@westborn.com.au",
    loading: false,
    valid: false,
    title: null,
    price: null,
    inOrOut: "Indoor",
    material: null,
    size: null,
    description: null,
    specialReqs: null,
    placement: null,
    fileToUpload: null,
    originalFileName: null,
    nameRules: [
      v => !!v || "You need to enter something here",
      v => (v && v.length >= 2) || "You need to enter at least 2 characters"
    ]
  }),
  methods: {
    submit() {
      if (this.$refs.entryForm.validate()) {
        const formFields = {
          email: this.email,
          title: this.title,
          price: this.price,
          inOrOut: this.inOrOut,
          material: this.material,
          size: this.size,
          description: this.description,
          specialReqs: this.specialReqs,
          placement: this.placement,
          originalFileName: this.originalFileName,
          fileContents: null
        };

        this.loading = true;
        const self = this;
        if (this.fileToUpload) {
          const fr = new FileReader();
          fr.onload = function(e) {
            formFields.fileContents = e.target.result.replace(/^.*,/, "");
            postData(
              "https://script.google.com/macros/s/AKfycbzVZQtxm3XbHoBzLIVVD-7Ds_WIkGrjO8se4q-GzEGxyT1rg9fH/exec",
              {
                method: "post",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(formFields)
              }
            ).then(res => {
              // console.log(self);
              self.loading = false;
              self.$refs.entryForm.reset();
            });
          };
          fr.readAsDataURL(this.fileToUpload);
        } else {
          formFields.fileContents = "";
          formFields.originalFileName = "";
          postData(
            "https://script.google.com/macros/s/AKfycbzVZQtxm3XbHoBzLIVVD-7Ds_WIkGrjO8se4q-GzEGxyT1rg9fH/exec",
            {
              method: "post",
              headers: { "Content-Type": "text/plain;charset=utf-8" },
              body: JSON.stringify(formFields)
            }
          ).then(res => {
            self.loading = false;
            self.$refs.entryForm.reset();
            console.log(self);
          });
        }
      }
    },

    fileChanged(e) {
      if (e) {
        if (e.target.files.length > 0) {
          this.fileToUpload = e.target.files[0];
          this.originalFileName = this.fileToUpload.name;
        }
      }
    }
  }
};
</script>
