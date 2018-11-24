import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Container, Button, Content, Form, Item, Input, Text } from 'native-base';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailError: false,
      password: '',
      passwordError: false,
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
    const { email, password } = this.state;
    if (email.length === 0) {
      return this.setState({ emailError: true });
    }
    this.setState({ emailError: false });

    if (password.length === 0) {
      return this.setState({ passwordError: true });
    }
    this.setState({ passwordError: false, loading: true });

    //return this.props.screenProps.changeLoginState(true);
    this.props.login(email, password)
      .then(({ data }) => {
        this.setState({ registered: true });
        return this.props.screenProps.changeLoginState(true, data.login.jwt);
      })
      .catch(
      err => {
        this.setState({ loading: false, erro: err.message });
         // Se a mensagem tem email, assumimos que o erro é de email 
        if (/email/i.test(err.message)) {
          this.setState({ emailError: true });
        }
        if (/password/i.test(err.message)) {
          this.setState({ passwordError: true });
        }
      });
  }
  render() {
    const { emailError, passwordError, loading, erro } = this.state;

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
            {emailError &&
              <Text style={styles.errorMessage}>{this.state.erro}</Text>}
            <Item error={passwordError}>
              <Input
                placeholder="Senha"
                onChangeText={value => this.handleInputChange('password', value)}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
               
              />
            </Item>
            {passwordError &&
              <Text style={styles.errorMessage}>{this.state.erro}</Text>}
          </Form>
          {!loading ?
            <Button full onPress={this.submit}>
              <Text>Logar</Text>
            </Button>
            :
            <ActivityIndicator size="large" color="#000000" />
          }
        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  errorMessage: {
    color: 'red',
    fontSize: 12,
    paddingTop: 5,
    paddingLeft: 15
  }

});

export default graphql(
  gql`
  mutation LogIn($email: String!, $password: String!) {
    login(email: $email, password: $password){
      _id,
      email,
      jwt
    }
  }
    `,
  {
    props: ({ mutate }) => ({
      login: (email, password) => mutate({ variables: { email, password } }),
    })
  }
)(Login);
