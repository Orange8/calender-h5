<template>
  <div v-show="isShow" class="xsj-calender" @touchmove.prevent @mousewheel.prevent>
    <div class="xsj-mask" @click="toClose"></div>
    <transition>
      <div class="xsj-calender-contain">
        <!-- 切换普通日期 -->
        <template v-if="timeChooseType=='date'">
          <div class="xsj-choose">
            <span class="xsj-choose-year">
              <!-- <i class="xsj-past" @click="_chooseYear('past')">&lt;</i> -->
              <i class="xsj-thisYear" @click="_chooseYear('this')">{{thisYear}}年</i>
              <!-- <i class="xsj-next" @click="_chooseYear('next')">&gt;</i> -->
            </span>
            <span class="xsj-choose-today">
              <i class="xsj-today" @click="_today">今天</i>
            </span>
            <span class="xsj-choose-month">
              <!-- <i class="xsj-past" @click="_chooseMonth('past')">&lt;</i> -->
              <i class="xsj-thisMonth" @click="_chooseMonth('this')">{{thisMonth}}月</i>
              <!-- <i class="xsj-next" @click="_chooseMonth('next')">&gt;</i> -->
            </span>
          </div>
          <div class="xsj-weeks">
            <span class="xsj-weekends">日</span>
            <span>一</span>
            <span>二</span>
            <span>三</span>
            <span>四</span>
            <span>五</span>
            <span class="xsj-weekends">六</span>
          </div>
          <div
            ref="dataList"
            class="xsj-date-list"
            @touchstart="_flipStart"
            @touchmove.prevent="_flipMove"
            @touchend="_flipEnd">
            <div
              v-for="(items, index) in calenderDateList"
              class="xsj-date">
              <span
                v-for="(item, index) in items"
                :class="item.id"
                @click="_signIn(item, '', $event)">
                <i v-if="item.signIn" class="xsj-signIn">{{eventName}}</i>
                <i v-if="item.holiday" class="xsj-holiday">休</i>
                <i v-if="item.repair" class="xsj-repair">班</i>
                <i v-if="item.holiday" class="xsj-holidayaName">{{item.message.holidayName}}</i>
                {{item.day}}
              </span>
            </div>
          </div>
        </template>
        <!-- 选择年份 -->
        <template v-if="timeChooseType=='year'">
          <div class="xsj-choose">
            <!-- <span class="xsj-choose-year">
              <i class="xsj-past" @click="_chooseYear('pastInterval')">&lt;</i>
            </span> -->
            <span class="xsj-choose-yearInterval">
              {{thisYear}}年 - {{yearInterval}}年
            </span>
            <!-- <span class="xsj-choose-month">
              <i class="xsj-next" @click="_chooseYear('nextInterval')">&gt;</i>
            </span> -->
          </div>
          <div
            ref="dataList"
            class="xsj-year-list"
            @touchstart="_flipStart"
            @touchmove.prevent="_flipMove"
            @touchend="_flipEnd">
            <div
              v-for="(items, index) in calenderDateList"
              class="xsj-date">
              <span
                v-for="(item, index) in items.yearList"
                class="xsj-yearList"
                @click="_signIn(item, 'chooseYear')">
                {{item.year}}年
              </span>
            </div>
          </div>
        </template>
        <!-- 选择月份 -->
        <template v-if="timeChooseType=='month'">
          <div class="xsj-choose">
            <!-- <span class="xsj-choose-year">
              <i class="xsj-past" @click="_chooseYear('past')">&lt;</i>
            </span> -->
            <span class="xsj-choose-yearInterval" @click="_chooseYear('this')">
              {{thisYear}}年
            </span>
            <!-- <span class="xsj-choose-month">
              <i class="xsj-next" @click="_chooseYear('next')">&gt;</i>
            </span> -->
          </div>
          <div
            ref="dataList"
            class="xsj-month-list"
            @touchstart="_flipStart"
            @touchmove.prevent="_flipMove"
            @touchend="_flipEnd">
            <div
              v-for="(items, index) in calenderDateList"
              class="xsj-date">
              <span
                v-for="(item, index) in items.monthList"
                :class="item.id"
                @click="_signIn(item, 'chooseMonth')">
                {{item.monthCNY}}月
              </span>
            </div>
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'xsj-calender',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    holidayList: {
      type: Array,
    },
    signList: {
      type: Array,
    },
    rememberPosition: {
      type: Boolean,
      default: true,
    },
    initDate: {
      default: new Date().toLocaleDateString(),
    },
    initMonth: {
      type: String,
      default: String(new Date().getMonth()+1),
    },
    initDay: {
      type: String,
      default: String(new Date().getDate()),
    },
    eventName: {
      type: String,
      default: '签'
    },
    min: {},
    max: {},
  },
  data(){
    return {
      today: new Date().getDate(),
      today_year: new Date().getFullYear(),
      today_month: new Date().getMonth()+1,
      thisYear: null,
      thisMonth: null,
      thisDay: null,
      isLeapear: 0,
      monthDate: [], // 今年月份列表
      calenderDate: [],
      calenderDateList: [],
      data: {}, //备用对象集合
      params: '', //选择日期后回调参数
      timeChooseType: 'date', //时间选择类型 (选择年year 选择月month 选择普通日期date)
      yearInterval: '', //时间区间末尾时间
      isShow: false, //是否显示日历组件
    }
  },
  watch: {
    isShow(val) {
      this.$emit('input', val);
      if (!this.rememberPosition) {
        this.thisYear = this._formatDate(this.initDate)[0];
        this.thisMonth = this._formatDate(this.initDate)[1];
        this.thisDay = this._formatDate(this.initDate)[2];
      }
      this._initFn();
    },

    value(val) {
      this.isShow = val;
    }
  },
  created() {
    // 初始化高亮日期
    this.thisYear = this._formatDate(this.initDate)[0];
    this.thisMonth = this._formatDate(this.initDate)[1];
    this.thisDay = this._formatDate(this.initDate)[2];
  },
  methods: {
    _initFn() {
      this.calenderDate = [];
      this.calenderDateList = [];
      this._isLeapear(this.thisYear);
      this._fillingDate();
    },
    _toDate(date) {
      return this._isDate(date) ? new Date(date) : null;
    },
    _isDate(date) {
      if (date === null || date === undefined) return false;
      if (isNaN(new Date(date).getTime())) return false;
      return true;
    },
    _formatDate(date) {
      date = this._toDate(date);
      if (!date) return '';
      return new Date(date).toLocaleDateString().split('/');
    },
    // 判断是否为闰年
    _isLeapear(year) {
      year%100==0?this.isLeapear=(year%400==0?1:0):this.isLeapear=(year%4==0?1:0)
      return this.monthDate = [31, 28+this.isLeapear, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    },
    // 填充日历
    _fillingDate() {
      let firstDay_week = new Date(this.thisYear, this.thisMonth-1, 1).getDay()+1;
      let passDay = firstDay_week - 1;
      let futureDay = '';
      let num = 0;
      let num1 = 0;
      let num2 = 0;
      for (let i = 1; i <= 42; i++) {
        // 判断本月一号是否为第一天
        if (i < firstDay_week) {
          // 将上月日期填充到空格
          passDay--;
          let lastMonth = '';
          let thisYear = '';
          let thisMonth = '';
          let thisDay = '';
          this.thisMonth-2<0?lastMonth=(this.thisMonth-2==-2?12:11):lastMonth=this.thisMonth-2;
          this.thisMonth == 1 ? thisYear = this.thisYear - 1 : thisYear = this.thisYear;
          this.thisMonth == 1 ? thisMonth = 12 : thisMonth = this.thisMonth - 1;
          thisDay = this.monthDate[lastMonth] - passDay;
          let data = {
            id: 'xsj-past',
            year: thisYear,
            month: thisMonth,
            day: thisDay
          }
          //判断节假日及签到日期
          this._specialDate(this.signList, this.holidayList, thisYear, thisMonth, thisDay, data);
          this.calenderDate.push(data);
        } else {
          ++num;
          // 将下月日期填充到剩余空格
          let nextMonth = '';
          let thisYear = '';
          let thisMonth = '';
          this.thisMonth-1<0?nextMonth=11:nextMonth=(this.thisMonth-1);
          this.thisMonth == 12 ? thisYear = this.thisYear + 1 : thisYear = this.thisYear;
          this.thisMonth == 12 ? thisMonth = 1 : thisMonth = this.thisMonth + 1;
          if (num > this.monthDate[nextMonth]) {
            ++num1;
            let data = {
              id: 'xsj-future',
              year: thisYear,
              month: thisMonth,
              day: num1
            }
            //判断节假日及签到日期
            this._specialDate(this.signList, this.holidayList, thisYear, thisMonth, num1, data);
            this.calenderDate.push(data);
          } else {
            // 判断是否为今天
            if (this.thisYear == this.today_year && this.thisMonth == this.today_month && num == this.today) {
              let data = {
                id: 'xsj-now xsj-today',
                year: this.thisYear,
                month: this.thisMonth,
                day: num
              }
              if (num == Number(this.thisDay)) {
                data.id = 'xsj-now xsj-today xsj-choose-day'
              } else {
                data.id = 'xsj-now xsj-today'
              }
              //判断节假日及签到日期
              this._specialDate(this.signList, this.holidayList, this.thisYear, this.thisMonth, num, data);
              this.calenderDate.push(data);
            } else {
              let data = {
                id: 'xsj-now',
                year: this.thisYear,
                month: this.thisMonth,
                day: num
              }
              if (num == Number(this.thisDay)) {
                data.id = 'xsj-now xsj-choose-day';
              } else {
                //若选择的日期小于当月最大日期，则当月最大日期高亮
                if ((this.monthDate[nextMonth] < Number(this.thisDay)) && (num == this.monthDate[nextMonth])) {
                  data.id = 'xsj-now xsj-choose-day';
                } else {
                  data.id = 'xsj-now';
                }
              }
              //判断节假日及签到日期
              this._specialDate(this.signList, this.holidayList, this.thisYear, this.thisMonth, num, data);
              this.calenderDate.push(data);
            }
          }
        }
        if (i%7 == 0) {
          let dataList = {};
          dataList = this.calenderDate;
          //添加周末标识
          dataList[0].weekends = true;
          dataList[dataList.length-1].weekends = true;
          dataList[0].id = dataList[0].id + ' xsj-weekends';
          dataList[dataList.length-1].id = dataList[dataList.length-1].id + ' xsj-weekends';
          this.calenderDateList.push(dataList);
          this.calenderDate = [];
        }
      }
    },
    //判断已签到的日期及节假日
    _specialDate(signList, holidayList, thisYear, thisMonth, thisDay, data) {
      //判断已签到的日期
      if (signList && signList.length > 0) {
        for (let s = 0; s < signList.length; s++) {
          let d = new Date();
          d.setTime(signList[s].addTime);
          if (thisYear == (d.getFullYear()) && thisMonth == (d.getMonth()+1) && thisDay == (d.getDate())) {
            data.id = data.id + ' xsj-signIn';
            data.signIn = true;
            data.message = signList[s];
          }
        }
      }
      if (holidayList && holidayList.length > 0) {
        //判断节假日
        for (let h = 0; h < holidayList.length; h++) {
          if (thisYear == holidayList[h].year && thisMonth == String(Number(holidayList[h].month)) && thisDay == String(Number(holidayList[h].day))) {
            if (holidayList[h].status == 2) {
              data.id = data.id + ' xsj-holiday';
              data.holiday = true;
              data.message = holidayList[h];
            } else if (holidayList[h].status == 4) {
              data.id = data.id + ' xsj-repair';
              data.repair = true;
              data.message = holidayList[h];
            }
          }
        }
      }
    },
    //翻页手势-点击
    _flipStart(event) {
      var events = event.touches[0];
      this.data.posX = events.pageX; //获取触点的x轴位置
      this.data.markX = -1; //判断是否为正常翻页状态
      this.data.touching = false;//是否有滑动
    },
    //翻页手势-移动
    _flipMove(event) {
      var events = event.touches[0];
      this.data.newPosX = events.pageX;
      this.data.distanceX = this.data.newPosX - this.data.posX;
      this.data.touching = true;//是否有滑动
    },
    //翻页手势-抬起
    _flipEnd(event) {
      if (!this.data.touching) {
        return false;
      }
      //向右翻页(上个月)
      if(this.data.distanceX > 40 && this.data.markX == -1){
        this.data.markX = this.data.distanceX;
        if (this.timeChooseType == 'year') {
          this._chooseYear('pastInterval');
        }
        if (this.timeChooseType == 'month') {
          this._chooseYear('past');
        }
        if (this.timeChooseType == 'date') {
          this._chooseMonth('past');
        }
      }
      //向左翻页(下个月)
      if(this.data.distanceX < -40 && this.data.markX == -1){
        this.data.markX = this.data.distanceX;
        if (this.timeChooseType == 'year') {
          this._chooseYear('nextInterval');
        }
        if (this.timeChooseType == 'month') {
          this._chooseYear('next');
        }
        if (this.timeChooseType == 'date') {
          this._chooseMonth('next');
        }
      }
    },
    //选择年份
    _chooseYear(val) {
      // 去年
      if (val == 'past') {
        this.thisYear--;
        if (this.thisYear < 1) {
          this.thisYear = 1;
          if (this.timeChooseType == 'month') {
            this._chooseMonth('this');
          }
          return false;
        }
        if (this.timeChooseType == 'month') {
          this._chooseMonth('this');
        }
      }
      // 明年
      if (val == 'next') {
        this.thisYear++;
        if (this.timeChooseType == 'month') {
          this._chooseMonth('this');
        }
      }
      // 任意年
      if (val == 'this') {
        this.timeChooseType = 'year';
        this.$nextTick(() => {
          let year = +this.thisYear;
          let yearList = [];
          this.calenderDateList = [];
          for (let i = 1; i <= 15; i++) {
            yearList.push({'year':year});
            if (i%3==0) {
              this.calenderDateList.push({'yearList':yearList});
              yearList = [];
            }
            if (i == 15) {
              this.yearInterval = year;
            }
            year++;
          };
        });
        return false;
      }
      //年区间上
      if (val == 'pastInterval') {
        this.thisYear = Number(this.thisYear)-15;
        if (this.thisYear < 1) {
          this.thisYear = 1;
          this._chooseYear('this');
          return false;
        }
        this._chooseYear('this');
        return false;
      }
      //年区间下
      if (val == 'nextInterval') {
        this.thisYear = Number(this.thisYear)+15;
        this._chooseYear('this');
        return false;
      }
      this.calenderDate = [];
      this.calenderDateList = [];
      this._isLeapear(this.thisYear);
      this._fillingDate();
    },
    //选择月份
    _chooseMonth(val) {
      // 上个月
      if (val == 'past') {
        if (this.thisYear <= 1 && this.thisMonth <=1) {
          return false;
        }
        this.thisMonth--;
        if (this.thisMonth == 0) {
          this.thisMonth = 12;
          this.thisYear--;
        }
      }
      // 下个月
      if ( val == 'next') {
        this.thisMonth++;
        if (this.thisMonth == 13) {
          this.thisMonth = 1;
          this.thisYear++;
        }
      }
      // 任意月
      if (val == 'this') {
        this.timeChooseType = 'month';
        this.$nextTick(() => {
          let monthCNY = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
          let monthList = [];
          this.calenderDateList = [];
          for (let i = 1; i <= 12; i++) {
            monthList.push({'monthCNY':monthCNY[i-1], 'monthNum': i});
            if (i%4==0) {
              this.calenderDateList.push({'monthList':monthList});
              monthList = [];
            }
          };
        });
      }
      this.calenderDate = [];
      this.calenderDateList = [];
      this._isLeapear(this.thisYear);
      this._fillingDate();
    },
    // 今天
    _today() {
      this.calenderDate = [];
      this.calenderDateList = [];
      this.thisYear = this.today_year;
      this.thisMonth = this.today_month;
      this.thisDay = this.today;
      this._isLeapear(this.thisYear);
      this._fillingDate();
    },
    // 选择日期
    _signIn(data, type, el) {
      //如果日期大于最大值或小于最小值则不可点击
      let choose = new Date();
      let min = new Date();
      let max = new Date();
      choose.setFullYear(data.year,data.month-1,data.day);
      min.setFullYear(Number(this._formatDate(this.min)[0]),Number(this._formatDate(this.min)[1])-1,Number(this._formatDate(this.min)[2]));
      max.setFullYear(Number(this._formatDate(this.max)[0]),Number(this._formatDate(this.max)[1])-1,Number(this._formatDate(this.max)[2]));
      if (choose > max){
        return false;
      }
      if (choose < min){
        return false;
      }
      this.thisDay = data.day;
      if (type == 'chooseYear') {
        this.thisYear = data.year;
        this.timeChooseType = 'date';
        this.calenderDate = [];
        this.calenderDateList = [];
        this.thisMonth = this.thisMonth;
        this._isLeapear(this.thisYear);
        this._fillingDate();
      }else if (type == 'chooseMonth') {
        this.thisMonth = data.monthNum;
        this.timeChooseType = 'date';
        this.calenderDate = [];
        this.calenderDateList = [];
        this._isLeapear(this.thisYear);
        this._fillingDate();
      } else {
        if (data.signIn) {
          //查看历史签到项目信息
          let params = {
            isSign: data.signIn,
            queryTime: String(data.year) + '-' + String(data.month < 10 ? '0'+data.month : data.month) + '-' + String(data.day < 10 ? '0'+data.day : data.day)
          }
          this.params = params;
        }
        else {
          //补签
          let params = {
            isSign: false,
            queryTime: String(data.year) + '-' + String(data.month < 10 ? '0'+data.month : data.month) + '-' + String(data.day < 10 ? '0'+data.day : data.day)
          }
          this.params = params;
        }
        this.isShow = false;
        this.$emit('getProData', this.params);
        this.$emit('closeCalender');
      }
    },
    //关闭日历
    toClose() {
      this.isShow = false;
      this.$emit('closeCalender');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import 'calender.scss'
</style>
