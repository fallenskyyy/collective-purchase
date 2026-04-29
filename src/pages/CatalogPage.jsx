import {
  Layout,
  Row,
  Col,
  Card,
  Input,
  Select,
  Slider,
  Button,
  Typography,
  Progress,
  Image,
  Spin,
  Empty,
  message
} from "antd";
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../shared/hooks/useAuth";
import OfferCard from '../shared/OfferCard'

const { Content } = Layout;
const { Title, Text } = Typography;

export default function CatalogPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState();
  const [price, setPrice] = useState([0, 1000]);
  const [joining, setJoining] = useState(false);
  const { user } = useAuth()

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

useEffect(() => {
  const abortController = new AbortController();
  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axios.get("https://collective-purchase-backend-production.up.railway.app/api/group-purchases", {
        withCredentials: true,
      });
      setData(response.data);
      console.log(data)
      setLoading(false)
    } catch (error) {
      if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
        console.log('Request cancelled');
        return;
      }
      console.error('Error:', error);
    } 
  };

  fetchData();

  return () => {
    abortController.abort();
  };
}, [user]);

  const filtered = data.filter((item) => {
    return (
      item.product.name.toLowerCase().includes(search.toLowerCase()) &&
      (!category || item.product.category === category) &&
      item.product.price >= price[0] &&
      item.product.price <= price[1]
    );
  });

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <Title level={2}>Каталог закупок</Title>

      <Row gutter={24}>
        <Col xs={24} md={6}>
          <Card title="Фильтры">
            <div style={{ marginBottom: 16 }}>
              <Text>Поиск</Text>
              <Input
                placeholder="Название..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text>Категория</Text>
              <Select
                style={{ width: "100%" }}
                placeholder="Выбрать"
                allowClear
                onChange={setCategory}
                value={category}
                options={[
                  { value: "Электроника", label: "Электроника" },
                  { value: "Украшения", label: "Украшения" },
                  { value: "Мужская одежда", label: "Мужская одежда" },
                  { value: "Женская одежда", label: "Женская одежда" },
                ]}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text>Цена: €{price[0]} - €{price[1]}</Text>
              <Slider
                range
                min={0}
                max={1000}
                value={price}
                onChange={setPrice}
              />
            </div>

            <Button block onClick={() => {
              setSearch("");
              setCategory(undefined);
              setPrice([0, 1000]);
            }}>
              Сбросить
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={18} style={{ width: "100%" }}>
          {filtered.length === 0 ? (
            <Card>
              <Empty
                description={
                  <span>
                    Товары не найдены<br />
                    <Text type="secondary">Попробуйте изменить параметры фильтра</Text>
                  </span>
                }
              />
            </Card>
          ) : (
            <Row gutter={[16, 16]}>
              {filtered.map((item) => {
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
                  loading={joining}
                  onJoin={handleJoin}
                />
                </Col>
                
              )})}
            </Row>
          )}
        </Col>
      </Row>
    </>
  );
}