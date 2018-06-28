import wepy from 'wepy'
import qiniuUploader from "../utils/qiniuUploader"

export default class testMixin extends wepy.mixin {
  data = {
    server:"https://card.vnest.net",
  }
  methods = {

  }

  modifyUserInfo(params,cb){
    params._method = 'put';
    var url = this.server + '/api/users/'+this.userInfo.uuid+'.json';
    this.httpAgent(url,'PUT',params,(resp) => {
      cb && cb(resp); 
    });
  }

  getBrandList({}, successCb, erroCb){
    let url = this.server + '/api/product/brand.json';
    let params = {
    }

   this.httpAgent(url,'GET', params,successCb,erroCb)
  }

  relateProduct({adds,dels},successCb,erroCb){
    var url = this.server + '/api/product/user/setting.json?';
    console.log(adds)
    if(adds && adds.length > 0){
      for(var items of adds){
        url = url + '&resId='+items.uuid+'&act=add'
      }
    }
    if(dels && dels.length > 0){
      for(var items of dels){
        url = url + '&resId='+items.uuid+'&act=delete'
      }
    }
    let params = {
    }

   this.httpAgent(url,'POST', params,successCb,erroCb)
  }

  relateProductType({adds,dels},successCb,erroCb){
    var url = this.server + '/api/product/type/user/setting.json?';
    console.log(adds)
    if(adds && adds.length > 0){
      for(var items of adds){
        url = url + '&resId='+items.uuid+'&act=add'
      }
    }
    if(dels && dels.length > 0){
      for(var items of dels){
        url = url + '&resId='+items.uuid+'&act=delete'
      }
    }
    let params = {
    }

   this.httpAgent(url,'POST', params,successCb,erroCb)
  }

  getRelateTypesList({parentId,brandId,user_id},successCb,erroCb){
    var url = this.server + '/api/product/type/user/'+user_id+'.json';
    let params = {
      parentId,
      brandId
    }
   this.httpAgent(url,'GET', params,successCb,erroCb)


  }
  getRelateProduct({parentId,brandId,user_id},successCb,erroCb){
    var url = this.server + '/api/product/type/user/'+user_id+'.json';
    let params = {
      parentId,
      brandId
    }
   this.httpAgent(url,'GET', params,successCb,erroCb)


  }




  getProductTypes({brandId,status,parentId}, successCb, erroCb){
    let url = this.server + '/api/product/type.json';
    let params = {
      brandId,
      status,
      parentId,
      isChildProduct:1
    }

    this.httpAgent(url,'GET', params,successCb,erroCb)
  }




  startUpload(file,cb) {
      console.log("upload#@!");
      var that = this;
      // 交给七牛上传
      qiniuUploader.upload(file.url, (res) => {
        // 每个文件上传成功后,处理相关的事情
        // 其中 info 是文件上传成功后，服务端返回的json，形式如
        // {
        //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
        //    "key": "gogopher.jpg"
        //  }
        // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

        console.log(res);
        cb && cb(res);
      }, (error) => {
        console.log('error: ' + error);
      }, {
          region: 'ECN',
          times: new Date().getTime(),
          domain: 'qiniu-file01.yugusoft.com', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
          // key: 'customFileName.jpg', // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
          // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
          // uptoken: '[yourTokenString]', // 由其他程序生成七牛 uptoken
          // uptokenURL: 'UpTokenURL.com/uptoken', // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}
          uptokenFunc: function (cb) {
            console.log("abc#####")

            return new Promise((resolve, reject) => {
              const expand = file.expand;
              const name = file.name;
              let url = that.server + '/api/files/storage/ticket/unlogin.json';
              url = url + '?name='+file.name+'&type=0'
              const params = {
              }
              that.httpAgent(url, 'GET', params, (data) => {
                // console.log(data.ticket);
                cb && cb(data.ticket);
              })
            })
          }
        }
      );
    }



  httpAgent (url, requestType, params, cb, errorcb, showLoading) {
    console.log("httpAgent");
    if (showLoading) {
      wepy.showLoading({
        title: 'Loading...',
      })
    }
    var token = this.$parent.globalData.token;
    var plat = this.$parent.globalData.plat;
    if(url.indexOf("?") >= 0){
      url = url + '&plat='+plat;
    }else{
      url = url + '?plat='+plat;
    }
    if(token){
      url = url + '&token='+token;
    }

    wepy.request({
      url: url, //仅为示例，并非真实的接口地址
      data: params,
      method: requestType,
      // header: {
      //   'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' // 默认值
      // },
      success: function (res) {
        wepy.hideLoading();
        var data = res.data;
        if (data.result && data.result != 0) {
          if (data.result == -10001) {//token过期了
            console.log("token 过期了");
          } else {
            if (errorcb) {
              errorcb(data);
            } else {
              const content = data.msg + '，url地址：' + url;
              console.log(content);
              console.log(params);
            }
          }
        } else {
          cb(data);
        }
      },
      fail: function (res) {
        wepy.hideLoading();
        errorcb && errorcb(res);
      }
    })




  }
  
}
