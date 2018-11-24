import React from 'react';
import { FlatList, StyleSheet, View, SectionList, TouchableOpacity } from 'react-native';
import { Container, Text, Button, Content, Input } from 'native-base';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class BookList extends React.Component {
  state = {
    booksFiltered: [],
    erroFiltro: false,
    errorMessage: ''
  };

  // componentWillReceiveProps = (nextProps) => {
  //   const { allBooks } = nextProps.data;
  //   this.state({ booksFiltered: allBooks })
  // } erra pra isto estar funcionando.  ¯\_(ツ)_/¯

  filterData = (text) => {
    const { allBooks } = this.props.data;
    let booksFiltered = allBooks.filter((book) => {
      return book.title.indexOf(text) > -1;
    });

    if (booksFiltered.length > 1) {
      this.setState({ erroFiltro: false, booksFiltered: booksFiltered });
    } else {
      this.setState({ erroFiltro: true, errorMessage: `Não foi encontrado nenhum livro com o título ${text}` })
    }

  }

  _onPress = (item) => {
    this.props.navigation.navigate('BookDetail', { bookId: item._id });
  };


  render() {
    const { booksFiltered, erroFiltro, errorMessage, itemId, item } = this.state;
    return (
      <View>
        <Text style={{ marginLeft: 5 }}>Buscar</Text>
        <Input
          placeholder="Digite o nome do livro"
          onChangeText={this.filterData}
          style={styles.search}
        />
        {!erroFiltro ? (

          <FlatList data={booksFiltered}
            renderItem={({ item }) =>

              <View style={styles.view}>
                <Text style={styles.title}>
                  Titulo: {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
                </Text>
                <Text style={styles.description}>
                  {item.description.charAt(0).toUpperCase() + item.description.slice(1)}
                </Text>
                <Button onPress={() => this._onPress(item)} style={styles.buttonView}>
                  <Text>Detalhes</Text>
                </Button>
              </View>

            }
            keyExtractor={(item, index) => index.toString()}
          />)
          : <Text>{errorMessage}</Text>
        }
      </View >
    );
  }
}
const styles = StyleSheet.create({
  view: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#3c3c3c'
  },
  title: {
    paddingTop: 0,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 0,
    fontSize: 22,
    fontFamily: 'Times, "Times New Roman", serif',
    fontWeight: 'bold',
    color: 'black',
  },
  description: {
    paddingLeft: 10,
    fontSize: 14,
    color: 'black',
    fontFamily: 'monospace'
  },
  buttonEdit: {
    paddingTop: 5
  },
  buttonView: {
    marginLeft: 280,
    marginTop: -40,
    marginBottom: 10
  },
  search: {
    borderColor: 'gray',
    marginBottom: 15,
    borderWidth: 1
  }
})

export default graphql(
  gql`
  query AllBooks {
          allBooks {
        _id,
      title,
      description,
      year
      pages
    }
  }  
`
)(BookList);
