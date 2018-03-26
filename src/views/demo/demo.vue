<!-- by xsj -->
<template>
  <div class="page">
    <div class="demo-title">
      <div @click="showCalender = true">📅</div>
      <div>实时日期:{{dateChoose}}</div>
    </div>
    <Calender
      v-model="showCalender"
      @getProData="getProData"
      initDate="2016-01-01"
      min="2015-01-01"
      max="2019-01-01"
      :holidayList="holidayList"
      :signList="signList">
    </Calender>
  </div>
</template>

<script type="text/ecmascript-6">
  import Calender from '../../components/calender/calender.vue'; // Calender组件

  export default {
    components: { Calender },
    data() {
      return {
        holidayList: [],
        signList: [],
        dateChoose: '',
        showCalender: false
      }
    },
    created() {
      this._getDataList();
    },
    methods: {
      //获取节假日，签到日期
      _getDataList() {
        this.$http.get('/api/areaJson').then((res) => {
          this.holidayList = res.data.data.holidayList;
          this.signList = res.data.data.signList;
        });
      },
      //获取选择的日期
      getProData(dataList) {
        this.dateChoose = dataList.queryTime;
      },
    }
  };
</script>

<style lang="scss" scoped>
  @import "demo.scss"
</style>
