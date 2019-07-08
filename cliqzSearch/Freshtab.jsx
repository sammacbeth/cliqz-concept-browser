import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  NativeModules,
  DeviceEventEmitter,
} from 'react-native';
import getLogo from 'cliqz-logo-database';
import { Logo } from '@cliqz/component-ui-logo';

const {
  BrowserActions,
  Tabs,
} = NativeModules;

var styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(0, 9, 23)',
    flex: 1,
  },
  list: {
    flex: 1,
  },
  spacer: {
    // TODO: it is here to fix the problem of react-native view height which is bigger than it should
    height: 60
  },
  row: {
    padding: 10,
    flexDirection: 'row',
  },
  rowText: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center',
  },
});

const convertLogoUrl = url => url
  .replace('logos', 'pngs')
  .replace('.svg', '_192.png');

const LogoWithText = ({ domain }) => {
  const url = `https://${domain}`;
  const logo = getLogo(url) || {
    color: '9077e3',
    text: domain.substring(0, 2),
    url: '',
  };
  const logoUrl = convertLogoUrl(logo.url);

  return (
    <TouchableOpacity
      onPress={() => BrowserActions.openLink(url, '')}
      style={styles.row}
      key={domain}
    >
      <Logo
        logo={{
          ...logo,
          url: logoUrl,
        }}
      />
      <View style={styles.rowText}>
        <Text style={{ color: 'white' }}>{domain}</Text>
        <Text></Text>
      </View>
    </TouchableOpacity>
  );
};

const IS_SHOWN_EVENT = 'NEW_TAB:SHOW';

class TopSites extends React.Component {
  state = {
    topDomains: [],
  }

  updateTopSites = () => {
    BrowserActions.topDomains(domains => {
      this.setState({
        topDomains: domains,
      });
    });
  }

  componentDidMount() {
    this.updateTopSites();
    DeviceEventEmitter.addListener(IS_SHOWN_EVENT, this.updateTopSites);
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeListener(IS_SHOWN_EVENT, this.updateTopSites);
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.topDomains}
          renderItem={({ item: domain}) => <LogoWithText key={domain} domain={domain} />}
          style={styles.list}
          inverted
        />
        <View style={styles.spacer} />
      </View>
    );
  }
}

class TabView extends React.Component {

  state = {
    tabs: [],
  };

  async componentDidMount() {
    const tabs = await Tabs.list();
    console.log('xxx', tabs);
    this.setState({ tabs });
  }

  renderTab({ item }) {
    console.log('xxx', item);
    const { id, title, url, selected } = item;

    const logo = getLogo(url) || {
      color: '9077e3',
      text: url,
      url,
    };
    return (
      <TouchableOpacity
        onPress={() => {}}
        style={styles.row}
        key={id}
      >
        <Logo
          logo={{
            ...logo,
            url,
          }}
        />
        <View style={styles.rowText}>
          <Text style={{ color: 'white' }}>{title}</Text>
          <Text style={{ color: 'white' }}>{url}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    console.log('xxx render', this.state.tabs);
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.tabs}
          renderItem={this.renderTab.bind(this)}
          style={styles.list}
        />
      </View>
    );
  }
}

const FRESHTAB_STATE_EVENT = 'FRESHTAB:SHOW_';

export default class FreshTab extends React.Component {
  state = {
    view: 'tabs',
  }

  onFreshtabEvent(view) {
    this.setState({
      view
    });
  }

  componentDidMount() {
    this.showTabs = this.onFreshtabEvent.bind(this, 'tabs');
    this.showTopSites = this.onFreshtabEvent.bind(this, 'topsites');
    DeviceEventEmitter.addListener(`${FRESHTAB_STATE_EVENT}TABS`, this.showTabs);
    DeviceEventEmitter.addListener(`${FRESHTAB_STATE_EVENT}HOME`, this.showTopSites);
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeListener(`${FRESHTAB_STATE_EVENT}TABS`, this.showTabs);
    DeviceEventEmitter.removeListener(`${FRESHTAB_STATE_EVENT}HOME`, this.showTopSites);
  }

  render() {
    if (this.state.view === 'topsites') {
      return <TopSites/>
    } else {
      return <TabView />
    }
  }
}