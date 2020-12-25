import { Block, Text, Button, View, Image } from '@tarojs/components'
import { AtNavBar } from 'taro-ui'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './book.scss'
// miniprogram/pages/book/book.js
const db = Taro.cloud.database()

@withWeapp({
  /**
   * 页面的初始数据
   */
  data: {},

  scanCode: function () {
    Taro.scanCode({
      onlyFromCamera: true,
      scanType: [],
      success: result => {
        Taro.showLoading({
          title: '加载中...'
        })
        Taro.cloud.callFunction({
          name: 'book',
          data: {
            isbn: result.result
          },
          success: res => {
            console.log('success', res.result)
            res.result.create_time = new Date().getTime()
            this.setData({
              detail: res.result
            })
            db.collection('book').add({
              data: res.result
            })
            Taro.hideLoading()
          },
          fail: err => {
            console.log(err)
          }
        })
      },
      fail: res => { },
      complete: res => { }
    })
  },
  handleClick: function () {
    console.log('click')
    Taro.navigateTo({
      url: '/pages/detail/detail'
    })
  }
})
class _C extends React.Component {
  render() {
    const { title, cover_url, summary, abstract } = this.data.detail || {};
    return (
      <Block>
        <AtNavBar
          onClickRgIconSt={this.handleClick}
          color='#000'
          rightFirstIconType='bullet-list'
        >
          <View>图书添加</View>
        </AtNavBar>
        <Button type="primary" onClick={this.scanCode}>
          扫码添加图书
        </Button>
        {this.data.detail && <View className='at-article'>
          <View className='at-article__h1'>
            {title}
          </View>
          <View className='at-article__info'>
            {abstract}
          </View>
          <View className='at-article__content'>
            <Image
              className='at-article__img'
              src={cover_url}
              mode='widthFix' />
            <View className='at-article__p'>
              {summary}
            </View>
          </View>
        </View>}
      </Block>
    )
  }
}

export default _C
