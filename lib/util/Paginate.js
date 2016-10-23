class Paginate{
    constructor(total=0, page=1, rows=10) {
        this.rows = rows //每页显示的条数
        this.total = total// 总的数量
        if(this.total%this.rows == 0) {
            this.maxpage = parseInt(this.total/this.rows) //一共的分页数
        } else {
            this.maxpage = parseInt(this.total/this.rows) + 1
        }
        if(page > this.total) {
            this.page = this.total
        } else {
            this.page = page //当前页
        }
    }
    first () {
        const first = parseInt(this.page/this.rows) * this.rows
        if(first  <= 0) {
            return 1
        }
        return first //当前页第一个页面编号
    }
    last () {
        const last = this.first() + this.rows
        if(last>this.total){
            return this.total
        }
        return last //当前页最后一个页面编号
    }
    prev () {
        if(this.page <=1) {
            return false
        }
        return this.page-1
    }
    next () {
        if(this.page >= this.maxpage) {
            return false
        }
        return parseInt(this.page)+1
    }
}
module.exports = Paginate