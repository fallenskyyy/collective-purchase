import { Card, Typography, Button, Spin, Space, Row } from "antd";
import { useAuth } from "../shared/hooks/useAuth";
import axios from "axios";
import { Navigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function ProfilePage() {
  const { user, loading, setUser } = useAuth();

  if (loading) {
    return <Spin />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://collective-purchase-backend-production.up.railway.app/auth/logout",
        {},
        { withCredentials: true }
      );

      setUser(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Row>
        <Card style={{ maxWidth: 600, margin: "0 auto" }}>
        <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
            <Title level={3}>Профиль</Title>

            <div>
            <Text strong>ID:</Text>
            <br />
            <Text>{user.id}</Text>
            </div>

            <div>
            <Text strong>Email:</Text>
            <br />
            <Text>{user.email}</Text>
            </div>

            {user.name && (
            <div>
                <Text strong>Имя:</Text>
                <br />
                <Text>{user.name}</Text>
            </div>
            )}

            <Button danger onClick={handleLogout}>
            Выйти
            </Button>
        </Space>
        </Card>
    </Row>
  );
}