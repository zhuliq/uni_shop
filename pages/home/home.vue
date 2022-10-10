<template>
  <view>
    <!-- 轮播图 -->
    <swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="4000" :duration="1000" :circular="true">
      <swiper-item v-for="item in swiperList" :key="item.goods_id">
        <view class="swiper-item">
          <image :src="item.image_src"></image>
        </view>
      </swiper-item>
    </swiper>
    <!-- 分类导航 -->
    <view class="nav-list">
      <view class="nav-item" v-for="item in navList" :key="item.name" @click="navClickHandler(item)">
        <image :src="item.image_src" class='nav-img'></image>
      </view>
    </view>
    <!-- 楼层图片 -->
    <view class="floor-list">
      <view class="floor-item" v-for="item in floorList" :key="item.floor_title.name">
        <image :src="item.floor_title.image_src" class="img-title"></image>
        <view class="classes-list">
          <image v-for="(product, index) in item.product_list" :key="product.name" :src="product.image_src"
            :class="index == 0 ? 'main-img': ''" :style="{width:product.image_width + 'rpx'}" mode="widthFix"
            @click="toPage(product.url)"></image>
        </view>
      </view>
    </view>
  </view>

</template>

<script>
  export default {
    data() {
      return {
        // 轮播i图的数据列表
        swiperList: [],
        // 分类导航的数组
        navList: [],
        // 楼层图片的数组
        floorList: [],
      };
    },

    onLoad() {
      this.getSwiperList()
      this.getNavList()
      this.getFloorList()
    },

    methods: {
      async getSwiperList() {
        const res = await uni.$http('/api/public/v1/home/swiperdata')
        if (res.meta.status !== 200) return uni.$showMsg('轮播图数据请求失败！')
        this.swiperList = res.message
      },
      async getNavList() {
        const res = await uni.$http('/api/public/v1/home/catitems')
        if (res.meta.status !== 200) return uni.$showMsg('图标数据请求失败！')
        this.navList = res.message
      },
      async getFloorList() {
        const res = await uni.$http('/api/public/v1/home/floordata')
        if (res.meta.status !== 200) return uni.$showMsg('楼层图片数据请求失败！')
        res.message.forEach(item => {
          item.product_list.forEach(product => {
            product.url = '/subpkg/goods_list/goods_list?' + product.navigator_url.split('?')[1]
          })
        })
        this.floorList = res.message
      },
      navClickHandler(item) {
        if (item.name == '分类') {
          uni.switchTab({
            url: '/pages/cate/cate'
          })
        }
      },
      toPage(url){
        uni.navigateTo({
          url:url
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .swiper {
    height: 330rpx;

    .swiper-item,
    image {
      width: 100%;
      height: 100%;
    }
  }

  .nav-list {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    margin: 15rpx 0;

    .nav-img {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floor-list {
    .floor-item {
      width: 100%;

      .img-title {
        height: 60rpx;
        width: 100%;
        display: flex;
      }

      .classes-list {
        width: 100%;
        display: grid;
        grid-template-areas: 'a b c'
          'a d e';
        grid-auto-flow: row;
        justify-content: space-between;
        gap: 10rpx;
        justify-items: center;

        .main-img {
          grid-area: a;
        }
      }
    }
  }
</style>
