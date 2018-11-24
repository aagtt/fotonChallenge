import React from 'react';
import { FlatList, StyleSheet, View, SectionList } from 'react-native';
import { Container, Text, Button, Content } from 'native-base';
import { graphql } from 'react-apollo';
import BookList from './BookList';
import gql from 'graphql-tag';

class Home extends React.Component {

  handleLogout = () => {
    return this.props.screenProps.changeLoginState(false);
  };


  render() {
    const { navigation } = this.props;

    return (
      <Container>
        <Content>

          <View style={styles.container}>
            <BookList navigation={this.props.navigation} />
          </View>

          <Button full onPress={() => navigation.navigate('Product')} style={styles.buttonMargin} >
            <Text>Adicionar Livro</Text>
          </Button>
          <Button full onPress={this.handleLogout} style={styles.buttonMargin}>
            <Text>Deslogar</Text>
          </Button>

        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  },
  buttonMargin: {
    marginTop: 10
  },
  sectionHeader: {
    paddingTop: 2,
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#000000',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})
export default graphql(
  gql`
  query User {
    currentUser {
      _id
      email
    }
  }
`
)(Home);
