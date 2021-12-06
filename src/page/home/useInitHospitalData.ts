
import { getHospitalList } from '../../common/api'
import { initMap, countDistance } from '../../hooks/userPosition'
import { ref, onMounted, watch } from 'vue'
interface RequestParams {
    size: number
    page: number
    [x: string]: string | number
}

// 医院信息添加距离显示
function increaseDistance(list, lat, lng) {
    list.forEach(item => {
        const [hos_lng, hos_lat] = item.map.split(',')
        item.distance = item.map ? countDistance(hos_lat, hos_lng, Number(lat), Number(lng)) : 0
    })
    return list
}


export default function useInitHospitalData(homePageEntrance: string | number) {
    const hospitalData = ref([])


    const params: RequestParams = { page: 1, size: 20 }
    if (homePageEntrance) {
        params.homePageEntrance = homePageEntrance
    }

    // 请求医院列表数据
    const getHospitalData = async () => {
        const { data: res } = await getHospitalList(params)
        hospitalData.value = res.list
    }

    onMounted(getHospitalData)

    const position = initMap()

    watch(
        () => position,
        (state, preState) => {
            if (state.lat && state.lng && state.isPosition) {
                hospitalData.value = increaseDistance(hospitalData.value, state.lat, state.lng)
            }
        },
        { deep: true }
    )


    return {
        hospitalData
    }

}