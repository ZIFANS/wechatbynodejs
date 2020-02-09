<template>
    <div>
        <Header
                title='我的'>
        </Header>
        <div class="container">
            <div class="cell_wrapper">
                <div class="cell_title" v-if="user">
                    <img :src="user.avatar" alt="">
                    <span>{{user.name}}</span>
                </div>
            </div>
            <div class="btn_wrapper">
                <YButton @click="logout">退出登录</YButton>
            </div>
        </div>
    </div>
</template>

<script>
    import Header from "../components/Header";
    import jwt_code from 'jwt-decode'
    import YButton from '../components/YButton'
    export default {
        name: "mine",
        methods:{
            logout() {
                localStorage.removeItem("wxToken");
                this.$router.push('/login');
            }
        },
        computed: {
            // 拿到token，然后解析token。
            user() {
                const token = localStorage.wxToken;
                // 解析token
                const decode = jwt_code(token);
                return decode;
            }
        },
        components: {
            Header,
            YButton
        }
    };
</script>

<style scoped>
    .mine {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .container {
        width: 100%;
        height: calc(100% - 50px);
        margin-top: 50px;
    }
    .cell_wrapper {
        background-color: #fff;
        box-sizing: border-box;
        color:inherit;
        min-height: 80px;
        display: flex;
        font-size: 16px;
        line-height: 1;
        overflow: hidden;
        padding: 0 8px;
        width: 100%;
        line-height: 80px;
        border-top: 1px solid #d9d9d9;
        border-bottom: 1px solid #d9d9d9;
    }
    .cell_title {
        flex: 1;
    }
    .cell_title img {
        width: 4rem;
        height: 4rem;
        vertical-align: middle;
        margin-right: 0.6rem;
    }
    .cell_title span {
        display: inline-block;
        vertical-align: middle;
    }
    .btn_wrapper {
        box-sizing: border-box;
        padding: 20px;
    }
</style>
