import React from 'react';
import { Form, FormGroup, Spinner } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom'
import { Formik } from 'formik';
import * as Yup from 'yup';
import firebase from '../Firebase';

// material UI
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class SignInOrUp extends React.Component {

    state = {
        loading: false, //spinner制御用
    }

    _isMounted = false;
    _isGuestMounted = false;

    componentDidMount = () => {
        this._isMounted = true;
        this._isGuestMounted = true;
    }
    

    componentWillUnmount = () => {
        this._isMounted = false;
        this._isGuestMounted = false;
    }

    componentDidMount = () => {
        this._isMounted = true;
    }
    

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    handleOnSubmit = (values) => {
        //spinner表示開始
        if (this._isMounted) this.setState({ loading: true })
        //サインイン（ログイン）処理
        firebase.auth().signInWithEmailAndPassword(values.email, values.password)
            .then(res => {
                //正常終了時
                this.props.history.push("/");
                if (this._isMounted) this.setState({ loading: false });
            })
            .catch(error => {
                //異常終了時
                if (this._isMounted) this.setState({ loading: false });
                alert(error);
            });

    }

    guestLoginSubmit = () => {
        firebase.auth().signInAnonymously().catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(error)
            // ...
        });
        if(this._isGuestMounted) this.setState({ guestLoading: true })
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.props.history.push("/");
                if(this._isGuestMounted) this.setState({ guestLoading: false })
                // User is signed in.
                var isAnonymous = user.isAnonymous;
                var uid = user.uid;
            } 
        });
    }

    render() {
        return (
            <div className="container">
                <div className="mx-auto" style={{ width: 400, background: '#eee', padding: 20, marginTop: 60 }}>
                    <p style={{ textAlign: 'center' }}>サインイン</p>
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        onSubmit={(values) => this.handleOnSubmit(values)}
                        validationSchema={Yup.object().shape({
                            email: Yup.string().email().required(),
                            password: Yup.string().required(),
                        })}
                    >
                        {
                            ({ handleSubmit, handleChange, handleBlur, values, errors, touched}) => (
                                <Form onSubmit={handleSubmit}>
                                    <FormGroup>
                                        <TextField
                                            className="w-100"
                                            type="email"
                                            name="email"
                                            id="email"
                                            variant="outlined"
                                            label="Email"
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.email && errors.email ? true : false}
                                            helperText={touched.email && errors.email ? "正しいメールアドレスを入れてください" : false}
                                            // invalid={touched.email && errors.email ? true : false}
                                        />
                                        {/* <FormFeedback>
                                            {errors.email}
                                        </FormFeedback> */}
                                    </FormGroup>
                                    <FormGroup>
                                        <TextField
                                            className="w-100"
                                            type="password"
                                            name="password"
                                            id="password"
                                            label="Password"
                                            variant="outlined"
                                            value={values.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.password && errors.password ? true : false}
                                            helperText={touched.password && errors.password ? "正しいパスワードを入れてください" : false}
                                            // invalid={touched.password && errors.password ? true : false}
                                        />
                                        {/* <FormFeedback>
                                            {errors.password}
                                        </FormFeedback> */}
                                    </FormGroup>
                                    <div style={{ textAlign: 'center' }}>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            type="submit" 
                                            disabled={this.state.loading}
                                        >
                                            <Spinner 
                                                size="sm" 
                                                color="light" 
                                                style={{ marginRight: 5 }} 
                                                hidden={!this.state.loading} 
                                            />
                                            ログイン
                                        </Button>
                                    </div>
                                </Form>
                            )
                        }
                    </Formik>
                </div>
                <div className="mx-auto" style={{ width: 400, background: '#fff', padding: 20 }}>
                    <Link to="/signup">新規登録はこちら</Link>
                    <Button 
                        className="mt-3"    
                        variant="contained" 
                        style={{ backgroundColor: '#D9C502' }} 
                        onClick={() => this.guestLoginSubmit()}
                    >
                        <Spinner 
                            size="sm" 
                            color="light" 
                            style={{ marginRight: 5 }} 
                            hidden={!this.state.guestLoading} 
                        />
                        ゲストユーザーとしてログイン
                    </Button>
                </div>
            </div>
        );
    }
}

export default withRouter(SignInOrUp);