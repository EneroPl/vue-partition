<template>
  <div>
      <VuePartition v-model="options" :total="total" />
  </div>
</template>

<script>
import VuePartition from './../src/components/VuePartition.vue';

export default {
  components: { VuePartition },
  data() {
    return {
      options: [
        {
          value: 1000,
          settings: {
            background: '#999999'
          }
        }
      ],
      total: 1000
    };
  }
}
</script>

<style>

</style>