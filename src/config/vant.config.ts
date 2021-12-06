import {
    Tabbar,
    TabbarItem,
    Image as VanImage,
    Lazyload,
    Button,
    Field,
    CellGroup,
    Toast,
    Form,
    TreeSelect,
    NavBar,
    Tab,
    Tabs,
    Popup,
    RadioGroup,
    Radio,
    ActionSheet,
    Icon,
    Cell,
    List,
    CountDown,
    DatetimePicker,
    Picker,
    Search,
    DropdownMenu,
    DropdownItem,
    Swipe,
    SwipeItem,
    Rate,
    Checkbox,
    Dialog,
    NoticeBar,
    Overlay
} from 'vant'

const components = {
    Tabbar,
    TabbarItem,
    VanImage,
    Lazyload,
    Button,
    Field,
    CellGroup,
    Toast,
    Form,
    TreeSelect,
    NavBar,
    Tab,
    Tabs,
    Popup,
    RadioGroup,
    Radio,
    ActionSheet,
    Icon,
    Cell,
    List,
    CountDown,
    DatetimePicker,
    Picker,
    Search,
    DropdownMenu,
    DropdownItem,
    Swipe,
    SwipeItem,
    Rate,
    Checkbox,
    Dialog,
    NoticeBar,
    Overlay
}

const componentsHandler = {
    install(Vue) {
        Object.keys(components).forEach(key => Vue.use(components[key]))
    }
}

export default componentsHandler