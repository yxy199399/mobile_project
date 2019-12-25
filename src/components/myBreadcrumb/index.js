import MyBreadcrumbComponents from './layout.vue';

const MyBreadcrumb = {
    install(Vue) {
        Vue.component('MyBreadcrumb', MyBreadcrumbComponents)
    }
}

export default MyBreadcrumb;