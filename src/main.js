import sum from './js/count'
import "./css/iconfont.css"
import './css/index.css'
import './less/index.less'
import './sass/index.sass'
let arr=[2,3,4,5]
let result=arr.reduce((p,n)=>{return p+n},0)
console.log(result);
console.log(sum(100))
if (module.hot) {
    module.hot.accept("./js/count.js", function (count) {
      const result1 = count(2, 1);
      console.log(result1);
    })
}