import { Block, Text, Button, View, Image } from '@tarojs/components'
import { AtNavBar } from 'taro-ui'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './photoUpload.scss'
const db = Taro.cloud.database()

@withWeapp({
  /**
   * 页面的初始数据
   */
  data: {
    uploadState: 0// 0 无图片 1 有图片 2 上传成功
  },

  handleClick: function () {
    Taro.navigateTo({
      url: '/pages/detail/detail'
    })
  },
  takePhoto: function (event) {
    Taro.chooseImage({
      count: 1,
      sizeType: 'original',
      sourceType: ["album", "camera"],
      success: (res) => {
        console.log(res.tempFilePaths)
        this.setData({
          uploadState: 1,
          tempUrl: res.tempFilePaths[0]
        })
      }
    })
  },
  upload: function () {
    Taro.cloud.uploadFile({
      cloudPath: `photoUpload/${new Date().getTime()}${this.data.tempUrl.match(/\.[^.]+$/)[0]}`,
      filePath: this.data.tempUrl,
      success: res => {
        console.log(res.fileID)
        this.setData({
          uploadState: 2,
          fileID: res.fileID
        })
      }
    })
  }
})
class _C extends React.Component {
  render() {
    return (
      <Block>
        <AtNavBar
          onClickRgIconSt={this.handleClick}
          color='#000'
          rightFirstIconType='bullet-list'
        >
          <View>图片上传</View>
        </AtNavBar>
        <Button type="primary" onClick={this.takePhoto}>
          选择图片
        </Button>
        <Image src={this.data.tempUrl} style={{ width: "100%" }} />
        {this.data.uploadState == 1 && <Button type="primary" onClick={this.upload}>
          确认上传
        </Button>}
        {this.data.uploadState == 2 &&
          <>
            <View>上传成功</View>
            <View>图片链接</View>
            <View>{this.data.fileID}</View>
          </>
        }
      </Block>
    )
  }
}

export default _C
