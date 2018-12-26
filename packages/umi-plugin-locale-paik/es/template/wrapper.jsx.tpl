
{{#localeList.length}}
import { addLocaleData, IntlProvider, injectIntl } from 'react-intl';
import { _setIntlObject } from 'umi/locale';

const InjectedWrapper = injectIntl(function ComponentWrapper(props) {
  _setIntlObject(props.intl);
  return props.children;
})
{{/localeList.length}}


{{#momentLocaleList}}
import 'moment/locale/{{{.}}}';
{{/momentLocaleList}}

const baseNavigator = {{{baseNavigator}}};
const useLocalStorage = {{{useLocalStorage}}};

{{#antd}}
import { LocaleProvider } from 'antd';
import moment from 'moment';
{{#defaultMomentLocale}}
import 'moment/locale/{{defaultMomentLocale}}';
{{/defaultMomentLocale}}
let defaultAntd = require('antd/lib/locale-provider/{{defaultAntdLocale}}');
defaultAntd = defaultAntd.default || defaultAntd;
{{/antd}}

const localeInfo = {
  {{#localeList}}
  '{{name}}': {
    messages: {
      {{#paths}}...require('{{{url}}}'){{affter}},{{/paths}}
    },
    locale: '{{name}}',
    {{#antd}}antd: require('antd/lib/locale-provider/{{antdLocale}}'),{{/antd}}
    data: require('react-intl/locale-data/{{lang}}'),
    momentLocale: '{{momentLocale}}',
  },
  {{/localeList}}
};

let appLocale = {
  locale: '{{defaultLocale}}',
  messages: {},
  data: require('react-intl/locale-data/{{defaultLang}}'),
  momentLocale: '{{defaultMomentLocale}}',
};
if (useLocalStorage && localStorage.getItem('umi_locale') && localeInfo[localStorage.getItem('umi_locale')]) {
  appLocale = localeInfo[localStorage.getItem('umi_locale')];
} else if (localeInfo[navigator.language] && baseNavigator){
  appLocale = localeInfo[navigator.language];
} else {
  appLocale = localeInfo['{{defaultLocale}}'] || appLocale;
}
window.g_lang = appLocale.locale;
{{#localeList.length}}
appLocale.data && addLocaleData(appLocale.data);
{{/localeList.length}}

export default function LocaleWrapper(props) {
  let ret = props.children;
  {{#localeList.length}}
  ret = (<IntlProvider locale={appLocale.locale} messages={appLocale.messages}>
    <InjectedWrapper>{ret}</InjectedWrapper>
  </IntlProvider>)
  {{/localeList.length}}
  {{#antd}}
  ret = (<LocaleProvider locale={appLocale.antd ? (appLocale.antd.default || appLocale.antd) : defaultAntd}>
    {ret}
  </LocaleProvider>);
  {{/antd}}
  return ret;
}
