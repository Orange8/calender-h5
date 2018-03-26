<!-- by xsj -->
<template>
  <div class="page">
    <div class="menu-button" :class="{ 'open': isMenuShow }" @click="toShowMenu">></div>
    <div class="menu-list" :class="{ 'open': isMenuShow }" ref="menuList">
       <ul>
         <h5>属性</h5>
         <li @click="toPosition('holidayList')">holidayList</li>
         <li @click="toPosition('signList')">signList</li>
         <li @click="toPosition('rememberPosition')">rememberPosition</li>
         <li @click="toPosition('eventName')">eventName</li>
         <li @click="toPosition('min')">min</li>
         <li @click="toPosition('max')">max</li>
         <h5>事件</h5>
         <li @click="toPosition('getProData')">getProData</li>
         <li @click="toPosition('closeCalender')">closeCalender</li>
       </ul>
    </div>
    <div class="api-list" ref="apiList" @click="isMenuShow = false">
      <ul>
        <h4>属性</h4>
        <li class="initDate">
          <h5>initDate</h5>
          <label>类型：Date(可被new Date()解析)</label>
          <span>默认值：系统时间</span>
          <p>作用：日历打开时默认高亮的时间。</p>
        </li>
        <li class="holidayList">
          <h5>holidayList</h5>
          <label>类型：array</label>
          <span>默认值：[]</span>
          <p>作用：节假日数组。具体数据格式参考data.json</p>
        </li>
        <li class="signList">
          <h5>signList</h5>
          <label>类型：array</label>
          <span>默认值：[]</span>
          <p>作用：自定义特殊事件数组。具体数据格式参考data.json</p>
        </li>
        <li class="rememberPosition">
          <h5>rememberPosition</h5>
          <label>类型：boolean</label>
          <span>默认值：true</span>
          <p>作用：日历高亮的日期是否为之前选择的日期, true表示日历高亮为之前选择的时间， false则日历高亮为当前系统时间</p>
        </li>
        <li class="eventName">
          <h5>eventName</h5>
          <label>类型：string</label>
          <span>默认值：'签'</span>
          <p>作用：自定义事件标志文案</p>
        </li>
        <li class="min">
          <h5>min</h5>
          <label>类型：Date(可被new Date()解析)</label>
          <span>默认值：-</span>
          <p>作用：可选择的时间最小值</p>
        </li>
        <li class="max">
          <h5>max</h5>
          <label>类型：Date(可被new Date()解析)</label>
          <span>默认值：-</span>
          <p>作用：可选择的时间最大值</p>
        </li>
        <h4>事件</h4>
        <li class="getProData">
          <h5>getProData</h5>
          <label>参数：-</label>
          <span>返回值：dataList</span>
          <p>作用：点击具体日期后返回数据dataList,点击年份区间中的年份后后返回选择的年份，点击月份区间中的月份后返回选择的月份</p>
        </li>
        <li class="closeCalender">
          <h5>closeCalender</h5>
          <label>参数：-</label>
          <span>返回值：-</span>
          <p>作用：日历组件关闭后的回调</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';

  export default {
    data() {
      return {
        isMenuShow: false
      };
    },
    created() {
      this.$nextTick(() => {
        this._initWheel('menuList', this.$refs.menuList);
        this._initWheel('apiList', this.$refs.apiList);
      });
    },
    methods: {
      _initWheel(name, dom) {
        this[name] = new BScroll(dom, {
          bounce: false,
          click: true,
          probeType: 2
        });
        if (name === 'apiList') {
          this[name].on('scroll', () => {
            this.isMenuShow = false;
          });
        }
      },
      toShowMenu() {
        this.isMenuShow = !this.isMenuShow;
      },
      toPage() {
        this.$router.push({ name: 'demo' });
      },
      toPosition(dom) {
        let position = this.$el.querySelector('.' + dom);
        this.apiList.scrollToElement(position, 300);
        this.isMenuShow = false;
      }
    }
  };
</script>

<style lang="sass" rel="stylesheet/sass" scoped>
  @import "api.sass"
</style>
