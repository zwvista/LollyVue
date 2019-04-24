import Vue from 'vue';
import Quasar, * as All from 'quasar-framework/dist/quasar.mat.esm.js';
import 'quasar-framework/dist/umd/quasar.mat.min.css';

Vue.use(Quasar, {
  components: All,  // 使いたいコンポーネントのみ列挙でもよいはず
  directives: All,   // こちらも上と同様
});
