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
      <image-elem v-if="src" :src="src" :classname="classname" :total="total"/>
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
<script lang='ts'>
import { defineComponent } from 'vue';
import Loader from "@/functions/loader";
// import Sync from "@/functions/sync";
import Reader from "@/components/Reader/index.vue";
const loader = new Loader();
// const sync = new Sync();

interface SrcResult {
  0: number;
  1: string;
  2: string;
}

export default defineComponent({
  data () {
    return {
      dropped: false,
      dragging: false,
      total: 0,
      src: [[0, '', '']] as SrcResult[],
      classname: "full_height"
      // classname:'full_width'
    };
  },
  components: {
    "image-elem": Reader
  },
  methods: {
    onDrop (e: Event & {dataTransfer: DataTransfer; target: {files: File[]}}) {
      const droppedFiles = [];
      const tdt = typeof e.dataTransfer !== "undefined";
      const files = tdt ? e.dataTransfer.files : e.target.files;

      for (let f = 0; f < files.length; f++) {
        droppedFiles.push(files[f]);
      }

      // if (sync.get("dropZone") === null) {
      //   sync.set("dropZone", droppedFiles);
      // } else {
      //   // const prevFiles = sync.get("dropZone");
      //   droppedFiles.forEach((file) => {
      //     loader.read(file, (evt) => {
      //       this.src = evt;
      //     });
      //   });
      // }

      droppedFiles.forEach((file: File) => {
        loader.read(file, (evt: SrcResult[]) => {
          this.src = evt;
          if (evt?.length) {
            this.total = evt.length;
          }
        });
      });

      e.preventDefault();
      this.dragging = false;
      this.dropped = true;

      // this.uploadedFiles.push(e.dataTransfer.files);
    },

    onDragEnter (e: DragEvent) {
      this.dragging = true;
      e.preventDefault();
    },
    onDragLeave (e: DragEvent) {
      e.preventDefault();
      this.dragging = false;
    },
    onDragOver (e: DragEvent) {
      e.preventDefault();
    },
    onRadioChange (e: {target: {value: string}}) {
      this.classname = e.target.value;
    }
  }
});
</script>
<style scoped src="./styles.scss" lang="scss"></style>
