import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Button,
  Image,
  Progress,
  Space,
  Divider,
  Spin,
  message,
  Tag
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../shared/hooks/useAuth";

const { Title, Text } = Typography;

const categoryMap = {
  "electronics": "Электроника",
  "jewelery": "Украшения",
  "men's clothing": "Мужская одежда",
  "women's clothing": "Женская одежда",
};

export default function ProductPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [offerData, setOfferData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    if (id) fetchOfferData();
  }, [id]);

  const fetchOfferData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://collective-purchase-backend-production.up.railway.app/api/products/${id}`,
        { withCredentials: true }
      );
      
      console.log('Offer data:', response.data);
      
      setOfferData(response.data);
      setHasJoined(response.data.user_joined || false);
    } catch (error) {
      console.error('Error fetching offer:', error);
      message.error('Не удалось загрузить информацию о закупке');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinPurchase = async () => {
    if (!user) {
      message.warning('Войдите в аккаунт, чтобы присоединиться к закупке');
      navigate('/login');
      return;
    }

    if (hasJoined) {
      message.warning('Вы уже участвуете в этой закупке');
      return;
    }

    try {
      setJoining(true);
      const response = await axios.post(
        `https://collective-purchase-backend-production.up.railway.app/api/group-purchases/${id}/join`,
        {},
        { withCredentials: true }
      );
      
      if (response.data.success) {
        message.success('Вы успешно присоединились к закупке!');
        setHasJoined(true);
        
        setOfferData(prev => ({
          ...prev,
          current_participants: response.data.current_participants
        }));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Не удалось присоединиться';
      message.error(errorMessage);
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!offerData) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 100 }}>
        <Text>Закупка не найдена</Text>
      </div>
    );
  }

  const product = offerData.product;
  const participants = offerData.current_participants || 0;
  const maxParticipants = offerData.required_participants || 0;
  const percent = maxParticipants > 0 ? (participants / maxParticipants) * 100 : 0;
  const spotsLeft = maxParticipants - participants;
  const isFull = spotsLeft <= 0;
  
  const buttonDisabled = isFull || hasJoined || joining || !user;
  const buttonType = buttonDisabled ? 'default' : 'primary';
  
  const getButtonText = () => {
    if (isFull) return 'Группа заполнена';
    if (hasJoined) return 'Вы уже участвуете';
    if (!user) return 'Войдите для участия';
    return 'Присоединиться к закупке';
  };

  return (
    <>
      <Row style={{ maxHeight: 500 }} align={"stretch"} gutter={24}>
        <Col xs={24} md={10} style={{ display: "flex" }}>
          <Card style={{ width: "100%" }}>
            <div
              style={{
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Image
                src={product?.image_url || product?.image}
                style={{
                  maxWidth: "100%",
                  maxHeight: 500,
                  objectFit: "contain",
                }}
                fallback="https://via.placeholder.com/300x300?text=No+Image"
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={14} style={{ display: "flex" }}>
          <Card style={{ width: "100%" }}>
            <Space orientation="vertical" size={16} style={{ width: "100%" }}>
              <Title level={3}>{product?.name || product?.title}</Title>

              <Text type="secondary">
                {categoryMap[product?.category] || product?.category}
              </Text>

              {offerData.discount_percentage && (
                <Tag color="red">Скидка {offerData.discount_percentage}%</Tag>
              )}

              <div>
                <Title level={4} style={{ marginBottom: 0 }}>
                  {product?.price} €
                </Title>
              </div>

              <Divider />

              <div>
                <Text>
                  Участников: {participants} / {maxParticipants}
                  {spotsLeft > 0 && !isFull && (
                    <Text type="secondary"> (осталось {spotsLeft} мест)</Text>
                  )}
                </Text>
                <Progress 
                  percent={Math.round(percent)} 
                  status={isFull ? "success" : "active"}
                />
              </div>

              <Button 
                type={buttonType}
                size="large" 
                block
                onClick={handleJoinPurchase}
                loading={joining}
                disabled={buttonDisabled}
              >
                {getButtonText()}
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 24 }}>
        <Title level={4}>Описание</Title>
        <Text>{product?.description}</Text>
        
        {product?.specifications && (
          <>
            <Divider />
            <Title level={5}>Характеристики</Title>
            <Text>{product.specifications}</Text>
          </>
        )}
      </Card>
    </>
  );
}