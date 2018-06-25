import AppLoading from './AppLoading.vue';

AppLoading.install = (Vue, options) => {
  Vue.prototype.$loading = new (Vue.extend(AppLoading))({ propsData: options });
  if (process.env.NODE_ENV === 'development') window.$loading = Vue.prototype.$loading;
};
export default AppLoading;
