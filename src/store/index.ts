import { createStore } from 'vuex'
export interface GlobalDataProps {
  count: number
  name: string
}
const store = createStore<GlobalDataProps>({
  state: {
    count: 0,
    name: 'Jason',
  },
})

export default store
