// https://stackoverflow.com/questions/42775017/angular-2-redirect-to-an-external-url-and-open-in-a-new-tab
import _ from 'lodash';

export function googleString(str: string) {
  window.open('https://www.google.com/search?q=' + encodeURIComponent(str), '_blank');
}

export function toParameters(item: Object): Object {
  return _.mapKeys(item, (v, k) => "P_" + k);
}
