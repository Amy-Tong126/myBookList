const { default: axios } = require('axios');
const doubanbook = require('doubanbook');
const cheerio = require('cheerio');
// 获取豆瓣图书的信息
async function getDoubanBook(isbn) {
  const url = "https://search.douban.com/book/subject_search?search_text="+isbn;
  const res = await axios.get(url);
  const reg = /window\.__DATA__ = \"(.*)\"/;
  if (reg.test(res.data)) {
    const searchData = doubanbook(RegExp.$1)[0];
    const introduce = await axios.get(searchData.url);
    const $ = cheerio.load(introduce.data);
    const summary = $("#link-report .intro").text();
    console.log(summary);
    return {...searchData,summary}
  }else{
    return {}
  }
}

// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // event 接收传递的参数
  const {isbn} = event;
  console.log(isbn);
  const info = await getDoubanBook(isbn);
  return {
    cover_url:info.cover_url,
    abstract:info.abstract,
    title:info.title,
    rating:info.rating,
    summary:info.summary
  }
}