import { Block, View, Text, Image } from '@tarojs/components'
import { AtNavBar, AtCard } from "taro-ui"
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './detail.scss'
// miniprogram/pages/detail/detail.js
const db = Taro.cloud.database()

@withWeapp({
  /**
   * 页面的初始数据
   */
  data: {
    books: [],
    pageSize: 5,
    page: 1
  },

  getList: function () {
    const { pageSize, page } = this.data;
    db.collection('book').skip((page - 1) * pageSize).limit(pageSize).get({
      success: res => {
        console.log(res)
        this.setData({
          books: [...this.data.books, ...res.data]
        })
      }
    })
  },
  handleClick: function () {
    Taro.navigateTo({
      url: '/pages/book/book'
    })
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.getList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    }, () => {
      this.getList();
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { }
})
class _C extends React.Component {
  render() {
    const { books } = this.data
    return (
      <View>
        <AtNavBar
          onClickRgIconSt={this.handleClick}
          color='#000'
          rightFirstIconType='add-circle'
        >
          <View>图书列表</View>
        </AtNavBar>
        {books.map((item, index) => {
          return (
            <View style={{ marginBottom: "10px" }} key={item.id}>
              <AtCard
                note={item.abstract}
                title={item.title}
                thumb={item.cover_url}
              >
                {item.summary}
              </AtCard>
            </View>
          )
        })}
      </View>
    )
  }
}

export default _C
