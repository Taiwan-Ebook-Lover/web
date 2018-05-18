<template lang='pug'>
  div
    el-header
      nav
        h1 台灣電子書搜尋
    el-main
      
      el-input.input-with-select(
        v-model='searchKeyWord'
        placeholder='搜尋您想比價的電子書名關鍵字' 
        @keyup.enter.native='submitSearch'
      )
        el-button(@click='submitSearch' slot='append' icon='el-icon-search')
      hr
      transition(name='el-fade-in-linear')
        book-loading(v-show='isLoading')

      .box-wrapper(v-for='(company, companyName) in searchSol' :key='companyName')
        el-row.book(v-for='(book, bookId) in company', :key='bookId')
          el-col.company-name(:sm='24')
            span(v-if='booksCompanyTable[companyName] !== undefined')
              img.company-icon(
                :src='`/static/img/${companyName}.png`'
                :alt='booksCompanyTable[companyName]'
              )
              | {{ booksCompanyTable[companyName] }}
            span(v-else) {{ companyName }}
          el-col.image(:sm='6')
            img(:src='book.thumbnail' :alt='book.title')
          el-col.info(:sm='18')
            .boot-title
              a(:href='book.link', target='_blank') {{ book.title }}
            p.hidden-xs-only {{ book.about.substr(0, 200) + '...' }}
            
            span.price.hidden-xs-only {{ book.price }} {{ book.priceCurrency }}
          el-col.mobile-price.hidden-sm-and-up(:xs='24')
            span {{ book.price }} {{ book.priceCurrency }}

</template>

<script>
  import RingLoader from 'vue-spinner/src/RingLoader'
  import BookLoading from './BookLoading'

  export default {
    name: 'ebook-table',
    components: {
      'vue-spinner': RingLoader,
      'book-loading': BookLoading,
    },
    data () {
      return {
        searchKeyWord: '',
        booksCompanyTable: {
          booksCompany: '博客來',
          readmoo: 'Readmoo 讀墨',
          kobo: 'Rakuten kobo',
          taaze: 'TAAZE 讀冊生活',
          bookWalker: 'BOOKWALKER',
          playStore: 'Google Play 圖書',
          pubu: 'Pubu 電子書城'
        },
        searchSol: {},
        isLoading: false,
      }
    },
    methods: {
      submitSearch() {
        this.searchSol = {}
        this.isLoading = true
        this.axios.get('https://ebook.yuer.tw/search', {
          params: {
            q: this.searchKeyWord
          }
        }).then((res) => {
          if (res.data) {
            console.log(res.data)
            this.searchSol = res.data
            // for(let index in res.data) {
            //   this[index] = res.data[index]
            // }
            this.isLoading = false
          }
        }).catch((err) => {
          if (err.msg) {
            console.log(err)
            this.isLoading = false
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  $main_color: #03A9F4;
  $font_color: #333;

  header {
    padding: 0;
  }
  main {
    padding: 1.2rem 1rem;
  }
  
  nav {
    background-color: $main_color;
    color: #eee;
    
    h1 {
      margin: 0;
      padding: 1rem;
      font-size: 1.4rem;
    }
  }
  .bookshelf-wrapper {
    margin-top: 180px;
  }

  a {
    color: $main_color;
    text-decoration: none;
  }

  h2, p {
    color: lighten(black, 20%);
  }

  .book {
    padding: .5rem;
    margin-bottom: .5rem;
    background-color: #fff;

    background-color: #fff;
    margin-bottom: 15px;
    -webkit-box-shadow: 0 0 1px 0 rgba(0,0,0,.2), 0 1px 10px 0 rgba(0,0,0,.19);
    box-shadow: 0 0 1px 0 rgba(0,0,0,.2), 0 1px 10px 0 rgba(0,0,0,.19);

    .company-name {
      margin-top: .5rem;
      margin-bottom: 1rem;
      color: $font_color;
      span {
        display: flex;
        align-items: center;
      }
      .company-icon {
        width: 30px;
        padding-right: .3rem;
      }
    }
    
    .image {
      img {
        width: 180px;
        height: 220px;

        display: block;
        margin: 0 auto;
        padding: 4px;

        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
    }
    .info {
      // position: relative;
      padding: 1rem 2rem;
      .boot-title {
        font-size: 1.4rem;
      }
      .price {
        font-size: 2rem;

        position: absolute;
        bottom: 1rem;
        right: 1rem;
      }
    }
    .mobile-price {
      display: flex;
      justify-content: flex-end;
      span {
        font-size: 1.4rem;
      }
    }
  }

</style>
