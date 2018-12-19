<template lang='pug'>
  v-app#inspire
    v-toolbar(color='primary', dark, app, tabs)
      v-text-field(
        v-model='searchKeyWord',
        v-if='searchFieldShow'
        name='input-1-3',
        color='accent',
        label='搜尋您想比價的電子書名關鍵字或ISBN',
        @keyup.enter.native='submitSearch'
        single-line=true,
        hide-details=true
      )
      v-toolbar-title(v-else) {{ searchKeyWord }}

      v-spacer(v-if='!searchFieldShow')
      v-btn(icon, v-if='!searchFieldShow', @click.stop='searchFieldShow = !searchFieldShow')
        v-icon search
      v-btn(icon, v-if='searchFieldShow', @click.stop='searchKeyWord = ""')
        v-icon clear

      v-tabs(slot='extension', v-model='tab', color='primary', grow)
        v-tabs-slider(color='accent')
        v-tab(key='綜合排名', @click='sortType(1)') 綜合排名
        v-tab(key='價格低至高', @click='sortType(2)') 價格低至高
        v-tab(key='價格高至低', @click='sortType(3)') 價格高至低

    v-content
      v-container(style='min-height: 0;', grid-list-xl, fluid)
        v-layout(row, wrap)
          book-loading(v-if='isLoading', style='margin-top: 180px')
          v-flex(xs12)
            v-card.card-info(v-for='(book, key) in books' :key='key', color='white', style='margin: 10px 0px;')
              v-container(grid-list-xl, fluid)
                v-layout(row, wrap)
                  v-flex.img-block(xs12, sm4, text-xs-center, text-sm-left)

                    img.book-img(
                      :src='book.thumbnail'
                      :alt='book.title'
                    )
                  v-flex.info-block(xs12, sm8, text-xs-center, text-sm-left)
                    .headline.boot-title
                      a(:href='book.link', target='_blank') {{ book.title }}
                    .company-name
                      span.hidden-xs-only(v-if='booksCompanyTable[book.company] !== undefined')
                        img.company-icon(
                          :src='`./static/img/${book.company}.png`'
                          :alt='booksCompanyTable[book.company]'
                        )
                        | {{ booksCompanyTable[book.company] }}
                      span(v-else) {{ book.company }}
                    p.book-info.hidden-xs-only(:title='book.about')
                      | {{ book.about ? book.about.substr(0, 150) + '...' : '' }}
                    v-layout(row)
                      span.hidden-sm-and-up(v-if='booksCompanyTable[book.company] !== undefined')
                        img.company-icon(
                          :src='`./static/img/${book.company}.png`'
                          :alt='booksCompanyTable[book.company]'
                        )
                        | {{ booksCompanyTable[book.company] }}
                      v-spacer
                      .price {{ book.price }} {{ book.priceCurrency }}
              v-card-actions
                v-spacer
                v-btn.hidden-sm-and-up(icon, @click.native='book.show = !(book.show)')
                  v-icon {{ book.show ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
              v-slide-y-transition.hidden-sm-and-up
                v-card-text(v-show='book.show')
                  p.book-info {{ book.about }}
</template>

<script>
  import BookLoading from './BookLoading'

  export default {
    name: 'ebook-table',
    components: {
      'book-loading': BookLoading,
    },
    data () {
      return {
        searchKeyWord: '台灣電子書搜尋',
        searchFieldShow: false,
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
        bestOrder: [],
        isLoading: false,
        drawer: false,
        tab: null,
      }
    },
    methods: {
      submitSearch() {
        if (this.searchKeyWord !== '') {
          this.books = []
          this.bestOrder = []
          this.isLoading = true
          this.searchFieldShow = false
          this.axios.get('https://ebook.yuer.tw/search', {
            params: {
              q: this.searchKeyWord
            }
          }).then((res) => {
            this.searchFieldShow = false
            if (res.data) {
              this.searchSol = res.data
              _.each(this.searchSol, (books, company) => {
                try {
                  if (books.length !== 0) {
                    _.each(books, (val, key) => {
                      let book = _.merge(val, { company: company, show: false })
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
              this.bestOrder = _.cloneDeep(this.books)
              this.isLoading = false
            }
          }).catch((err) => {
            if (err.msg) {
              console.log(err)
              this.isLoading = false
            }
          })
        }
      },
      sortType(type) {
        if (type === 1) {
          this.books = _.cloneDeep(this.bestOrder)
        }
        else if (type === 2) {
          this.books = _.orderBy(this.books, ['price'], ['asc'])
        }
        else if (type === 3) {
          this.books = _.orderBy(this.books, ['price'], ['desc'])
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  $main_color: #03A9F4;
  $font_color: #333;

  a {
    color: $main_color;
    text-decoration: none;
  }
  h2, p {
    color: lighten(black, 20%);
  }

  .card-info {
    font-size: 1.2rem;
    text-align: justify;

    .book-img {
      width: 180px;
      height: 220px;

      display: block;
      margin: 0 auto;
      padding: 4px;

      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .info-block {
      position: relative;
      .boot-title {
        font-size: 1.4rem;
      }
      .price {
        font-size: 2rem;
      }
      .company-name {
        margin-top: .5rem;
        margin-bottom: 1rem;
        color: $font_color;
        span {
          display: flex;
          align-items: center;
        }
      }
    }
    .company-icon {
      width: 30px;
      padding: .3rem;

      border-radius: 5px;
      border: 1px solid #eee;
      padding: 1px;
      margin-right: 10px;
    }
  }
</style>
