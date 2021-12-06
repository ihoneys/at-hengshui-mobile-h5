import { ref } from 'vue'


export default function useOperationSequencing(hospitalData) {
    const defaultVal = ref<number>(0)
    const sortVal = ref<string>('a')
    const defaultOptions = [
        { text: '默认排序', value: 0 },
        { text: '距离排序', value: 1 },
    ]
    const sortOptions = [
        { text: '升序', value: 'a' },
        { text: '降序', value: 'b' },
    ]
    const handleSort = () => {
        const generateRules = (a, b) => {
            return {
                '0_a': a.qty - b.qty,
                '0_b': a.distance - b.distance,
                '1_a': b.qty - a.qty,
                '1_b': b.distance - a.distance,
            }
        }
        hospitalData.value = hospitalData.value.sort((a, b) => {
            const selectVal = `${defaultVal.value}_${sortVal.value}`
            return generateRules(a, b)[selectVal]
        })
    }
    return {
        defaultVal,
        sortVal,
        defaultOptions,
        sortOptions,
        handleSort
    }
}