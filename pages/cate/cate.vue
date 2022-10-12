<template>
  <!-- 左 -->
  <view class="scroll-wrap">
    <scroll-view class="left-scroll" scroll-y="true" :style="{height:wh + 'px'}">
      <view :class="['cate-item', activeId === item.cat_id ? 'active-cate-item' :'']" v-for="item in cateList"
        :key="item.cat_id" @click="setActiveItemId(item.cat_id)">{{item.cat_name}}</view>
    </scroll-view>
    <!-- 右 -->
    <scroll-view class="right-scroll" scroll-y="true" :scroll-top="scrollTop" :style="{height:wh + 'px'}">
      <view class="right-scroll-container" v-for="item in cateLevel2" :key="item.cat_id">
        <view class="class-name">{{item.cat_name}}</view>
        <!-- icon和品名 -->
        <view class='brand-container'>
          <view class="brand-wrap" v-for="brand in item.children" :key="brand.cat_id" @click="toGoodsList(brand)">
            <image class="brand-img" :src="brand.cat_icon" mode="widthFix"></image>
            <text class="brand-text">{{brand.cat_name}}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
        wh: 0,
        cateList: [],
        activeId: 1,
        cateLevel2: [],
        scrollTop: 0
      };
    },
    onLoad() {
      // 获取当前设备的信息
      const systemInfo = uni.getSystemInfoSync()
      // 为 wh 窗口可用高度动态赋值
      this.wh = systemInfo.windowHeight
      this.getCateList()
    },
    methods: {
      async getCateList() {
        const res = await uni.$http('/api/public/v1/categories')
        this.cateList = res.message
        // 为二级分类赋值
        this.cateLevel2 = res.message[0].children
      },
      setActiveItemId(id) {
        this.activeId = id
        // 根据当前active id 重新赋值
        this.cateList.map(c => {
          if (c.cat_id === this.activeId) {
            this.cateLevel2 = c.children
          }
        })
        // 滚动框重新置顶
        this.scrollTop = this.scrollTop == 0 ? 1 : 0
      },
      toGoodsList(brand) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?cid=' + brand.cat_id
        })
      }
    }
  }
</script>

<style lang="scss">
  .scroll-wrap {
    display: flex;

    .left-scroll {
      width: 150rpx;

      .cate-item {
        height: 90rpx;
        text-align: center;
        line-height: 90rpx;
        background-color: #f7f7f7;
        font-size: 24rpx;

        &.active-cate-item {
          background-color: #ffffff;
          position: relative;

          &::before {
            content: ' ';
            display: block;
            width: 3px;
            height: 50rpx;
            background-color: #b00000;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }

    .right-scroll {
      .right-scroll-container {
        .class-name {
          text-align: center;
          margin-top: 30rpx;
          margin-bottom: 40rpx;
          font-weight: bold;
        }

        .brand-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-gap: 20rpx;

          .brand-wrap {
            display: flex;
            align-items: center;
            flex-direction: column;

            .brand-img {
              width: 150rpx;
            }
          }
        }
      }
    }
  }
</style>
