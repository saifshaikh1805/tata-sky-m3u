import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { Button, Form, Grid, Header, Message, Radio, Segment } from 'semantic-ui-react';
import { useEffect, useState } from 'react';

export default function Home() {

  const [rmn, setRmn] = useState("");
  const [sid, setSid] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [theUser, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState("");
  const [dynamicUrl, setDynamicUrl] = useState("");
  const [loginType, setLoginType] = useState("OTP");
  const [pwd, setPwd] = useState("");


  useEffect(() => {
    let tok = localStorage.getItem("token");
    let userd = localStorage.getItem("userDetails");
    if (tok !== undefined && userd !== undefined) {
      setToken(tok);
      setUser(JSON.parse(userd));
    }
  }, []);

  useEffect(() => {
    if (theUser !== null) {
      if (theUser.acStatus !== "DEACTIVATED") {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer 53d037668d748648c12097863c2321ea61be9de0");
        myHeaders.append("Content-Type", "application/json");
        console.log('mko');
        console.log(process.env.REACT_APP_M3U_FUNCTION_BASE_URL);
        var raw = JSON.stringify({
          "long_url": window.location.origin.replace('localhost', '127.0.0.1') + '/api/getM3u?sid=' + theUser.sid + '_' + theUser.acStatus[0] + '&id=' + theUser.id + '&sname=' + theUser.sName + '&tkn=' + token + '&ent=' + theUser.entitlements.map(x => x.pkgId).join('_')
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch("https://api-ssl.bitly.com/v4/shorten", requestOptions)
          .then(response => response.text())
          .then(result => {
            console.log(result);
            setDynamicUrl(JSON.parse(result).link);
          })
          .catch(error => console.log('error', error));
      }
      else
        console.log(window.location.origin.replace('localhost', '127.0.0.1') + '/api/getM3u?sid=' + theUser.sid + '_' + theUser.acStatus[0] + '&id=' + theUser.id + '&sname=' + theUser.sName + '&tkn=' + token + '&ent=' + theUser.entitlements.map(x => x.pkgId).join('_'));
    }
    else
      setDynamicUrl("");
  }, [theUser, token])

  const getOTP = () => {
    setLoading(true);
    let requestOptions = {
      method: 'GET',
    };

    let res = {};

    fetch("https://cors-pub.herokuapp.com/" + "https://kong-tatasky.videoready.tv/rest-api/pub/api/v1/rmn/" + rmn + "/otp", requestOptions)
      .then(response => response.text())
      .then(result => {
        res = JSON.parse(result);
        setLoading(false);
        console.log(res);
        if (res.message.indexOf("OTP generated successfully") === 0) {
          setOtpSent(true);
          setError("");
        }
        else
          setError(res.message);
      })
      .catch(error => {
        console.log('error', error);
        setError(error.toString());
      });
  }

  const authenticateUser = () => {
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("authority", "kong-tatasky.videoready.tv");
    myHeaders.append("sec-ch-ua", "\"Google Chrome\";v=\"93\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"93\"");
    myHeaders.append("locale", "ENG");
    myHeaders.append("user-agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36");
    myHeaders.append("content-type", "application/json");
    myHeaders.append("device_details", "{\"pl\":\"web\",\"os\":\"Linux\",\"lo\":\"en-us\",\"app\":\"1.35.32\",\"dn\":\"PC\",\"bv\":93,\"bn\":\"CHROME\",\"device_id\":\"1aacfdbadea40d5b350887a4fdd7ed771630761468278\",\"device_type\":\"WEB\",\"device_platform\":\"PC\",\"device_category\":\"open\",\"manufacturer\":\"Linux_CHROME_93\",\"model\":\"PC\",\"sname\":\"\"}");
    myHeaders.append("sec-ch-ua-mobile", "?0");
    myHeaders.append("platform", "web");
    myHeaders.append("sec-ch-ua-platform", "\"Linux\"");
    myHeaders.append("accept", "*/*");
    myHeaders.append("origin", "https://watch.tatasky.com");
    myHeaders.append("sec-fetch-site", "cross-site");
    myHeaders.append("sec-fetch-mode", "cors");
    myHeaders.append("sec-fetch-dest", "empty");
    myHeaders.append("referer", "https://watch.tatasky.com/");
    myHeaders.append("accept-language", "en-GB,en;q=0.9");

    // var raw = JSON.stringify({
    //   "rmn": rmn,
    //   "sid": sid,
    //   "authorization": otp,
    //   "loginOption": "OTP"
    // });

    var raw = {
      sid,
      authorization: loginType === 'OTP' ? otp : pwd,
      loginOption: loginType
    };
    if (loginType === 'OTP')
      raw.rmn = rmn;

    raw = JSON.stringify(raw);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw
    };

    let res = {};

    fetch("https://cors-pub.herokuapp.com/" + "https://kong-tatasky.videoready.tv/rest-api/pub/api/v2/login/ott", requestOptions)
      .then(response => response.text())
      .then(result => {
        // debugger;
        res = JSON.parse(result);
        console.log(res);
        if (res.code === 0) {
          let userDetails = res.data.userDetails;
          userDetails.id = res.data.userProfile.id;
          let token = res.data.accessToken;
          setUser(userDetails);
          setToken(token);
          localStorage.setItem("userDetails", JSON.stringify(userDetails));
          localStorage.setItem("token", token);
          setError("");
        }
        else
          setError(res.message);
        setLoading(false);
      })
      .catch(error => {
        console.log('error', error);
        setError(error.toString());
        setLoading(false);
      });
  }




  const logout = () => {
    localStorage.clear();
    setRmn("");
    setSid("");
    setOtpSent(false);
    setOtp("");
    setPwd("");
    setUser(null);
    setToken("");
    setLoading(false);
  }

  return (
    <div>
      {
        <Grid columns='equal' padded centered>
          {
            token === "" || theUser === null ?
              <Grid.Row>
                <Grid.Column></Grid.Column>
                <Grid.Column computer={8} tablet={12} mobile={16}>
                  <Segment loading={loading}>
                    <Form>
                      <Form.Group inline>
                        <label>Login via </label>
                        <Form.Field>
                          <Radio
                            label='OTP'
                            name='loginTypeRadio'
                            value='OTP'
                            checked={loginType === 'OTP'}
                            onChange={(e, { value }) => { setLoginType(value); }}
                          />
                        </Form.Field>
                        <Form.Field>
                          <Radio
                            label='Password'
                            name='loginTypeRadio'
                            value='PWD'
                            checked={loginType === 'PWD'}
                            onChange={(e, { value }) => { setLoginType(value); }}
                          />
                        </Form.Field>
                      </Form.Group>

                      {
                        loginType === 'OTP' ?
                          <>
                            <Form.Field disabled={otpSent}>
                              <label>RMN</label>
                              <input value={rmn} placeholder='Registered Mobile Number' onChange={(e) => setRmn(e.currentTarget.value)} />
                            </Form.Field>
                            <Form.Field disabled={otpSent}>
                              <label>Subscriber ID</label>
                              <input value={sid} placeholder='Subscriber ID' onChange={(e) => setSid(e.currentTarget.value)} />
                            </Form.Field>
                            <Form.Field disabled={!otpSent}>
                              <label>OTP</label>
                              <input value={otp} placeholder='OTP' onChange={(e) => setOtp(e.currentTarget.value)} />
                            </Form.Field>
                            {
                              otpSent ? <Button primary onClick={authenticateUser}>Login</Button> :
                                <Button primary onClick={getOTP}>Get OTP</Button>
                            }
                          </>
                          :
                          <>
                            <Form.Field>
                              <label>Subscriber ID</label>
                              <input value={sid} placeholder='Subscriber ID' onChange={(e) => setSid(e.currentTarget.value)} />
                            </Form.Field>
                            <Form.Field>
                              <label>Password</label>
                              <input type='password' value={pwd} placeholder='Password' onChange={(e) => setPwd(e.currentTarget.value)} />
                            </Form.Field>
                            <Button primary onClick={authenticateUser}>Login</Button>
                          </>
                      }

                    </Form>
                  </Segment>
                </Grid.Column>
                <Grid.Column></Grid.Column>
              </Grid.Row> :
              <Grid.Row>
                <Grid.Column></Grid.Column>
                <Grid.Column computer={8} tablet={12} mobile={16}>
                  <Segment loading={loading}>
                    <Header as="h1">Welcome, {theUser.sName}</Header>
                    {
                      theUser !== null && theUser.acStatus !== "DEACTIVATED" ?
                        <Message>
                          <Message.Header>Dynamic URL to get m3u: </Message.Header>
                          {/* <Image centered src={'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=' + encodeURIComponent(m3uMeta.url)} size='small' /> */}
                          <p>
                            <a href={dynamicUrl}>{dynamicUrl}</a>
                          </p>
                          <p>
                            You can use the above m3u URL in OTT Navigator or Tivimate app to watch all your subscribed channels.
                          </p>
                          <p>
                            The generated m3u URL is for permanent use and is not required to be refreshed every 24 hours. Enjoy!
                          </p>
                        </Message>
                        :
                        <Header as='h3' style={{ color: 'red' }}>Your Tata Sky Connection is deactivated.</Header>
                    }

                    <Button negative onClick={logout}>Logout</Button>
                  </Segment>
                </Grid.Column>
                <Grid.Column></Grid.Column>
              </Grid.Row>
          }
          <Grid.Row style={{ display: err === '' ? 'none' : 'block' }}>
            <Grid.Column></Grid.Column>
            <Grid.Column computer={8} tablet={12} mobile={16}>
              <Message color='red'>
                <Message.Header>Error</Message.Header>
                <p>
                  {err}
                </p>
              </Message>
            </Grid.Column>
            <Grid.Column></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column></Grid.Column>
            <Grid.Column textAlign='center' computer={8} tablet={12} mobile={16}>
              <a href="https://github.com/saifshaikh1805/tata-sky-m3u" target="_blank" rel="noreferrer">View source code on Github</a>
            </Grid.Column>
            <Grid.Column></Grid.Column>
          </Grid.Row>
        </Grid>
      }
    </div>
  )
}
