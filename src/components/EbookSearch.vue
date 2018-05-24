<template lang='pug'>
  div
    el-header(style='height: 120px')
      nav
        h1 台灣電子書搜尋
        el-input(
          v-model='searchKeyWord'
          placeholder='搜尋您想比價的電子書名關鍵字或ISBN'
          @keyup.enter.native='submitSearch'
        )
          el-button(@click='submitSearch' slot='append' icon='el-icon-search')

    el-main

      transition(name='el-fade-in-linear')
        book-loading(v-show='isLoading')

      .box-wrapper(v-for='(book, key) in books' :key='key')
        el-row.book
          el-col.company-name(:sm='24')
            span(v-if='booksCompanyTable[book.company] !== undefined')
              img.company-icon(
                :src='`/static/img/${book.company}.png`'
                :alt='booksCompanyTable[book.company]'
              )
              | {{ booksCompanyTable[book.company] }}
            span(v-else) {{ book.company }}
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
        books: [],
        isLoading: false,
      }
    },
    methods: {
      submitSearch() {
        this.books = []
        this.isLoading = true
        this.axios.get('https://ebook.yuer.tw/search', {
          params: {
            q: this.searchKeyWord
          }
        }).then((res) => {
          if (res.data) {
            console.log(res.data)
            this.searchSol = res.data
            _.each(this.searchSol, (books, company) => {
              try {
                if (books.length !== 0) {
                  _.each(books, (val, key) => {
                    let book = _.merge(val, { company: company })
                    console.log(book)
                    if (key === 0) {
                      this.books.unshift(book)
                    } else {
                      this.books.push(book)
                    }
                  })
                }
              } catch (error) {
                console.log(error)
              }
            })
            console.log(this.books)
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

  .el-input {
    padding: .5rem;
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
  a {
    color: $main_color;
    text-decoration: none;
  }
  h2, p {
    color: lighten(black, 20%);
  }

  .bookshelf-wrapper {
    margin-top: 180px;
  }
  .el-input__inner {
    border-right-width: 0;
  }
  .el-input-group__append {
    border-left-width: 0;
  }

  .book {
    padding: .5rem;
    margin-bottom: .5rem;
    background-color: #fff;

    background-color: #fff;
    margin-bottom: 15px;

    -webkit-box-shadow: 0 0 1px 0 rgba(0,0,0,.2), 0 1px 10px 0 rgba(0,0,0,.19);
            box-shadow: 0 0 1px 0 rgba(0,0,0,.2), 0 1px 10px 0 rgba(0,0,0,.19);

    transition: transform 300ms ease;

    &:hover,
    &:focus {
      -webkit-box-shadow: 0 0 1px 0 rgba(0,0,0,.2), 0 1px 10px 0 rgba(0,0,0,.19);
              box-shadow: 0 0 1px 0 rgba(0,0,0,.2), 0 1px 10px 0 rgba(0,0,0,.19);
      transform: translateY(-2px);
    }

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
