import {
  Typography,
  Button,
  Card,
  Row,
  Col,
  List,
  Avatar,
} from "antd";

const { Title, Text } = Typography;

const mockPurchases = [
  {
    title: "iPhone 15 (оптом)",
    participants: 12,
    price: "850€",
  },
  {
    title: "Ноутбуки Dell",
    participants: 8,
    price: "720€",
  },
  {
    title: "Кофе зерновой (10 кг)",
    participants: 20,
    price: "12€/кг",
  },
];

export default function HomePage() {
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
        <Button style={{ marginLeft: 8 }} size="large">
            Создать закупку
        </Button>
        </div>
    </Card>

    <Title level={3}>Активные закупки</Title>

    <Row gutter={[16, 16]}>
        {mockPurchases.map((item, index) => (
        <Col xs={24} md={8} key={index}>
            <Card title={item.title}>
            <p>Участников: {item.participants}</p>
            <p>Цена: {item.price}</p>
            <Button type="primary" block>
                Присоединиться
            </Button>
            </Card>
        </Col>
        ))}
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