import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset';
import { ApolloProvider } from 'react-apollo';
import { setContext } from 'apollo-link-context';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Product from './components/Product';
import BookDetail from './components/BookDetail';
import BookList from './components/BookList';
import { signIn, signOut, getToken } from './components/util';

const AuthStack = StackNavigator({
  Register: { screen: Register, navigationOptions: { headerTitle: 'Register' } },
  Login: { screen: Login, navigationOptions: { headerTitle: 'Login' } },
});

const LoggedInStack = StackNavigator({
  Home: { screen: Home, navigationOptions: { headerTitle: 'Home' } },
  Product: { screen: Product, navigationOptions: { headerTitle: 'Novo Livro' } },
  BookList: { screen: BookList },
  BookDetail: { screen: BookDetail, navigationOptions: { headerTitle: 'Detalhes do livro' } },
});

//https://launchpad.graphql.com/7r4pmvnkkj
const httpLink = new HttpLink({ uri: 'https://8751kv5lvq.lp.gql.zone/graphql' });
const authLink = setContext(async (req, { headers }) => {
  const token = await getToken();

  return {
    ...headers,
    headers: {
      authorization: token ? `Bearer ${token}` : null
    },
  }
});

const link = authLink.concat(httpLink);
const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});


export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
    };
  }

  async componentWillMount() {
    const token = await getToken();
    //return promise
    if (token) { //mantem  logado
      this.setState({ loggedIn: true });
    }
  }

  handleChangeLoginState = (loggedIn = false, jwt) => {
    this.setState({ loggedIn });
    if (loggedIn)
      signIn(jwt)
    else
      signOut();
  };

  render() {
    return (
      <ApolloProvider client={client}>
        {this.state.loggedIn ?
          <LoggedInStack screenProps={{ changeLoginState: this.handleChangeLoginState }} />
          :
          <AuthStack screenProps={{ changeLoginState: this.handleChangeLoginState }} />
        }
      </ApolloProvider>
    );

  }
}
