<template>
  <!--div class="reader" :class="{'adapt': width}"-->
  <div class="reader">
    <carousel
      :src="src"
      :index="index"
      @scrolled="setIndex"
      :classname="classname"
    >
    </carousel>
    <div
      v-if="total>0"
      style="background-color: #ffffff; position: absolute; z-index: 10; top: 0px; left: 35px; padding: 5px; border-style: solid; border-color: gray; border-radius: 5px; ">
      {{(index+1)}} / {{total}}
    </div>
    <footer-element :src="src" @clicked="setIndex" :index="index">
    </footer-element>
    <toaster :message="toasterMessage" :time="toasterTime"></toaster>
  </div>
</template>
<script lang='ts'>
import Footer from "@/components/Footer/index.vue";
import Carousel from "@/components/Carousel/index.vue";
import Toast from "@/components/Toast/index.vue";
import { listen } from "@/functions/listen";

import { defineComponent } from 'vue';

export default defineComponent({
  props: ["src", "classname", "total"],
  data () {
    return {
      index: 0,
      width: false,
      toasterMessage: "",
      toasterTime: 0
    };
  },
  components: {
    carousel: Carousel,
    "footer-element": Footer,
    toaster: Toast
  },
  methods: {
    setIndex (el: HTMLElement) {
      this.index = parseInt(el.getAttribute("index") ?? '0');
    },
    plusIndex () {
      this.index = this.index++;
    },
    minusIndex () {
      this.index = this.index--;
    },
    popup (message: string, time: number) {
      this.toasterMessage = message;
      this.toasterTime = time;
    }
  },
  mounted () {
    listen(window, "keyup", (e) => {
      let delta = 0;
      switch (e.keyCode) {
        case 33:// 37 = page up
          delta = -1;
          break;
        case 37:// 37 = left arrow
          delta = -1;
          break;
        case 34:// 39 = page down
          delta = 1;
          break;
        case 39:// 39 = right arrow
          delta = 1;
          break;
        case 87:// 87 = w
          this.width = !this.width;
          break;
      }

      if (e.keyCode === 188 && e.shiftKey) { // 188 = comma and <
        this.popup(`<p>Testing</p>`, 3000);
        console.log(this.toasterMessage, this.toasterTime);
      }

      this.index = Math.max(0, this.index + delta);
    });
  }
});
</script>

<style src="./styles.scss" lang="scss"></style>
