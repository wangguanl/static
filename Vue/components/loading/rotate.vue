<template>
    <div class="plugin-loading" v-show="display">
        <div class="mark"></div>
        <div class="loading">
            <div><span></span></div>
            <div><span></span></div>
            <div><span></span></div>
            <div><span></span></div>
            <div><span></span></div>
            <div><span></span></div>
            <div><span></span></div>
            <div><span></span></div>
            <div><span></span></div>
            <div><span></span></div>
            <div><span></span></div>
            <div><span></span></div>
            <div><span></span></div>
            <div><span></span></div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            display: true
        }
    }
}
</script>

<style scoped lang="scss">
.mark{
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: transparent;
    z-index: 998;
}
$loadingSize: 200px;    // Loading容器的大小
$dotRadius: 24px;       // 圆点半径  
$dotNums: 14;           // 圆点个数(需要和div.loading中子元素div个数对应起来)
$dotColor: #f36;        // 圆点颜色

.loading {
    width: $loadingSize;
    height: $loadingSize;
    color: $dotColor;
    transform-origin: center;

    div {
        color: $dotColor;
        width: $dotRadius;
        height: $dotRadius;
        margin-top: $dotRadius / 2;
        margin-left: $dotRadius / 2;

        @for $i from 1 through 14 {
            &:nth-child(#{$i}) {
                /*transform: translate(cos(($i - 1) * 360deg / $dotNums) * $loadingSize / 2, sin(($i - 1) * 360deg / $dotNums) * $loadingSize / 2);*/

                & > span {
                    animation-delay: -(1 + $i * 1 / $dotNums) * 1s
                }
            }
        }

        span {
            width: $dotRadius;
            height: $dotRadius;
            animation: ball-spin 1s infinite ease-in-out;  

            background-color: currentColor;
            border: 0 solid currentColor;
        }
    }
}
</style>