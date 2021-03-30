let timer;
// 防抖节流函数
export function scroll(option) {
    let {
        el,
        time = 300,
        fn
    } = option;

    el.addEventListener('scroll', () => {

        let scrollHeightVal = el.scrollHeight,
            scrollTopVal = el.scrollTop,
            tbodyHeight = el.clientHeight;

        clearTimeout(timer);

        timer = setTimeout(() => {
            if (scrollTopVal + tbodyHeight > scrollHeightVal - 20) {
                fn && fn();
            }
        }, time);
    })
}
