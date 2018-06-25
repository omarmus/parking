'use strict';

const layout = {
  namespaced: true,
  state: {
    miniVariant: false,
    rightDrawer: false,
    breadcrumbs: {}
  },
  mutations: {
    toggleMiniVariant (state) {
      state.miniVariant = !state.miniVariant;
    },
    toggleRightDrawer (state) {
      state.rightDrawer = !state.rightDrawer;
    },
    setBreadcrumbs (state, items) {
      state.breadcrumbs = items;
    }
  }
};

export default layout;
