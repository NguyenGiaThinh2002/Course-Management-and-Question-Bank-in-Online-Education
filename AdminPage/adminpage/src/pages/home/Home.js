import React from 'react'
import Body from '../../components/body/Body'
import Header from '../../components/header/Header'
import Sidebar from '../../components/sidebar/Sidebar'
import '../home/home.css'
import { Row , Col } from 'antd'
export default function Home() {
  return (
    <div className='home'>
    <Row span={24}>
      <Col span={24}>
        <Header ></Header>
      </Col>
      <Col span={24} className='home-container'>
        <Sidebar ></Sidebar>
        <Body ></Body>
      </Col>
      <Col span={24}>
      </Col>
    </Row>
    <Row>

    </Row>
    </div>
  )
}
