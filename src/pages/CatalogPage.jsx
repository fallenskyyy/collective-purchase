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
} from "antd";
import { useState } from "react";

const { Content } = Layout;
const { Title, Text } = Typography;

const mockData = [
  {
    id: 1,
    title: "iPhone 15",
    price: 850,
    participants: 12,
    maxParticipants: 20,
    category: "Электроника",
  },
  {
    id: 2,
    title: "Кофе зерновой",
    price: 12,
    participants: 18,
    maxParticipants: 20,
    category: "Продукты",
  },
  {
    id: 3,
    title: "Наушники Sony",
    price: 120,
    participants: 5,
    maxParticipants: 15,
    category: "Электроника",
  },
];

export default function CatalogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState();
  const [price, setPrice] = useState([0, 1000]);

  const filtered = mockData.filter((item) => {
    return (
      item.title.toLowerCase().includes(search.toLowerCase()) &&
      (!category || item.category === category) &&
      item.price >= price[0] &&
      item.price <= price[1]
    );
  });

  return (
      <Content style={{ padding: 24, width: 1200, margin: "0 auto" }}>
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
                  options={[
                    { value: "Электроника", label: "Электроника" },
                    { value: "Продукты", label: "Продукты" },
                  ]}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <Text>Цена</Text>
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

          {/* PRODUCTS */}
          <Col xs={24} md={18}>
            <Row gutter={[16, 16]}>
              {filtered.map((item) => {
                const percent =
                  (item.participants / item.maxParticipants) * 100;

                return (
                  <Col xs={24} sm={12} lg={8} key={item.id}>
                    <Card title={item.title}>
                      <Text>Цена: {item.price}€</Text>
                      <br />
                      <Text>
                        Участников: {item.participants} /{" "}
                        {item.maxParticipants}
                      </Text>

                      <Progress percent={Math.round(percent)} />

                      <Button type="primary" block>
                        Присоединиться
                      </Button>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
      </Content>
  );
}