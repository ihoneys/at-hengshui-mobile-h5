declare let AMap: any
import { reactive } from 'vue'
export interface Position {
  lng: number
  lat: number
  isPosition: false
}
const state = reactive({
  position: {
    lng: '',
    lat: '',
    isPosition: false,
  },
})
export function initMap() {
  AMap.plugin('AMap.Geolocation', function () {
    var geolocation = new AMap.Geolocation({
      // 是否使用高精度定位，默认：true
      enableHighAccuracy: true,
      // 设置定位超时时间，默认：无穷大
      timeout: 10000,
    })
    geolocation.getCurrentPosition()
    AMap.event.addListener(geolocation, 'complete', onComplete)
    AMap.event.addListener(geolocation, 'error', onError)
    function onComplete(data) {
      // data是具体的定位信息
      console.log('定位成功信息：', data)
      const { lat, lng } = data.position
      state.position.isPosition = true
      state.position.lat = lat
      state.position.lng = lng
      return state.position
    }
    function onError(data) {
      // 定位出错
      console.log('定位失败错误：', data)
      return getLngLatLocation()
    }
  })
  return state.position
}
export function getLngLatLocation() {
  AMap.plugin('AMap.CitySearch', function () {
    var citySearch = new AMap.CitySearch()
    citySearch.getLocalCity(function (status, result) {
      if (status === 'complete' && result.info === 'OK') {
        // 查询成功，result即为当前所在城市信息
        console.log('通过ip获取当前城市：', result)
        //逆向地理编码
        AMap.plugin('AMap.Geocoder', function () {
          var geocoder = new AMap.Geocoder({
            // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            city: result.adcode,
          })

          var lnglat = result.rectangle.split(';')[0].split(',')
          geocoder.getAddress(lnglat, function (status, data) {
            if (status === 'complete' && data.info === 'OK') {
              // result为对应的地理位置详细信息
              state.position.isPosition = true
              const [lng, lat] = lnglat
              state.position.isPosition = true
              state.position.lat = lat
              state.position.lng = lng
              return state.position
            } else {
              state.position.isPosition = false
              state.position.lat = ''
              state.position.lng = ''
              return state.position
            }
          })
        })
      }
    })
  })
  return state.position
}

export function countDistance(lat1, lng1, lat2, lng2) {
  //   console.log(lat1, lng1, lat2, lng2)
  var radLat1 = (lat1 * Math.PI) / 180.0
  var radLat2 = (lat2 * Math.PI) / 180.0
  var a = radLat1 - radLat2
  var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0
  var s =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(a / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
      )
    )
  s = s * 6378.137
  s = Math.round(s * 10000) / 10000
  return s.toFixed(0) // 单位千米
}
