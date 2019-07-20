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
          <v-text-field
            v-model="price"
            :rules="nameRules"
            :counter="40"
            label="Sale Price"
            required
          ></v-text-field>
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
          >Click to Select Image File to Upload?</label>
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
          <v-btn @click="submit" class="primary">Add this piece?</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import { fileURLToPath } from "url";
export default {
  data: () => ({
    valid: false,
    title: "",
    price: "",
    inOrOut: "Indoor",
    material: "",
    size: "",
    description: "",
    specialReqs: "",
    placement: "",
    fileToUpload: "",
    originalFileName: "",
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
      if (this.$refs.entryForm.validate()) {
        console.log(this.title, this.price, this.inOrOut, this.material);
        console.log(this.fileToUpload);
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
