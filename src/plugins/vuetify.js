import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import { Ripple } from 'vuetify/lib/directives'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify, {
  directives: {
    Ripple
  }
})

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
});

