<template>
  <div>
      <VuePartition v-model="options" :total="total" />
      <div>
        <p v-for="(item, index) in options" :key="index">
          #{{ index }}: {{ item.value }}
        </p>
        <p>Всего: {{ totalValues }}</p>
        <p>Не зарегестрированно: {{ totalValues - total }}</p>
      </div>
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
          value: 100,
          minValue: 10,
          styles: {
            background: "#999"
          }
        },
        {
          value: 100,
          minValue: 10,
          styles: {
            background: "#698B22"
          }
        },
        {
          value: 500,
          minValue: 10,
          editable: true,
          styles: {
            background: "#00CD66"
          }
        },
        {
          value: 100,
          minValue: 10,
          styles: {
            background: "#CD6600"
          }
        },
        {
          value: 100,
          minValue: 10,
          styles: {
            background: "#FF7F00"
          }
        },
        {
          value: 100,
          minValue: 10,
          styles: {
            background: "#FF1493"
          }
        },
      ],
      total: 1000
    };
  },
  computed: {
    totalValues() {
      return this.options.reduce((acc, item) => {
        acc += item.value;
        return acc;
      }, 0)
    }
  }
}
</script>

<style>

</style>