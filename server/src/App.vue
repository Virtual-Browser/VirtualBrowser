<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    const size = localStorage.getItem('size') || 'mini'
    document.body.classList.add('emphasize-' + size)
  }
}
</script>
