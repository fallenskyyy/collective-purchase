import {
  Typography,
  Button,
  Card,
  Row,
  Col,
  List,
  Avatar,
  Progress,
  Image,
  message
} from "antd";

import { Link } from 'react-router-dom';
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../shared/hooks/useAuth";
import OfferCard from '../shared/OfferCard'

const { Title, Text } = Typography;

export default function HomePage() {
    const handleJoin = async (offerId) => {
    try {
      const response = await axios.post(
        `https://collective-purchase-backend-production.up.railway.app/api/group-purchases/${offerId}/join`,
        {},
        { withCredentials: true }
      );
      
      if (response.data.success) {
        message.success('Вы успешно присоединились!');
        
        setData(prevData => 
          prevData.map(item => 
            item.id === offerId 
              ? { 
                  ...item, 
                  user_joined: true,
                  current_participants: response.data.current_participants 
                }
              : item
          )
        );
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Ошибка при присоединении');
    }
  };

  const [data, setData] = useState([]);
  const [hasJoined, setHasJoined] = useState(false);
  const { user } = useAuth()
  useEffect(() => {  
  const fetchData = async () => {
    try {
      const response = await axios.get("https://collective-purchase-backend-production.up.railway.app/api/group-purchases", {
        withCredentials: true,
      });
      setData(response.data.slice(0, 3));
    } catch (error) {
      if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
        console.log('Request cancelled');
        return;
      }
      console.error('Error:', error);
    } 
  };

  fetchData();
}, []);
  return (
    <>
      <Card style={{ marginBottom: 24 }}>
          <Title>Коллективные закупки — дешевле вместе</Title>
          <Text>
          Объединяйтесь с другими людьми и покупайте товары по оптовым ценам.
          </Text>
          <div style={{ marginTop: 16 }}>
          <Button href="/catalog" type="primary" size="large">
              Найти закупку
          </Button>
          </div>
      </Card>

      <Title level={3}>Активные закупки</Title>

            <Row gutter={[16, 16]}>
              {data.map((item) => {
              const isFull = (item.current_participants || 0) >= item.required_participants;
              const hasJoined = item.user_joined; 
              return(
                <Col 
                  xs={24} 
                  sm={12} 
                  lg={8} 
                  key={item.id}
                  style={{ width:'100%', display: 'flex', flexDirection: 'column' }}
                >
                <OfferCard
                  item={item}
                  user={user}
                  onJoin={handleJoin}
                />
                </Col>
                
              )})}
            </Row>

      <Card style={{ marginTop: 32 }}>
          <Title level={3}>Как это работает</Title>
          <List
          itemLayout="horizontal"
          dataSource={[
              "Создайте или найдите закупку",
              "Дождитесь набора участников",
              "Получите товар по сниженной цене",
          ]}
          renderItem={(item, index) => (
              <List.Item>
              <List.Item.Meta
                  avatar={<Avatar>{index + 1}</Avatar>}
                  title={item}
              />
              </List.Item>
          )}
          />
      </Card>
    </>
  );
}