import React from 'react';
// import { Form } from 'react-bootstrap';
import { Form, FormGroup, Label, Input, FormFeedback, Spinner } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom'
import { Formik } from 'formik';
import * as Yup from 'yup';
import firebase from '../Firebase';

// material UI
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


class SignUp extends React.Component {

    state = {
        loading: false, //処理中にボタンにspinner表示する制御用
    }

    _isMounted = false;

    //Submitされたら
    handleOnSubmit = (values) => {
        //spinner表示開始
        if (this._isMounted) this.setState({ loading: true });
        //新規登録処理
        firebase.auth().createUserWithEmailAndPassword(values.email, values.password)
            .then(res => {
                //正常終了時
                //spinner表示終了
                if (this._isMounted) this.setState({ loading: false });
                //Homeに移動
                this.props.history.push("/"); //history.pushを使うためwithRouterしている
            })
            .catch(error => {
                //異常終了時
                if (this._isMounted) this.setState({ loading: false });
                alert(error);
            });
    }

    componentDidMount = () => {
        this._isMounted = true;
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    render() {
        return (
            <div className="container">
                <div className="mx-auto" style={{ width: 400, background: '#eee', padding: 20, marginTop: 60 }}>
                    <p style={{ textAlign: 'center' }}>新規登録</p>
                    <Formik
                        initialValues={{ email: '', password: '', tel: '' }}
                        onSubmit={(values) => this.handleOnSubmit(values)}
                        validationSchema={Yup.object().shape({
                            email: Yup.string().email().required(),
                            password: Yup.string().required(),
                            tel: Yup.string().required(),
                        })}
                    >
                        {
                            ({ handleSubmit, handleChange, handleBlur, values, errors, touched }) => (
                                <Form onSubmit={handleSubmit}>
                                    <FormGroup>
                                        <TextField
                                            className="w-100"
                                            type="email"
                                            name="email"
                                            id="email"
                                            label="Email"
                                            variant="outlined"
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            invalid={touched.email && errors.email ? true : false}
                                        />
                                        <FormFeedback>
                                            {errors.email}
                                        </FormFeedback>
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
                                            invalid={touched.password && errors.password ? true : false}
                                        />
                                        <FormFeedback>
                                            {errors.password}
                                        </FormFeedback>
                                    </FormGroup>
                                    <FormGroup>
                                        <TextField
                                            className="w-100"
                                            type="tel"
                                            name="tel"
                                            id="tel"
                                            label="tel"
                                            variant="outlined"
                                            value={values.tel}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            invalid={touched.tel && errors.tel ? true : false}
                                        />
                                        <FormFeedback>
                                            {errors.tel}
                                        </FormFeedback>
                                    </FormGroup>
                                    <div style={{ textAlign: 'center' }}>
                                        <Button variant="contained" color="primary" type="submit" disabled={this.state.loading}>
                                            <Spinner size="sm" color="light" style={{ marginRight: 5 }} hidden={!this.state.loading} />
                                            新規登録
                                        </Button>
                                    </div>
                                </Form>
                            )
                        }
                    </Formik>
                </div>
                <div className="mx-auto" style={{ width: 400, background: '#fff', padding: 20 }}>
                    <Link to="/signin">ログインはこちら</Link>
                </div>

            </div>
        );
    }
}

export default withRouter(SignUp);