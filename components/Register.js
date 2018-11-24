import React from 'react';
import { Container, Button, Content, Form, Item, Input, Text } from 'native-base';
import { ActivityIndicator, View } from 'react-native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';



class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailError: false,
      password: '',
      passwordError: false,
      confirmPassword: '',
      confirmPasswordError: false,
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
    const { email, password, confirmPassword } = this.state;
    if (email.length === 0) {
      return this.setState({ emailError: true });
    }
    this.setState({ emailError: false });

    if (password.length === 0) {
      return this.setState({ passwordError: true });
    }
    this.setState({ passwordError: false });

    if (confirmPassword.length === 0) {
      return this.setState({ confirmPasswordError: true });
    }
    this.setState({ confirmPasswordError: false });

    if (password !== confirmPassword) {
      return this.setState({ passwordError: true, confirmPasswordError: true });
    }

    this.setState({ passwordError: false, confirmPasswordError: false, loading: true });

    //retorna a chamada pra mutation se tudo for valido
    this.props.signup(email, password)
      .then(({ data }) => {
        this.setState({ loading: false, registered: true });
        return this.props.screenProps.changeLoginState(true, jwt); // Quando o retorno for válido trocara o estado pro login passando o jwt
      })
      .catch(
      err => {
        if (/email/i.test(err.message)) {
          this.setState({ emailError: true });
        }
        if (/password/i.test(err.message)) {
          this.setState({ passwordError: true });
        }
      });


  };

  render() {
    const { navigation } = this.props;
    const { emailError, passwordError, confirmPasswordError, loading, registered } = this.state;

    return (
      <Container>
        <Content>
          <Form>
            <Item error={emailError}>
              <Input
                placeholder="Email"
                onChangeText={value => this.handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </Item>
            <Item error={passwordError}>
              <Input
                placeholder="Senha"
                onChangeText={value => this.handleInputChange('password', value)}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
              />
            </Item>
            <Item last error={confirmPasswordError}>
              <Input
                placeholder="Confirme sua senha"
                onChangeText={value => this.handleInputChange('confirmPassword', value)}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
              />
            </Item>
          </Form>
          {!loading ?
            (<Button full onPress={this.submit}>
              <Text>Registrar</Text>
            </Button>) :
            <ActivityIndicator size="large" color="#000000" />
          }
          <Button full transparent onPress={() => navigation.navigate('Login')}>
            <Text>Logar</Text>
          </Button>
          {registered &&
            <View>
              <Text>
                Registrado com sucesso !
            </Text>
            </View>
          }
        </Content>
      </Container>
    );
  }
}

export default graphql
  (
  gql`
  mutation SignUp($email: String!, $password: String!) {
            signup(email: $email, password: $password){
            _id,
            email,
            jwt
    }
  }
    `,
  {
    //  Retornar um objeto da props, adcionando signup e os dois parametros esperados pela mutation
    props: ({ mutate }) => ({
      signup: (email, password) => mutate({ variables: { email, password } }),
      // Função mutate, args, especificando as variaveis a serem passadas
    })
  }
  )(Register);
