import { Card, Typography, Button, Progress, Image, Tag } from "antd";
import { Link } from 'react-router-dom';
import { useAuth } from "./hooks/useAuth";

const { Title, Text } = Typography;

const OfferCard = ({ 
  item, 
  user, 
  loading = false, 
  onJoin 
}) => {

  const {
    id,
    product_id,
    product,
    current_participants = 0,
    required_participants = 0,
    user_joined = false
  } = item;

  const isFull = current_participants >= required_participants;
  const hasJoined = user_joined;
  const percent = required_participants > 0 
    ? (current_participants / required_participants) * 100 
    : 0;
  
  const offerId = id;
  
  const buttonDisabled = isFull || hasJoined || !user || loading;
  const buttonType = buttonDisabled ? 'default' : 'primary';
  
  const getButtonText = () => {
    if (isFull) return 'Группа заполнена';
    if (hasJoined) return 'Вы уже участвуете';
    if (!user) return 'Войдите для участия';
    return 'Присоединиться';
  };

  const handleClick = () => {
    if (!buttonDisabled && onJoin) {
      onJoin(offerId);
    }
  };

  return (
    <Card 
      hoverable 
      style={{ 
        width: '100%',
        height: '100%',
        display: "flex", 
        flexDirection: "column" 
      }}
      bodyStyle={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column" 
      }}
    >
      <Link to={`/product/${offerId}`} style={{ flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Title level={5} style={{ margin: 0, minHeight: 44 }}>
            {product?.name || 'Без названия'}
          </Title>
          
          <Text strong>Цена: {product?.price || 0}€</Text>
          
          <Image 
            style={{ 
              height: 180, 
              width: "100%", 
              objectFit: "contain" 
            }}
            preview={false}
            src={product?.image_url}
            fallback="https://via.placeholder.com/300x180?text=No+Image"
            alt={product?.name}
          />
          
          <div>
            <Text type="secondary">
              Участников: {current_participants} / {required_participants}
            </Text>
            <Progress 
              percent={percent} 
              size="small"
              showInfo={false}
              status={isFull ? "success" : "active"}
              strokeColor={isFull ? "#52c41a" : undefined}
            />
          </div>
        </div>
      </Link>
      
      <Button 
        type={buttonType}
        block 
        style={{ marginTop: 16 }}
        disabled={buttonDisabled}
        loading={loading}
        onClick={handleClick}
      >
        {getButtonText()}
      </Button>
    </Card>
  );
};

export default OfferCard;