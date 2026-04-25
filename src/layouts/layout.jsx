import { Outlet } from "react-router-dom";
import { Layout, Typography, Button } from "antd";
import { useAuth } from "../shared/hooks/useAuth";


const { Header, Content, Footer } = Layout;
const { Title } = Typography;


export default function MainLayout() {
const { user, loading } = useAuth();

  return (
    <>
    <Layout style={{ minHeight: "100vh" }}>

      <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

          <Button type="text" href="/">
            <Title style={{ color: "#fff", margin: 0 }} level={4}>
              GroupBuy
            </Title>
          </Button>

      <div style={{ display: "flex", gap: 16 }}>
        <Button style={{ color: "#fff"}} type="link" href="/catalog">Закупки</Button>
        {user ? (
          <Button style={{ color: "#fff"}} type="link" href="/profile">Профиль</Button>
        ) : (
          <Button style={{ color: "#fff"}} type="link" href="/login" type="primary">Войти</Button>
        )}
      </div>

      </Header>

      <Content style={{ padding: 24, width: 1200, margin: "0 auto" }}>
        <Outlet/>
      </Content>

      <Footer style={{ textAlign: "center" }}>
        GroupBuy © 2026
      </Footer>
    </Layout>
    </>
  );
}