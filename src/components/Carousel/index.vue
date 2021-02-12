<template>
  <section class="carousel" @scroll="handleScroll">
    <div
      class="carousel-item"
      :class="{
        width100: classname == 'full_height',
        height100: classname == 'full_width',
        overflow_x: classname == 'full_height',
        overflow_y: classname == 'full_width'
      }"
      v-for="image in src"
      v-bind:key="image[0]"
    >
      <img
        :src="image[2]"
        :alt="image[1]"
        :index="image[0]"
        :class="{
          active: index == image[0],
          toRight: index < image[0],
          toLeft: index > image[0],
          full_height: classname == 'full_height',
          full_width: classname == 'full_width'
        }"
      />
    </div>
  </section>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
  props: ["src", "index", "classname"],
  data () {
    return {
      scrolling: -1
    };
  },
  watch: {
    index: function (n: number) {
      const el = document?.querySelector("[index='" + n + "']")?.parentElement;
      // el.scrollIntoView({ behavior: "smooth" });
      if (el) {
        el.scrollIntoView();
      }
    }
  },
  methods: {
    /**
     * Scroll handler
     * @param  {Event} ev Scrolling event
     */
    handleScroll () {
      const target = document.querySelector("[index='" + this.index + "']");
      const el = target?.parentElement;

      if (this.scrolling !== -1) {
        clearTimeout(this.scrolling);
      }

      this.scrolling = window.setTimeout(() => {
        /**
         * Check which sibling is visible
         * @type {Array}
         */
        try {
          if (el?.parentElement) {
            const visible = [
              ...el.parentElement.querySelectorAll(el.nodeName)
            ].find((sib) => {
              return sib.getBoundingClientRect().left >= 0;
            });

            const elPosX = visible?.getBoundingClientRect().x ?? 0;
            const prevPosX = (visible?.previousSibling as HTMLElement)?.getBoundingClientRect().x;

            if (elPosX > 0 && elPosX <= window.innerWidth / 2) {
              // eslint-disable-next-line
              // visible?.scrollIntoView({ behavior: "smooth" });
              this.$emit("scrolled", visible?.querySelector("img"));
            } else if (prevPosX < 0 && prevPosX > -window.innerWidth / 2) {
              const prevEl = visible?.previousSibling;
              // eslint-disable-next-line
              // (prevEl as HTMLElement)?.scrollIntoView({ behavior: "smooth" });
              this.$emit("scrolled", (prevEl as HTMLElement)?.querySelector("img"));
            }
          }
        } catch (e) {
          console.log(e.message);
        }
      }, 200);
    }
  }
});
</script>

<style scoped src="./styles.scss" lang="scss"></style>
