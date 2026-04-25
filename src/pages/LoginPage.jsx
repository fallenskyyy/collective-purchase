import {
  Layout,
  Card,
  Form,
  Input,
  Button,
  Typography,
  Checkbox,
  message
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../shared/hooks/useAuth";
import axios from "axios";


const { Content } = Layout;
const { Title, Text } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, setUser, loading } = useAuth();

  const onFinish = async (values) => {
    try {
      const data = await axios.post(
        "https://collective-purchase-backend-production.up.railway.app/auth/login",
        { email: values.email, password: values.password },
        {
          withCredentials: true,
        }
      );

      setUser(data.user);
      navigate("/");
      navigate(0)
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
          error.message || 
          'Ошибка при входе';
      message.error(errorMessage);
    }
  };

  return (
    <Layout style={{ minHeight: "80vh" }}>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <Card style={{ width: 360 }}>
          <Title level={3} style={{ textAlign: "center", marginBottom: 0 }}>
            GroupBuy
          </Title>

          <Text
            type="secondary"
            style={{
              display: "block",
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            Вход в аккаунт
          </Text>

          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Введите email" },
                { type: "email", message: "Некорректный email" },
              ]}
            >
                <Input
                prefix={<UserOutlined />}
                placeholder="example@mail.com"
                />
            </Form.Item>

            <Form.Item
              name="password"
              label="Пароль"
              rules={[{ required: true, message: "Введите пароль" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Пароль"
              />
            </Form.Item>

            <Form.Item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Checkbox>Запомнить меня</Checkbox>
                <a href="#">Забыли пароль?</a>
              </div>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Войти
              </Button>
            </Form.Item>

            <div style={{ textAlign: "center" }}>
              <Text type="secondary">Нет аккаунта?</Text>{" "}
              <a href="/register">Регистрация</a>
            </div>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
}