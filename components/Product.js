import React from 'react';
import { Container, Button, Content, Form, Item, Input, Text } from 'native-base';
import { ActivityIndicator, View } from 'react-native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Product extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      titleError: false,
      descriptionError: false,
      title: '',
      description: '',
      year: 0,
      pages: 0,
    };
  }

  handleInputChange = (field, value) => {
    const newState = {
      ...this.state,
      [field]: value,
    };
    this.setState(newState);
  };

  submit = () => {
    const { title, description, year, pages, loading } = this.state;

    this.setState({ loading: true });

    if (title.length === 0) {
      return this.setState({ titleError: true });
    }
    this.setState({ titleError: false });

    if (description.length === 0 || description.length < 3) {
      return this.setState({ descriptionError: true });
    }
    this.setState({ descriptionError: false });

    this.props.addbook(title, description, year, pages)
      .then(({ data }) => {
        this.setState({ loading: false, showList: true });
        // this.props.navigation.navigate('Home');
        this.props.navigation.goBack();
      })
      .catch(
      err => {
        this.setState({ erro: err.message });
        if (/title/i.test(err.message)) {
          this.setState({ titleError: true });
        }
        if (/description/i.test(err.message)) {
          this.setState({ descriptionError: true });
        }
      });


  };

  render() {
    const { navigation } = this.props;
    const { titleError, descriptionError, erro, loading, title, description, year, pages } = this.state;

    return (
      <Container>
        <Content>
          <Form>
            <Item error={titleError}>
              <Input
                placeholder="Titulo"
                onChangeText={value => this.handleInputChange('title', value)}
                autoCorrect={false}
              />
            </Item>
            <Item error={descriptionError}>
              <Input
                placeholder="Descrição do livro"
                onChangeText={value => this.handleInputChange('description', value)}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </Item>

            <Item>
              <Input
                placeholder="Ano de lançamento do livro"
                onChangeText={value => this.handleInputChange('year', value)}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </Item>
            <Item>
              <Input
                placeholder="Páginas no livro"
                onChangeText={value => this.handleInputChange('pages', value)}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </Item>
          </Form>
          {!loading ?
            (<Button full onPress={this.submit}>
              <Text>Adicionar</Text>
            </Button>
            ) :
            <ActivityIndicator size="large" color="#000000" />
          }
          <Text>{erro}</Text>
          <View>
            <Text>Titulo: {title}</Text>
            <Text>Descrição: {description}</Text>
            <Text>Ano de lançamento: {year}</Text>
            <Text>Qtd. Páginas: {pages}</Text>
          </View>
        </Content>
      </Container>
    );
  }
}


export default graphql
  (
  gql`  
  mutation AddBook($title: String!, $description: String!, $year: String, $pages: String ) {
    addbook(title: $title, description: $description, year: $year, pages: $pages) {
      _id
      title
      description
      year
      pages
    }
  }
`,
  {
    props: ({ mutate }) => ({
      addbook: (title, description, year, pages) => mutate({ variables: { title, description, year, pages } }),
    })
  }
  )(Product);
