<!-- Circle是朋友圈页面-->
<template>
    <div class="circle">
        <Header
                title='朋友圈'
                :isLeft='true'
                btn_icon='camera'
                @rightClick="$router.push('/publish')"
        ></Header>
        <div class="container">
            <!-- <div class="scroll-wrap"> -->
            <Scroll
                    ref="pullrefresh"
                    @pulldown="loadData"
                    @pullup="loadMore">
                <div class="head_wrapper">
                    <div class="user_head">
                        <span>{{ user.name }}</span>
                        <div class="user_img">
                            <img :src="user.avatar" alt="" class="head_img">
                        </div>
                    </div>
                </div>
                <div class="content_wrapper">
                    <Cell
                            v-for="(cricle, index) in cricleList"
                            :key="index"
                            :cricleObj='cricle'
                    ></Cell>
                </div>
            </Scroll>
            <!-- </div> -->
        </div>
    </div>
</template>

<script>
    import Header from "../components/Header";
    import jwt_decode from "jwt-decode";
    import Cell from "../components/Cell2";
    import Scroll from "../components/Scroll";

    export default {
        name: "fcircle",
        data() {
            return {
                cricleList: [],         //
                page: 2, // 加载更多从page2开始
                size: 3, // 每次请求3条数据
                loading: false
            };
        },
        components: {
            Header,
            Cell,
            Scroll
        },
        computed: {
            // 拿到token，然后解析token。
            user() {
                const token = localStorage.wxToken;
                // 解析token
                const decode = jwt_decode(token);
                return decode;
            }
        },
        created() {
            // 获取朋友圈的数据
            this.getLatestData();
        },
        methods: {
            getLatestData() {
                if (this.loading) return;
                this.loading = true;
                this.$axios("/api/profile/latest").then(res => {
                    this.loading = false;
                    this.cricleList = [...res.data];    //

                    // 注册事件pullrefresh，解决重置问题。
                    // 这里的refresh让子组件Scroll.vue触发
                    this.$refs.pullrefresh.$emit("refresh");
                });
            },
            // pulldown触发的事件
            loadData() {
                //下拉刷新重新初始化
                this.page = 2;
                this.getLatestData();
            },
            // pullup触发的事件
            loadMore() {
                this.getMoreData();
            },
            getMoreData() {
                if (this.loading) return;
                // 发送axios请求
                this.loading = true;
                this.$axios(`/api/profile/${this.page}/${this.size}`).then(res => {
                    this.loading = false;
                    const result = [...res.data];
                    if (result.length > 0) {
                        // 拿到结果数据进行遍历 push到列表数组中，并且page+1
                        //this.$refs.pullrefresh.$emit("infinitescroll.reInit");
                        result.forEach(item => {
                            this.cricleList.push(item);
                        });
                        this.page++;
                    } else {
                        // 数组为空，没有更多数据，page不再递增
                        this.$refs.pullrefresh.$emit("loadedDone");
                    }
                });
            }
        }
    };
</script>
<style scoped>
    .circle {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    }
    .container {
        width: 100%;
        height: calc(100% - 50px);
        padding-top: 50px;
        overflow: auto;
    }
    .head_wrapper {
        width: 100%;
        position: relative;
        height: 200px;
        background: url(../assets/cricle_bg.png) no-repeat;
        background-size: 100% 100%;
    }
    .head_wrapper .user_head {
        position: absolute;
        bottom: -30px;
        right: 16px;
    }
    .user_img {
        width: 60px;
        height: 60px;
        padding: 3px;
        border: 1px solid #c5c5c5;
        box-sizing: border-box;
    }
    .user_head img {
        width: 100%;
        height: 100%;
    }
    .user_head span {
        line-height: 30px;
        position: absolute;
        right: 76px;
        width: 200px;
        text-align: right;
        color: white;
    }
    .content_wrapper {
        padding-top: 20px;
    }
</style>

