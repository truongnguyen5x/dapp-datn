import React, { useState, useEffect } from 'react'
import Web3 from 'web3'
import { Row, Col, Card, Divider, Input, Form, Button, Select } from 'antd'

import token from "../sdk/index"

const { Option } = Select;


const Dapp1 = () => {
    const [tokenSymbol, setTokenSymbol] = useState('')
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
            fetchData()
        }
    }, [])

    const fetchData = async () => {
        const tkContract = new token(window.web3)
        setContract(tkContract)
        const listAccMetamask = await window.web3.eth.getAccounts();
        setAcc(listAccMetamask[0])
        const symbol = await tkContract.symbol()
        tkContract.getListVchainToken()
            .then(res2 => {
                setListToken(res2.slice(1, res2.length).filter(i => i != symbol))
            })
        setTokenSymbol(symbol)
        const decimal = await tkContract.decimals()
        setDecimal(decimal)

        window.web3.eth.getBalance(listAccMetamask[0])
            .then(res1 => {
                // console.log("🚀 ~ file: Dapp1.js ~ line 16 ~ window.web3.eth.getAccounts ~ res1", res1)
                setETH(window.web3.utils.fromWei(res1))
            })

        tkContract.balanceOf(listAccMetamask[0])
            .then(tkBalance => {
                // console.log("🚀 ~ file: Dapp1.js ~ line 28 ~ window.web3.eth.getAccounts ~ tkBalance", tkBalance)
                setBalance(tkBalance / Math.pow(10, decimal))
            })

        tkContract.getListSwap()
            .then(res2 => {
                // console.log(res2)
                const temp = res2.slice(1, res2.length).filter(i => {
                    if (i.tkApay != symbol) return false;
                    if (i.userA != listAccMetamask[0]) return false
                    return true
                })
                setListSend(temp)
                const temp2 = res2.slice(1, res2.length).filter(i => {
                    if (i.tkAwant != symbol) return false;
                    if (i.userB != listAccMetamask[0]) return false
                    return true
                })
                setListReceiver(temp2)
                // console.log(temp2)
            })

        window.ethereum.on('accountsChanged', (accounts) => {
            setAcc(accounts[0])
            tkContract.balanceOf(accounts[0])
                .then(tkBalance => {
                    // console.log("🚀 ~ file: Dapp1.js ~ line 28 ~ window.web3.eth.getAccounts ~ tkBalance", tkBalance)
                    setBalance(tkBalance / Math.pow(10, decimal))
                })
            window.web3.eth.getBalance(accounts[0])
                .then(e => {
                    setETH(window.web3.utils.fromWei(e))
                })
        });

        window.ethereum.on('chainChanged', (chainId) => {
            // setNetId(res.utils.hexToNumber(chainId))
            window.web3.eth.getAccounts().then(listAcc => {
                window.web3.eth.getBalance(listAcc[0])
                    .then(e => {
                        setETH(window.web3.utils.fromWei(e))
                    })

                tkContract.balanceOf(listAcc[0])
                    .then(tkBalance => {
                        // console.log("🚀 ~ file: Dapp1.js ~ line 28 ~ window.web3.eth.getAccounts ~ tkBalance", tkBalance)
                        setBalance(tkBalance / Math.pow(10, decimal))
                    })


            })
        });
    }

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



    const onSendToken = async e => {
        // console.log(receiver, amount * Math.pow(10, decimal))
        await contract.transfer(receiver, amount * Math.pow(10, decimal) + "", acc)
        // alert("transfer success"      
    }

    const onSelectToken = e => {
        // console.log(e)
        setSelectedSwapToken(e)
    }
    const onCreateSwapRequest = (e) => {
        contract.userCreateSwap(receiver2, selectedSwapToken, amount2 * Math.pow(10, decimal) + "", acc)
            .then(res => {
                console.log(res)
                // alert('create request swap success')
            })
    }

    const onExecSwap = (e) => {
        contract.useAcceptSwap(e.userA, acc)
            .then(res => {
                console.log(res)
                // alert("swap success")
            })
    }

    const onDenySwap = (e) => {
        contract.userDenySwap(e.userA, acc)
            .then(res => {
                console.log(res)
                // alert("deny swap success")
            })
    }

    const onDeleteSwap = (e) => {
        contract.userDeleteSwap(e.userB, e.tkAwant, acc)
            .then(res => {
                console.log(res)
                // alert('delete swap success')
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
                                <img width="50px" height="50px" src="images/no-image.png" style={{ borderRadius: '50%' }} />
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
                        <Row >
                            <Col md={16} className="pr-1">
                                <Form.Item
                                    label="Receiver"
                                    name="receiver"
                                    className="mb-1"
                                >
                                    <Input
                                        placeholder="Receiver's address"
                                        value={receiver}
                                        onChange={onChangeReceiver}
                                    />
                                </Form.Item>

                            </Col>
                            <Col md={8}>
                                {/* <Form.Item
                                    label={`Amount ${tokenSymbol}`}
                                    name="amount"
                                > */}
                                <Input
                                    placeholder={`${tokenSymbol} to send`}
                                    type="number"
                                    value={amount}
                                    onChange={onChangeAmount}
                                />
                                {/* </Form.Item> */}

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
                                className="mb-1"
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
                                className="mb-1"
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
                                    <div>
                                        To:  {i.userB}
                                    </div>
                                    <div>
                                        <div> To get token {i.tkAwant}</div>
                                        <div>Value {i.value}</div>
                                    </div>
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
                                    <div>
                                        <div> From:  {i.userA}</div>
                                        <div>Value {i.value}</div>
                                    </div>
                                    <div>
                                        Pay by token {i.tkApay}
                                    </div>
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