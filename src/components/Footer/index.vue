<template lang="html">
  <div id="footer" :class="{ open: src }">
    <nav>
      <li
        v-for="image in src"
        v-bind:key="image[0]"
        @click="onclick"
        @onTap="onclick"
      >
        <a
          :href="image[2]"
          :index="image[0]"
          :style="{ 'background-image': `url(${image[2]})` }"
          :alt="image[1]"
          :class="{ active: index == image[0] }"
        >
          <span>{{ image[0]+1 }}</span>
        </a>
      </li>
    </nav>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
  props: ["src", "index"],
  methods: {
    onclick (event: Event) {
      this.$emit("clicked", event.target);
      event.preventDefault();
    }
  }
});
</script>

<style scoped src="./styles.scss" lang="scss"></style>
