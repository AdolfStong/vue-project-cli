/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-10-28 17:43:47
 * @LastEditors: Shentong
 * @LastEditTime: 2020-10-29 21:30:46
 */
// import axios from '@/api/axiosConfig'
import $http from '@/api'
// import Contants from '@/utils/contants'
const OSS = require('ali-oss')

// class GetFileCommentFn {
//   constructor(file) {
//     this.type = file.type
//     this.name = file.name
//   }

//   judgeFileType() {
//     const fileTypeArr = [
//       'image/jpg',
//       'image/jpeg',
//       'audio/mpeg',
//       'image/png',
//       'video/mp4',
//       'video/mov',
//       'video/FLV',
//       'video/rmvb'
//     ]
//     return fileTypeArr.includes(this.type)
//   }

//   getSuffix() {
//     var pos = this.name.lastIndexOf('.')
//     var suffix = ''
//     if (pos !== -1) {
//       suffix = this.name.substring(pos)
//     }
//     return suffix
//   }
// }
const getSuffix = (filename) => {
  var pos = filename.lastIndexOf('.')
  var suffix = ''
  if (pos !== -1) {
    suffix = filename.substring(pos)
  }
  return suffix
}

class UplpadFiles {
  constructor(fileList, opt = {}) {
    const { device = 'pc', definedValide = true } = opt

    this.fileList = fileList
    this.device = device
    this.definedValide = definedValide

    this.ossClient = {
      bucket: '',
      region: '',
      accessKeyId: '',
      accessKeySecret: '',
      stsToken: ''
    }
  }

  upload() {
    this.getOssToken().then((ossToken) => {
      const {
        bucketName = '',
        accessKeyId = '',
        accessKeySecret = '',
        endpoint = '',
        securityToken = ''
      } = ossToken

      this.ossClient.region = endpoint.split('.')[0]
      this.ossClient.accessKeyId = accessKeyId
      this.ossClient.accessKeySecret = accessKeySecret
      this.ossClient.bucket = bucketName
      this.ossClient.stsToken = securityToken

      console.log('this.ossClient', this.ossClient)

      this.multipartUpload()
    })
  }

  // 上传签名
  async getOssToken() {
    try {
      const getPubSinged = await $http.Teacher.getStsPrivateToken()
      return getPubSinged.payload
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async multipartUpload() {
    if (this.fileList.length) {
      this.client = new OSS(this.ossClient)

      const storeAsList = []

      // 遍历要上传的文件，设置文件唯一名称
      this.fileList.forEach((m, index) => {
        // 自定义id键和自定义名称
        const name = new Date().getTime() + getSuffix(m.name)

        storeAsList.push({
          storeAs: `${this.device}/fileUpload/${name}`,
          m
        })
      })

      // 等待全部上传成功
      await Promise.all(
        storeAsList.map((file, i) => {
          return this.multiBackPath(file.storeAs, file.m)
        })
      )
    }
  }

  multiBackPath(storeAs, param) {
    return new Promise((resolve, reject) => {
      this.client
        .multipartUpload(storeAs, param.raw)
        .then((result) => {
          resolve(result)
        })
        .catch((err) => {
          console.log('err', err)
          if (!this.client.isCancel()) {
            this.$message.warning('上传失败-')
            reject(err)
          }
        })
    })
  }
}

export default UplpadFiles
