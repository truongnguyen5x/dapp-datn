import React, { useState, useEffect } from 'react'
import Web3 from 'web3'
import { Row, Col, Card, Divider, Input, Form, Button, Select } from 'antd'

import token from "../sdk/TK1/frontend"

const tokenSymbol = "TK1"
const { Option } = Select;


const Dapp1 = (props) => {
    const [acc, setAcc] = useState("")
    const [eth, setETH] = useState(0)
    const [balance, setBalance] = useState(0)
    const [contract, setContract] = useState(null)
    const [decimal, setDecimal] = useState(0)
    const [receiver, setReceiver] = useState("")
    const [amount, setAmount] = useState("")
    const [receiver2, setReceiver2] = useState("")
    const [listToken, setListToken] = useState([])
    const [selectedSwapToken, setSelectedSwapToken] = useState("")
    const [amount2, setAmount2] = useState(0)
    const [listSend, setListSend] = useState([]);
    const [listReceiver, setListReceiver] = useState([]);

    useEffect(() => {
        const enable = ethEnabled()
        if (enable) {
            window.web3.eth.getAccounts().then(res => {
                console.log("🚀 ~ file: Dapp1.js ~ line 11 ~ useEffect ~ res", res)
                setAcc(res[0])

                window.web3.eth.getBalance(res[0])
                    .then(res1 => {
                        console.log("🚀 ~ file: Dapp1.js ~ line 16 ~ window.web3.eth.getAccounts ~ res1", res1)
                        setETH(window.web3.utils.fromWei(res1))
                    })
                const tkContract = new token(window.web3)
                setContract(tkContract)
                tkContract.balanceOf(res[0])
                    .then(tkBalance => {
                        console.log("🚀 ~ file: Dapp1.js ~ line 28 ~ window.web3.eth.getAccounts ~ tkBalance", tkBalance)
                        tkContract.decimals()
                            .then(decimal => {
                                setDecimal(decimal);
                                setBalance(tkBalance / Math.pow(10, decimal))
                            })
                    })

                tkContract.getListVchainToken()
                    .then(res => {
                        setListToken(res.slice(1, res.length).filter(i => i != tokenSymbol))
                    })
                tkContract.getListSwap()
                    .then(res2 => {
                        const temp = res2.slice(1, res2.length).filter(i => {
                            if (i.tkApay != tokenSymbol) return false;
                            if (i.userA != res[0]) return false
                            return true
                        })
                        setListSend(temp)
                        const temp2 = res2.slice(1, res2.length).filter(i => {
                            if (i.tkAwant != tokenSymbol) return false;
                            if (i.userB != res[0]) return false
                            return true
                        })
                        setListReceiver(temp2)
                        console.log(temp2)
                    })
            })
        }
    }, [])


    const ethEnabled = () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);

            window.ethereum.enable();
            return true;
        }
        return false;
    }

    const onChangeReceiver = (e) => {
        setReceiver(e.target.value)
    }

    const onChangeReceiver2 = (e) => {
        setReceiver2(e.target.value)
    }

    const onChangeAmount = (e) => {
        setAmount(e.target.value)
    }

    const onChangeAmount2 = (e) => {
        setAmount2(e.target.value)
    }

    const onSendToken = e => {
        console.log(receiver, amount * Math.pow(10, decimal))
        contract.transfer(receiver, amount * Math.pow(10, decimal) + "", acc)
            .then(res => {
                console.log(res)
                alert("transfer success")
            })
    }

    const onSelectToken = e => {
        console.log(e)
        setSelectedSwapToken(e)
    }
    const onCreateSwapRequest = (e) => {
        contract.userCreateSwap(receiver2, selectedSwapToken, amount2 * Math.pow(10, decimal) + "", acc)
            .then(res => {
                console.log(res)
                alert('create request swap success')
            })
    }

    const onExecSwap = (e) => {
        contract.useAcceptSwap(e.userA, acc)
            .then(res => {
                console.log(res)
                alert("swap success")
            })
    }

    const onDenySwap = (e) => {
        contract.userDenySwap(e.userA, acc)
            .then(res => {
                console.log(res)
                alert("deny swap success")
            })
    }

    const onDeleteSwap = (e) => {
        contract.userDeleteSwap(e.userB, e.tkAwant, acc)
            .then(res => {
                console.log(res)
                alert('delete swap success')
            })
    }

    return <React.Fragment>
        <Row>

            <Col span={6}>
            </Col>
            <Col span={12}>
                <Card>
                    <h2>Token {tokenSymbol}</h2>
                    <Divider />
                    <div>
                        Current account: {acc}
                    </div>
                    <Divider />
                    <Row>
                        <Col span={12}>
                            <div className="text-center">
                                <img width="50px" height="50px" src="images/eth_logo.svg" />
                            </div>
                            <div className="text-center">
                                <h3>{eth} ETH</h3>
                            </div>
                        </Col>
                        <Col span={12}>

                            <div className="text-center">
                                <img width="50px" height="50px" src="images/no-image.png" />
                            </div>
                            <div className="text-center">
                                <h3>{balance} {tokenSymbol}</h3>
                            </div>
                        </Col>

                    </Row>

                    <Divider />
                    <br />
                    <div>
                        <h4> Send inside {tokenSymbol}</h4>
                        <Row>
                            <Col md={16} className="pr-1">
                                <Form.Item
                                    label="Receiver"
                                    name="receiver"
                                >
                                    <Input
                                        placeholder="Receiver's address"
                                        value={receiver}
                                        onChange={onChangeReceiver}
                                    />
                                </Form.Item>

                            </Col>
                            <Col md={8}>
                                <Form.Item
                                    label={`Amount ${tokenSymbol}`}
                                    name="amount"
                                >
                                    <Input
                                        placeholder={`${tokenSymbol} to send`}
                                        type="number"
                                        value={amount}
                                        onChange={onChangeAmount}
                                    />
                                </Form.Item>

                            </Col>

                        </Row>
                        <Button
                            type="primary"
                            onClick={onSendToken}>
                            Send {amount} {tokenSymbol}
                        </Button>
                    </div>
                    <Divider />
                    <br />
                    <h4> Swap  {selectedSwapToken ? `vs ${selectedSwapToken}` : ` token`}</h4>
                    <Row>
                        <Col md={16}>
                            <Form.Item
                                label="Receiver"
                                name="receiver2"
                            >
                                <Input
                                    placeholder="Address to swap token"
                                    value={receiver2}
                                    onChange={onChangeReceiver2}
                                />
                            </Form.Item>
                        </Col>
                        <Col md={8} className="pl-2" >
                            <Select
                                placeholder="Token to swap"
                                style={{ width: "100%" }}
                                onSelect={onSelectToken}>
                                {listToken.map((i, idx) => <Option value={i} key={idx}>
                                    {i}
                                </Option>)}
                            </Select>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Form.Item
                                label="Amount"
                                name="amount2"
                            >
                                <Input
                                    placeholder={`Amount token ${selectedSwapToken} want to have`}
                                    value={amount2}
                                    onChange={onChangeAmount2}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Button
                        type="primary"
                        onClick={onCreateSwapRequest}
                    >
                        Reques to swap
                    </Button>
                    <Divider />
                    <br />
                    <h4>My list send request swap</h4>
                    {
                        listSend.map((i, idx) => <Card key={idx}>
                            <div className="d-flex justify-content-between">
                                <div>
                                    To:  {i.userB}
                                </div>
                                <div>
                                    <div> To get token {i.tkAwant}</div>
                                    <div>Value {i.value}</div>
                                </div>
                                <div>
                                    <Button
                                        danger
                                        onClick={() => onDeleteSwap(i)}>
                                        Remove request
                                    </Button>
                                </div>
                            </div>

                        </Card>)
                    }

                    <Divider />
                    <br />

                    <h4>My list request swap incoming </h4>
                    {
                        listReceiver.map((i, idx) => <Card key={idx}>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <div> From:  {i.userA}</div>
                                    <div>Value {i.value}</div>
                                </div>
                                <div>
                                    Pay by token {i.tkApay}
                                </div>
                                <div>
                                    <Button
                                        onClick={() => onExecSwap(i)}
                                        className="mr-2"
                                        type="primary"
                                    >
                                        Swap
                                    </Button>
                                    <Button
                                        onClick={() => onDenySwap(i)}
                                        danger>
                                        Deny
                                    </Button>
                                </div>

                            </div>

                        </Card>)
                    }

                </Card>

            </Col>

        </Row>

    </React.Fragment>
}
export default Dapp1