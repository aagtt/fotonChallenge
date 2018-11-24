import React from 'react';
import { Container, Button, Content, Form, Item, Input, Text } from 'native-base';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag';

class BookDetail extends React.Component {

  state = {
    bookId: '',
    bookReady: false
  };

  render() {
    const { book, bookReady } = this.state;
    const { navigation } = this.props;

    const id = navigation.getParam('bookId');

    this.props.getbook(id)
      .then(({ data }) => {
        this.setState({ bookReady: true, book: data.getbook });
      }).catch(
      err => {
        this.setState({ errMessage: err.message });
      });
    return (
      <Container>
        <Content>
          <Text>Detalhes sobre o livro: </Text>
          {bookReady ? (
            <View>
              <Text style={styles.title}>{book.title}</Text>
              <Text style={styles.description}>Descrição:{book.description}</Text>
              <Text style={styles.pages}>Páginas: {book.pages ? book.pages : 'Sem páginas'} - Lançado em: {book.year ? book.year : 'XXXX'}</Text>
            </View>
          ) : <ActivityIndicator size="large" style={styles.loading} />
          }
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  title: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 30,
    fontFamily: 'Times, "Times New Roman", serif',
    fontWeight: 'bold',
    color: 'black',
    borderWidth: 0.5,
    borderColor: 'black'
  },
  description: {
    paddingLeft: 3,
    fontSize: 15,
    marginTop: 1,
    color: 'black',
    fontFamily: 'monospace',
    borderWidth: 0.5,
    borderColor: 'black'
  },
  pages: {
    paddingLeft: 3,
    fontSize: 15,
    marginTop: 1,
    color: 'black',
    fontFamily: 'monospace',
    borderWidth: 0.5,
    borderColor: 'black'
  },
  loading: {
    color: "#000000",
    paddingTop: 100
  }
});

export default graphql
  (
  gql`  
  mutation GetBook($id: String!) {
    getbook(_id: $id) {
      title,
      description,
      year
      pages
    }
  }
`,
  {
    props: ({ mutate }) => ({
      getbook: (id) => mutate({ variables: { id } }),
    })
  })(BookDetail);
