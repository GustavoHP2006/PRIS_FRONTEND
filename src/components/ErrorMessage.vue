<template>
  <div v-if="show" class="error-message">
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ message }}
      <button type="button" class="btn-close" @click="close" aria-label="Close"></button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      show: false,
      timeoutId: null
    };
  },
  watch: {
    message(newVal) {
      if (newVal) {
        this.show = true;
        this.autoClose();
      }
    }
  },
  methods: {
    close() {
      this.show = false;
      this.$emit('closed');
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
    },
    autoClose() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.timeoutId = setTimeout(() => {
        this.close();
      }, 5000);
    }
  }
};
</script>

<style scoped>
.error-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 300px;
  max-width: 90%;
  z-index: 9999;
}
</style>