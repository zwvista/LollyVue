<template>
  <iframe style="width:100%; height:500px" :src="url" :srcdoc="htmlString"></iframe>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
export default class DictBrowser extends Vue {
  @Prop() private url!: string;
  @Prop() private htmlString!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
