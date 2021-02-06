<template>
  <section  class="carousel" 
            @scroll="handleScroll">
    <div  class="carousel-item"
          :class="{
            width100  : classname == 'full_height', 
            height100 : classname == 'full_width',
            overflow_x: classname == 'full_height', 
            overflow_y: classname == 'full_width'
          }" v-for="image in src" v-bind:key="image[0]">
      <img :src="image[2]" :alt="image[1]" :index="image[0]"
           :class="{
              active : index == image[0],
              toRight: index  < image[0], 
              toLeft : index  > image[0], 
              full_height: classname == 'full_height',
              full_width : classname == 'full_width'
            }"
      />
    </div>
  </section>
</template>

<script>
export default {
  props: ['src','index', 'classname'],
  data() {
    return {
      scrolling: -1
    }
  },
  watch: {
    index: function(n,o) {
      const el = document.querySelector('[index="'+n+'"]').parentElement;
      // el.scrollIntoView({ behavior: "smooth" });
      el.scrollIntoView();
    }
  },
  methods: {
    /**
     * Scroll handler
     * @param  {Event} ev Scrolling event
     */
    handleScroll(ev) {
      const el = document.querySelector('[index="'+this.index+'"]').parentElement;

      if (this.scrolling != -1) {
        clearTimeout(this.scrolling);
      }

      this.scrolling = window.setTimeout(()=>{
        /**
         * Check which sibling is visible
         * @type {Array}
         */
        try{
          const visible = [...el.parentElement.querySelectorAll(el.nodeName)].find(sib => {
            return sib.getBoundingClientRect().left >= 0;
          });

          const elPosX = visible.getBoundingClientRect().x;
          const prevPosX = visible.previousSibling.getBoundingClientRect().x;

          if (elPosX > 0 && elPosX <= window.innerWidth/2) {
            visible.scrollIntoView({ behavior: "smooth" });
            this.$emit('scrolled', visible.querySelector('img'));
          } else if (prevPosX < 0 && prevPosX > -window.innerWidth/2) {
            const prevEl = visible.previousSibling;
            prevEl.scrollIntoView({ behavior: "smooth" });
            this.$emit('scrolled', prevEl.querySelector('img'));
          }
        }catch(e){
          console.log(e.message);
        }
      }, 200);
    },
  }
}
</script>

<style scoped src="./styles.scss" lang="scss"></style>
