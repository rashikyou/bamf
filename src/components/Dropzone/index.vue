<template>
  <div>
    <div id="header">
      <div id="panel">
        <!--label style="display:inline-block">Percent</label-->
        <!--input style="display:inline-block;width:50px;margin-top:5px" type="text" value="100"/-->
        <input
          style="display:inline-block;width:50px;margin-top:10px"
          type="radio"
          value="full_width"
          id="full_width"
          name="view_size"
          v-on:change="onRadioChange"
          :checked="classname == 'full_width'"
        />
        <label style="display:inline-block" for="full_width">Full width</label>
        <input
          style="display:inline-block;width:50px;margin-top:10px"
          type="radio"
          value="full_height"
          id="full_width"
          name="view_size"
          v-on:change="onRadioChange"
          :checked="classname == 'full_height'"
        />
        <label style="display:inline-block" for="full_height">
          Full Height
        </label>
      </div>
    </div>
    <div
      id="dropzone"
      @drop.prevent="onDrop"
      @dragenter="onDragEnter"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      :class="{ active: dragging == true }"
    >
      <image-elem v-if="src" :src="src" :classname="classname" />
      <input
        type="file"
        v-if="!dropped"
        id="file"
        name="file"
        @change="onDrop"
      />
      <label id="msg" for="file" v-if="!dropped">
        To open a comic book file,<br />
        click anywere on the page,<br />
        or drop it anywere on the page.
      </label>
    </div>
  </div>
</template>
<script>
import Loader from "@/functions/loader";
import Sync from "@/functions/sync";
import Reader from "@/components/Reader";
const loader = new Loader();
const sync = new Sync();

export default {
  data () {
    return {
      dropped: false,
      dragging: false,
      src: "",
      classname: "full_height"
      // classname:'full_width'
    };
  },
  components: {
    "image-elem": Reader
  },
  methods: {
    onDrop (e) {
      const droppedFiles = [];
      const tdt = typeof e.dataTransfer !== "undefined";
      const files = tdt ? e.dataTransfer.files : e.target.files;

      for (let f = 0; f < files.length; f++) {
        droppedFiles.push(files[f]);
      }

      if (sync.get("dropZone") === null) {
        sync.set("dropZone", droppedFiles);
      } else {
        // const prevFiles = sync.get("dropZone");
        droppedFiles.forEach((file) => {
          loader.read(file, (evt) => {
            this.src = evt;
          });
        });
      }

      e.preventDefault();
      this.dragging = false;
      this.dropped = true;

      // this.uploadedFiles.push(e.dataTransfer.files);
    },

    onDragEnter (e) {
      this.dragging = true;
      e.preventDefault();
    },
    onDragLeave (e) {
      e.preventDefault();
      this.dragging = false;
    },
    onDragOver (e) {
      e.preventDefault();
    },
    onRadioChange (e) {
      console.log(e.target.value);
      this.classname = e.target.value;
    }
  }
};
</script>
<style scoped src="./styles.scss" lang="scss"></style>
