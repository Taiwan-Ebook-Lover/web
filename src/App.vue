<template lang='pug'>
  #app(v-cloak)
    EbookSearch
</template>

<script>
  import EbookSearch from './components/EbookSearch'

  export default {
    name: 'app',
    components: {
      EbookSearch,
    }
}
</script>

<style>
  @import url(https://fonts.googleapis.com/earlyaccess/notosanstc.css);

  * {
    font-family: 'Noto Sans TC', "Microsoft JhengHei", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue";
  }
  [v-cloak] {
    display: none;
  }
  body {
    margin: 0;
    background-color: #eee;
  }
  html, body, #app {
    width: 100%;
    height: 100%;
  }

</style>
