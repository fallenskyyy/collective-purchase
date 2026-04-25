import {
  Layout,
  Card,
  Form,
  Input,
  Button,
  Typography,
} from "antd";
import axios from "axios";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../shared/hooks/useAuth";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function RegisterPage() {
  const navigate = useNavigate()
  const onFinish = (values) => {
    axios.post(
    "https://collective-purchase-backend-production.up.railway.app/auth/register",
    {
      email: values.email,
      password: values.password,
      name: values.name,
    },
    {
      withCredentials: true
    }
  ).then(
    navigate('/login')
  );
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
        <Card style={{ width: 380 }}>
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
            Регистрация аккаунта
          </Text>

          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="name"
              label="Имя"
              rules={[{ required: true, message: "Введите имя" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Ваше имя" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Введите email" },
                { type: "email", message: "Некорректный email" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="example@mail.com" />
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

            <Form.Item
              name="confirmPassword"
              label="Повтор пароля"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Повторите пароль" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Пароли не совпадают")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Повторите пароль"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Зарегистрироваться
              </Button>
            </Form.Item>

            <div style={{ textAlign: "center" }}>
              <Text type="secondary">Уже есть аккаунт?</Text>{" "}
              <a href="/login">Войти</a>
            </div>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
}